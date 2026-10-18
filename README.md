# Portfolio

A personal portfolio for developers: a static Next.js site with an admin panel,
scroll-driven motion and no server to maintain. It is my own site, and it is
built so anyone can make it theirs by changing content, not code.

- **Next.js 16** (App Router, static export) · **React 19** · **TypeScript** · **Tailwind CSS 4**
- **Motion** and **Lenis** for animation and smooth scrolling
- **Pages CMS** admin panel on top of plain JSON and Markdown files
- **Zod** validates every content file at build time, **Vitest** and GitHub Actions keep it green
- Lighthouse 100 for accessibility, best practices and SEO; works without JavaScript

---

## Quick start

Requires Node.js 20.9 or newer; 22 is recommended and pinned in `.nvmrc`.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Content and code changes reload as you edit.

## Make it yours

Everything personal lives in `content/` and `public/media/`. The code has no
names, links or copy in it, so a fork only needs new content:

| What                                                                           | File                                                    | In the admin panel           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------- | ---------------------------- |
| Site name, domain, SEO description, contact section, footer                    | `content/settings/site.json`                            | Settings → Site              |
| Name, job title, portrait, location, company, email, WhatsApp, social profiles | `content/settings/profile.json`                         | Settings → Profile & contact |
| Hero, selected work, bio, toolbox, updates and "elsewhere" sections            | `content/pages/home.json`                               | Pages → Home                 |
| Headers of `/work/` and `/updates/`                                            | `content/pages/work.json`, `content/pages/updates.json` | Pages → …                    |
| Case studies                                                                   | `content/projects/*.md`                                 | Projects                     |
| Short posts                                                                    | `content/updates/*.md`                                  | Updates                      |
| Photos and screenshots                                                         | `public/media/`                                         | Media                        |

The favicon, Open Graph images and structured data are generated from these
files. The build prints a warning while the domain or email still point at
`example.com`.

Interface labels that are not about you (menu, "Back to top", aria labels) are
in `src/i18n/en.ts`.

## Admin panel

