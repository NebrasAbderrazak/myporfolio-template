# nebras-portfolio

My personal site. Next.js (App Router) + TypeScript + Tailwind CSS, exported as
plain static files and served by nginx on my VPS. Motion for animation, Lenis
for smooth scrolling. Projects and updates are MDX files.

- Fonts: Instrument Serif (headlines) and Schibsted Grotesk (text), downloaded
  at build time and served from this site.
- Colours: warm paper `#f2f0eb`, ink `#121411`, green `#45712a` / `#7cb83f`.
  All tokens, the light beams and the CSS device mockups are in `src/app/globals.css`.
- Home page: hero, selected work, about, toolbox, updates, "find me here", and
  the dark contact footer that closes every page.

---

## 1. Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Pages reload as you edit.

## 2. Fill in your details first

| What | Where |
| --- | --- |
| Full name, domain, public email, social links | `src/lib/site.ts` (every `TODO`) |
| Your photo | `public/me.jpg` (square, at least 600×600 px) |
| About text, headline, every other sentence on the site | `src/i18n/en.ts` |
| Remove the sample projects and updates | `content/projects/sample-*.mdx`, `content/updates/*placeholder*.mdx`, `public/projects/sample-*` |

Social links marked `placeholder: true` are shown on the site but left out of
the search-engine data (JSON-LD). Set `placeholder: false` once the link is real.

## 3. Add a project

```bash
npm run new:project
```

It asks for a title, summary, tags, role, link and date, then creates
`content/projects/<name>.mdx` and the image folder `public/projects/<name>/`.

1. Put a screenshot at `public/projects/<name>/cover.jpg`. The site draws the laptop/phone
   around it, so use a plain screenshot (no mockup of your own).
2. Write the case study in the `.mdx` file (normal Markdown).
3. Extra screenshots go in the same folder:
   `![What it shows](/projects/<name>/screen-1.jpg "Optional caption")`

Frontmatter fields:

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `summary` | yes | One sentence, shown in lists and in search results |
| `date` | yes | `YYYY-MM-DD`, newest first |
| `tags` | no | `["PHP", "MySQL"]`. The first two show as pills on the card; all of them fill "Built with" |
| `cover` | no | Screenshot under `/public`. Desktop screenshots 16:10 (e.g. 1920×1200), phone screenshots about 1170×2532. Without it a monogram is shown |
| `mockup` | no | `laptop` (default), `phone`, `browser` or `none`: the frame drawn around the screenshot |
| `icon` | no | Square logo shown above the case-study title. Without it, the first letter of the title |
| `mission` | no | One or two sentences for the "Mission" column. Falls back to the summary |
| `coverAlt` | no | Describe the image for screen readers |
| `link` | no | Live site URL |
| `role` | no | What you did |
| `featured` | no | `true` = shown on the home page (if none are featured, the newest are shown) |
| `placeholder` | no | `true` adds a "Placeholder" badge |

Files starting with `_` are ignored, which is handy for drafts.

## 4. Add an update

```bash
npm run new:update
```

Creates `content/updates/<date>-<title>.mdx`. Updates are short posts: a title
and a few sentences. The home page shows the latest four; `/updates/` shows all.

## 5. Images

You only ever add normal `.jpg`, `.png` or `.webp` files to `/public`.
Before every `dev` and `build`, `scripts/optimize-images.mjs` creates WebP
versions in 8 widths (`public/_img/`, not committed) and a small blurred
preview, so `next/image` serves the right size to each screen even though
there is no image server. If you add an image while `npm run dev` is running,
run `npm run images` (or restart dev).

## 6. Build and check the real output

```bash
npm run build
npm run preview
```

`build` writes the whole site to `/out`. `preview` serves `/out` at
http://localhost:4173 with the same URL rules, 404 page and headers as the
nginx config, so what you see there is what goes live.

On Windows, `build` also runs `scripts/postbuild.mjs`, which fixes a Next.js
export bug that puts some navigation files in the wrong folder.

---

## 7. Deploy to your VPS

These steps assume Ubuntu/Debian with nginx. Replace `example.com` with your
domain and `deploy` with your server user. Run the server commands over SSH
yourself; nothing in this project stores a password or key.

### One-time server setup

**a. Point the domain at the VPS.** In your DNS, add an `A` record for
`example.com` and for `www.example.com` with your VPS IP.

**b. Install nginx and certbot, create the folder** (on the server):

```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
sudo mkdir -p /var/www/nebras-portfolio/releases
sudo chown -R deploy:deploy /var/www/nebras-portfolio
```

**c. Copy the nginx config** (from this project folder on your PC, in PowerShell):

```bash
scp deploy/nginx/nebras-portfolio.conf deploy/nginx/security-headers.conf deploy@YOUR_SERVER_IP:/tmp/
```

Then on the server, after replacing `example.com` in the file:

