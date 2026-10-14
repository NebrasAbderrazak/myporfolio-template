<#
  Builds the site and uploads /out to your VPS with scp.

  Usage, from the project folder:
    npm run deploy                  build, upload, switch the live version
    npm run deploy -- -SkipBuild    upload the existing /out as it is

  Settings come from .env.deploy (copy .env.deploy.example). Nothing secret is
  stored: with an SSH key, set DEPLOY_SSH_KEY to its path; without one, ssh and
  scp ask for your password in this terminal.

  Layout on the server:
    DEPLOY_PATH/releases/<timestamp>/        one folder per deploy, last 5 kept
    DEPLOY_PATH/current -> releases/<...>    what nginx serves
  Switching the "current" link is instant, so visitors never see a half upload.
#>
param([switch]$SkipBuild)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# --- Settings ---------------------------------------------------------------
$envFile = Join-Path $root '.env.deploy'
if (-not (Test-Path $envFile)) {
  throw 'Missing .env.deploy. Copy .env.deploy.example to .env.deploy and fill it in.'
}
$cfg = @{}
foreach ($line in Get-Content $envFile -Encoding UTF8) {
  $line = $line.TrimStart([char]0xFEFF)
  if ($line -match '^\s*([A-Z_]+)\s*=\s*(.*?)\s*$') {
    $cfg[$Matches[1]] = $Matches[2].Trim('"').Trim("'")
  }
}
foreach ($key in 'DEPLOY_HOST', 'DEPLOY_USER', 'DEPLOY_PATH') {
  if (-not $cfg[$key]) { throw "$key is empty in .env.deploy" }
}
$port = if ($cfg['DEPLOY_PORT']) { $cfg['DEPLOY_PORT'] } else { '22' }
$path = $cfg['DEPLOY_PATH'].TrimEnd('/')
if ($path -notmatch '^/[A-Za-z0-9._/-]+$' -or $path -eq '/') {
  throw 'DEPLOY_PATH must be an absolute folder like /var/www/nebras-portfolio'
}
$target = "$($cfg['DEPLOY_USER'])@$($cfg['DEPLOY_HOST'])"
$keyArgs = @()
if ($cfg['DEPLOY_SSH_KEY']) { $keyArgs = @('-i', $cfg['DEPLOY_SSH_KEY']) }

# --- Build ------------------------------------------------------------------
if (-not $SkipBuild) {
  Write-Host '==> Building' -ForegroundColor Green
  npm run build
  if ($LASTEXITCODE -ne 0) { throw 'Build failed. Nothing was uploaded.' }
}
if (-not (Test-Path (Join-Path $root 'out\index.html'))) {
  throw 'out\index.html not found. Run npm run build first.'
}

# --- Pack -------------------------------------------------------------------
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$archive = Join-Path ([IO.Path]::GetTempPath()) "nebras-portfolio-$stamp.tar.gz"
Write-Host "==> Packing out\ ($archive)" -ForegroundColor Green
tar -czf $archive -C (Join-Path $root 'out') .
if ($LASTEXITCODE -ne 0) { throw 'Packing failed.' }

$release = "$path/releases/$stamp"
try {
  # --- Upload ---------------------------------------------------------------
  $remoteArchive = "/tmp/nebras-portfolio-$stamp.tar.gz"
  Write-Host "==> Uploading to $target" -ForegroundColor Green
  scp -P $port @keyArgs $archive "${target}:$remoteArchive"
  if ($LASTEXITCODE -ne 0) { throw 'Upload failed. The live site was not changed.' }

  # --- Switch ---------------------------------------------------------------
  $steps = @(
    "mkdir -p $release",
    "tar -xzf $remoteArchive -C $release",
    "rm -f $remoteArchive",
    "chmod -R a+rX $release",
    "ln -sfn $release $path/current.tmp",
    "mv -Tf $path/current.tmp $path/current",
    "cd $path/releases",
    "(ls -1t | tail -n +6 | xargs -r rm -rf)"
  )
  Write-Host '==> Switching the live version' -ForegroundColor Green
  ssh -p $port @keyArgs $target ($steps -join ' && ')
  if ($LASTEXITCODE -ne 0) { throw 'The server step failed. The previous version is still live.' }
}
finally {
  Remove-Item $archive -ErrorAction SilentlyContinue
}

Write-Host "==> Live: $release" -ForegroundColor Green