The admin panel is [Pages CMS](https://pagescms.org), configured in
[`.pages.yml`](.pages.yml). It is free, needs no server and no extra code: it
edits the files in this repository through GitHub and saves each change as a
commit.

1. Push the repository to GitHub.
2. Open https://app.pagescms.org, sign in with GitHub and install the app on
   this repository only.
3. Pick the repository. Settings, Pages, Projects, Updates and Media appear in
   the sidebar.

Only people with write access to the repository can sign in and edit, so a
public repository is safe. Edits land on `main`; with automatic deploys
(Cloudflare Pages, or a deploy job in GitHub Actions) the site updates a minute
later. The VPS setup below deploys from GitHub Actions on every push to `main`.

### Styling words in headings

Headings accept a small inline syntax, so you can style words without HTML:

| Write        | Result                              |
| ------------ | ----------------------------------- |
| `~muted~`    | grey text                           |
| `*italic*`   | italic text                         |
| `==accent==` | green text                          |
| `~*and*~`    | markers combine                     |
| line break   | new line (multi-line headings only) |
| `\*`         | a literal `*`                       |

`Things I’ve ~*built & shipped*~` renders “Things I’ve” in ink and “built & shipped” in grey italics.

## Content reference

### Projects

Create one in the admin panel or with `npm run new:project`. Files are
Markdown with frontmatter; use `.mdx` instead of `.md` when you need JSX.

| Field         | Required | Notes                                                                                   |
| ------------- | -------- | --------------------------------------------------------------------------------------- |
| `title`       | yes      |                                                                                         |
| `summary`     | yes      | One or two sentences, shown under the title and in search results                       |
| `date`        | yes      | `YYYY-MM-DD`, newest first                                                              |
| `tags`        | no       | The first two show on the card; all of them fill "Built with"                           |
| `cover`       | no       | Screenshot in `/public/media`. Desktop 16:10 (e.g. 1920×1200), phone about 1170×2532    |
| `mockup`      | no       | `laptop` (default), `browser`, `phone` or `none`: the frame drawn around the screenshot |
| `icon`        | no       | Square logo above the case-study title; the first letter of the title otherwise         |
| `mission`     | no       | Shown in the "Mission" column, falls back to the summary                                |
| `coverAlt`    | no       | Screenshot description for screen readers                                               |
| `link`        | no       | Live URL                                                                                |
| `role`        | no       | What you did                                                                            |
| `featured`    | no       | Shown on the home page; the newest projects fill in when none are featured              |
| `placeholder` | no       | Adds a "Placeholder" badge                                                              |
| `draft`       | no       | Visible in `npm run dev` only                                                           |

Use plain screenshots: the site draws the device around them.

### Updates

Short posts: a title, a date and a few sentences. Create one in the admin panel
or with `npm run new:update`. Fields: `title`, `date`, `tags`, `link`, `draft`.

### Images

Add normal `.jpg`, `.png` or `.webp` files to `public/media/`. Before every
`dev` and `build`, `scripts/optimize-images.mjs` writes WebP versions in eight
widths to `public/_img/` (not committed), so `next/image` serves the right size
without an image server. Run `npm run images` after adding a file while
`npm run dev` is running.

## Scripts

| Command                              | What it does                                                            |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `npm run dev`                        | Development server on port 3000                                         |
| `npm run build`                      | Static export to `out/`                                                 |
| `npm run preview`                    | Serves `out/` on port 4173 with the same headers and 404 rules as nginx |
| `npm run check`                      | Formatting, lint, typecheck and tests (what CI runs before building)    |
| `npm run format`                     | Formats the code with Prettier                                          |
| `npm test`                           | Unit tests, plus validation of every file in `content/`                 |
| `npm run new:project` / `new:update` | Interactive scaffolders                                                 |
| `npm run images`                     | Regenerates responsive images                                           |

## Project structure

```
content/                    site content, edited from the admin panel
  settings/                 site.json, profile.json
  pages/                    home.json, work.json, updates.json
  projects/  updates/       Markdown with frontmatter
public/media/               photos and screenshots
src/
  app/                      routes, metadata, sitemap, robots, OG images, icons
  content/                  content layer: schemas, loaders, emphasis parser
  components/
    sections/               home page sections
    work/  updates/         project cards, case study, timeline
    motion/                 smooth scroll, reveals, parallax, cursor, magnetic button
    typography/  ui/        text rendering and small building blocks
  i18n/                     interface strings
  lib/                      formatting, metadata, OG rendering, image loader
tests/                      Vitest suites
scripts/                    image optimizer, scaffolders, preview server
deploy/                     nginx config and security headers
```

### How content flows

`src/content/schema.ts` defines every file with Zod. `src/content/source.ts`
reads and validates files and reports errors with the file and field name;
`settings.ts`, `projects.ts` and `updates.ts` expose typed getters, memoised per
render with `React.cache`. These modules import `server-only`, so file system
code can never end up in the browser bundle. Pages read content and pass plain
props down; components never read files themselves.

The test suite loads the real files in `content/`, so an invalid edit made in
the admin panel fails CI before it reaches a deploy.

### CI and deploys

`.github/workflows/ci.yml` runs lint, typecheck, tests and the build on every
push and pull request. On `main`, a second job uploads that same tested build
to the VPS. Pull requests never reach the deploy job, so forks never see its
secrets.

## Deploy

The build output in `out/` is plain static files and runs on any static host.

### Cloudflare Pages or another static host

Connect the repository, set the build command to `npm run build`, the output
directory to `out` and `NODE_VERSION` to `22`. Every push, including admin
panel edits, then deploys automatically. Headers from `deploy/nginx/` need to
be copied into the host's own format (a `public/_headers` file on Cloudflare).

### Your own VPS with nginx

Every push to `main` (including admin panel edits) is checked, built and
deployed by GitHub Actions. These steps assume Ubuntu/Debian with nginx and
certbot installed. Replace `example.com` with your domain and run the server
commands yourself as an admin user.

**1. Point the domain at the VPS.** Add `A` records for `example.com` and
`www.example.com` with the server IP.

**2. Create a deploy key** (on your machine):

```bash
ssh-keygen -t ed25519 -f ~/.ssh/portfolio_deploy -C "portfolio deploy"
```

**3. Create a deploy user that can only write the site folder** (on the server),
pasting the contents of `portfolio_deploy.pub`:

```bash
sudo adduser --disabled-password --gecos "" nebras
sudo mkdir -p /home/nebras/.ssh /var/www/nebras-portfolio/releases
echo "PASTE_PUBLIC_KEY_LINE" | sudo tee /home/nebras/.ssh/authorized_keys
sudo chmod 700 /home/nebras/.ssh && sudo chmod 600 /home/nebras/.ssh/authorized_keys
sudo chown -R nebras:nebras /home/nebras/.ssh /var/www/nebras-portfolio
```

**4. Install the nginx config** (on the server):

```bash
curl -fsSL https://raw.githubusercontent.com/NebrasAbderrazak/myporfolio-template/main/deploy/nginx/nebras-portfolio.conf | sed 's/example.com/YOUR_DOMAIN/g' | sudo tee /etc/nginx/sites-available/nebras-portfolio >/dev/null
sudo curl -fsSL https://raw.githubusercontent.com/NebrasAbderrazak/myporfolio-template/main/deploy/nginx/security-headers.conf -o /etc/nginx/snippets/nebras-security-headers.conf
sudo ln -s /etc/nginx/sites-available/nebras-portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

The config sets up gzip, caching (one year for hashed build files, one week for
images, revalidation for pages), security headers, the 404 page and blocks
hidden files. `nginx -t` refuses a broken config, so other sites on the same
server stay up.

**5. Add the GitHub secrets** in Settings → Secrets and variables → Actions:

| Secret               | Value                                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `DEPLOY_HOST`        | Server IP or hostname                                                                                                  |
| `DEPLOY_USER`        | The deploy user, e.g. `nebras`                                                                                         |
| `DEPLOY_SSH_KEY`     | The whole private key file `portfolio_deploy`, including the `BEGIN`/`END` lines                                       |
| `DEPLOY_KNOWN_HOSTS` | Output of `ssh-keygen -F SERVER_IP` on a machine that has already connected, so the workflow only talks to your server |

Optional variables (same page, Variables tab): `DEPLOY_PATH` (default
`/var/www/nebras-portfolio`) and `DEPLOY_PORT` (default `22`).

**6. Deploy.** Push to `main`, or open Actions → CI → Run workflow. Each deploy
unpacks into `releases/<time>-<commit>/` and switches the `current` link in one
step, keeping the last five releases.

**7. HTTPS with Let's Encrypt** (on the server, once http works):

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

**8. Turn on HSTS** once https has worked for a few days: uncomment the
`Strict-Transport-Security` line in
`/etc/nginx/snippets/nebras-security-headers.conf`, then run
`sudo nginx -t && sudo systemctl reload nginx`.

**Rollback:** re-run an older successful run from the Actions tab, or point
`current` at an older release on the server:

```bash
ls -1t /var/www/nebras-portfolio/releases
ln -sfn /var/www/nebras-portfolio/releases/OLDER_RELEASE /var/www/nebras-portfolio/current
```

## Motion and accessibility

- **Background:** an animated WebGL layer behind every page, set in the admin
  panel under Settings → Site → Background: Sunlit paper, Leaf shade, Dot grid,
  Contour map or None. Add `?background=dots` (or another value) to any page
  address to preview a style for that browser tab. It reacts to the cursor,
  moves slower than the page when you scroll, starts on the first interaction,
  pauses in background tabs, and falls back to CSS light beams on software
  rendering, slow devices or with "reduce motion" on.
- **Intros:** paragraph words slide up out of their own line masks.
- **Hero:** words blur into focus with CSS (so it plays before JavaScript), then
  the hero sinks back as you scroll.
- **Headings:** words blur in as they scroll into view and blur out as they leave.
- **Project cards:** rise in and open like a window (clip-path wipe), the
  laptop lid opens, devices tilt toward the mouse, and opening a project morphs
  the card into the case-study cover with the View Transitions API.
- **About:** the bio lights up word by word as you scroll.
- **Toolbox:** two marquees that follow your scroll speed and direction.
- **Updates:** the timeline rail fills as you read.
- **Footer:** a dark card that grows to full width, with a rising wordmark.
- **Menu:** opens as a circle growing from the menu button.

With "reduce motion" on, smooth scrolling, parallax, tilt and scroll effects
switch off. Phones get native scrolling, no tilt or magnetic buttons, and a
lower-resolution background at 30 fps. Every section is visible without
JavaScript.

## Adding a language

Interface strings live in `src/i18n/en.ts`. Copy it to `fr.ts`, register the
locale in `src/i18n/index.ts`, add a `src/app/fr/` route tree that calls
`getDictionary("fr")`, and point the content loaders at a `content/fr/` folder.

## License

The source code is [MIT](LICENSE). The content in `content/` and
`public/media/` (my texts, name, contact details and images) is not covered by
that license: please replace it with your own.