```bash
sudo nano /tmp/nebras-portfolio.conf
sudo mv /tmp/nebras-portfolio.conf /etc/nginx/sites-available/nebras-portfolio
sudo mv /tmp/security-headers.conf /etc/nginx/snippets/nebras-security-headers.conf
sudo ln -s /etc/nginx/sites-available/nebras-portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

The config sets up gzip, caching (1 year for hashed build files, 1 week for
images, revalidate for pages), security headers, the 404 page and blocks
hidden files.

**d. First deploy** (on your PC, see below), then open `http://example.com`.

**e. HTTPS with Let's Encrypt** (on the server, once the site works on http):

```bash
sudo certbot --nginx -d example.com -d www.example.com
sudo certbot renew --dry-run
```

Certbot adds the HTTPS server and the http → https redirect, and renews the
certificate automatically.

**f. Turn on HSTS** once https works: uncomment the `Strict-Transport-Security`
line in `/etc/nginx/snippets/nebras-security-headers.conf`, then
`sudo nginx -t && sudo systemctl reload nginx`.

### Every deploy

1. Copy `.env.deploy.example` to `.env.deploy` and fill in host, user and path
   (one time). `.env.deploy` is ignored by git.
2. Run:

```bash
npm run deploy
```

`deploy/deploy.ps1` builds the site, packs `/out`, uploads it with `scp`, unpacks
it into `releases/<timestamp>/` and switches the `current` link to it in one
step. The last 5 releases are kept. With an SSH key, set `DEPLOY_SSH_KEY` to
its path; without one, `ssh`/`scp` ask for your password in the terminal.

`npm run deploy -- -SkipBuild` uploads the existing `/out` without rebuilding.

**Rollback** (on the server): point `current` at an older release.

```bash
ls -1t /var/www/nebras-portfolio/releases
ln -sfn /var/www/nebras-portfolio/releases/OLDER_STAMP /var/www/nebras-portfolio/current
```

**Manual deploy** without the script (PowerShell, from the project folder):

```bash
npm run build
tar -czf site.tar.gz -C out .
scp site.tar.gz deploy@YOUR_SERVER_IP:/tmp/
ssh deploy@YOUR_SERVER_IP "mkdir -p /var/www/nebras-portfolio/releases/manual && tar -xzf /tmp/site.tar.gz -C /var/www/nebras-portfolio/releases/manual && ln -sfn /var/www/nebras-portfolio/releases/manual /var/www/nebras-portfolio/current"
```

---

## Project map

```
content/projects/*.mdx      case studies (one file each)
content/updates/*.mdx       short posts
public/me.jpg               your photo
public/projects/<name>/     project images
src/lib/site.ts             name, domain, email, socials
src/i18n/en.ts              all interface text
src/app/                    pages, metadata, sitemap, robots, OG images, icons
src/components/sections/    home page sections
src/components/motion/      smooth scroll, reveals, parallax, cursor, magnetic button
scripts/                    image optimizer, new:project, new:update, preview server
deploy/                     nginx config, security headers, deploy script
```

## Motion and accessibility

What moves, and where it lives (`src/components/motion/`):

- **Hero**: words blur into focus one by one (pure CSS, so it plays before
  JavaScript loads), then the whole hero sinks back and fades as you scroll.
- **Headings**: words blur in when they scroll into view; overlines draw
  their hairlines outward.
- **Project cards**: rise and scale in, the laptop lid swings open the first
  time it appears, the device tilts toward the mouse, and opening a project
  morphs the card into the case-study cover (View Transitions API).
- **About**: the statement lights up word by word as you scroll.
- **Toolbox**: two endless rows of words that speed up with your scroll speed
  and reverse when you scroll up.
- **Updates**: the timeline rail fills with green as you read.
- **Footer**: starts as a rounded dark card and grows to full width; a giant
  wordmark rises at the very end.
- **Menu**: opens as a circle from the menu button; the button's ring shows
  how far down the page you are.
- **Buttons**: magnetic on mouse, with a fill that grows from the cursor.

Accessibility and performance:

- With "reduce motion" turned on in the OS, smooth scrolling, parallax, tilt,
  scroll effects and slides switch off, leaving simple fades.
- Phones get native scrolling and no tilt, parallax or magnetic buttons; only
  `transform` and `opacity` are animated.
- Without JavaScript every section is still visible.
- Page changes use the browser's View Transitions API (current Chrome, Edge
  and Safari). Browsers without it simply switch pages.

## Adding French later

All interface text lives in `src/i18n/en.ts`. To add French:

1. Copy it to `src/i18n/fr.ts`, translate the values, register `fr` in `src/i18n/index.ts`.
2. Add an `src/app/fr/` route tree whose pages call `getDictionary("fr")`.
3. Put French case studies in `content/projects/fr/` and read them with a locale
   parameter in `src/lib/content.ts`.
4. Add `alternates.languages` in `src/lib/metadata.ts` so search engines link
   the two versions.
