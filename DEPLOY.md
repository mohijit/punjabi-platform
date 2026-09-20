# Deploying to punjabi.mohijitsingh.com

**This is already done.** The site is live at `punjabi-platform.pages.dev` and the custom
domain is attached. What follows is how it was set up and how to repeat it.

The app is a static site — no server, no database, no environment variables. `next build`
writes plain HTML, CSS and JS into `out/`, and Cloudflare Pages serves that directory.

## The project name

`*.pages.dev` hostnames are globally unique across all Cloudflare accounts, and
**`punjabi.pages.dev` is already taken** by an unrelated site (a "Dictionary Search" app).
This project therefore uses **`punjabi-platform`**, which is free and matches the
repository name.

The Wix record was repointed accordingly and now reads:

| Type | Host | Points to |
|---|---|---|
| CNAME | `punjabi` | `punjabi-platform.pages.dev` |

It lives in Wix → Domains → mohijitsingh.com → DNS Records.

Nothing else at Wix changes. The apex `mohijitsingh.com` keeps pointing at GitHub Pages
(`185.199.108–111.153`) and is unaffected.

If you would rather have a different name, any unclaimed one works — check availability
with `nslookup <name>.pages.dev 8.8.8.8` (an NXDOMAIN means it is free) and update the
CNAME, `package.json`'s `deploy` script and `.github/workflows/deploy.yml` to match.

## 1. Push the repository

```bash
cd C:\Projects_New\Learner
gh repo create punjabi-platform --public --source . --remote origin --push
```

Use `--private` if you prefer; Cloudflare Pages works with either.

## 2. Create the Pages project and deploy

```bash
npx wrangler login                    # one-time browser sign-in
npm run deploy                        # builds, then uploads out/
```

**Do not run `wrangler pages project create` in this directory.** Wrangler 4.135 delegates
that command to Workers, detects Next.js, and starts an OpenNext migration that installs
packages and rewrites `package.json` to `opennextjs-cloudflare build && deploy`. That is the
server-rendered path; this site is a static export and does not need it. Create the project
through the API instead, which does exactly one thing:

```bash
TOKEN=$(grep -m1 '^oauth_token' "$APPDATA/xdg.config/.wrangler/config/default.toml"   | sed 's/.*=[ ]*"//; s/"[ ]*$//')
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects"   -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"   -d '{"name":"punjabi-platform","production_branch":"main"}'
```

Account ID: `6fa7e474bf7421e6f3ba244f845e7b51`.

…or in the dashboard: **Workers & Pages** → **Create** → **Pages** → **Connect to Git**,
pick the repository, and set:

| Setting | Value |
|---|---|
| Project name | `punjabi-platform` |
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Production branch | `main` |

Node version comes from `.node-version` (22). No environment variables are needed.

Connecting via Git gives automatic deploys on push and preview builds for branches, and is
the better option if you want the dashboard to own the pipeline. If you deploy from the
CLI instead, use the GitHub Actions workflow below so pushes still publish.

## 3. Attach the domain

First make sure the Wix CNAME points at `punjabi-platform.pages.dev` (see above), then:
Pages project → **Custom domains** → **Set up a custom domain** →
`punjabi.mohijitsingh.com`, or by API:

```bash
curl -X POST ".../accounts/$ACCOUNT_ID/pages/projects/punjabi-platform/domains"   -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"   -d '{"name":"punjabi.mohijitsingh.com"}'
```

Cloudflare notes that the domain is not on its nameservers, follows the CNAME, and issues a
certificate. The domain shows **Active** when done — usually a
few minutes.

Verify:

```bash
nslookup punjabi.mohijitsingh.com 8.8.8.8
curl -sI https://punjabi.mohijitsingh.com | head -1
```

## 4. Deploys after the first one

`.github/workflows/deploy.yml` runs the content checks, the linter and the build on every
push to `main`, and publishes only if all three pass. It needs two repository secrets
(**Settings → Secrets and variables → Actions**):

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | **Still to add.** Cloudflare → My Profile → API Tokens → Create Token → **Edit Cloudflare Workers** template (Pages uses the same permission). A `wrangler login` OAuth token cannot mint this — the dashboard is the only way. |
| `CLOUDFLARE_ACCOUNT_ID` | Already set to `6fa7e474bf7421e6f3ba244f845e7b51`. |

If you connected the project to Git in step 2, Cloudflare builds on push by itself and this
workflow is redundant — delete it, or keep it and disable the dashboard's build integration,
but do not run both.

To publish by hand at any time:

```bash
npm run deploy
```

## Notes

- `output: "export"` in `next.config.ts` is what produces `out/`. Adding any feature that
  needs a server — route handlers, server actions, cookies, image optimization — breaks the
  export, and the build will say so.
- `out/404.html` is generated from the app's not-found page; Cloudflare Pages serves it
  automatically for unknown paths.
- Because every route is prerendered, `dynamicParams = false` is set on `/learn/[lessonId]`:
  a lesson id that is not in `content/lessons/` 404s rather than being rendered on demand.
