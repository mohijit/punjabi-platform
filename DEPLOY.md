# Deploying to punjabi.mohijitsingh.com

The app is a static site — no server, no database, no environment variables. `next build`
writes plain HTML, CSS and JS into `out/`, and Cloudflare Pages serves that directory.

## The project name

`*.pages.dev` hostnames are globally unique across all Cloudflare accounts, and
**`punjabi.pages.dev` is already taken** by an unrelated site (a "Dictionary Search" app).
This project therefore uses **`punjabi-platform`**, which is free and matches the
repository name.

That means the existing Wix record has to be repointed — it currently sends the subdomain
to a stranger's site:

| | Current (wrong) | Correct |
|---|---|---|
| Type | CNAME | CNAME |
| Host | `punjabi` | `punjabi` |
| Points to | `punjabi.pages.dev` | `punjabi-platform.pages.dev` |

Do that in Wix → Domains → mohijitsingh.com → DNS Records → edit the `punjabi` record.

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

Either from the command line:

```bash
npx wrangler login                    # one-time browser sign-in
npx wrangler pages project create punjabi-platform --production-branch main
npm run deploy                        # builds, then uploads out/
```

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
`punjabi.mohijitsingh.com`. Cloudflare will note that the domain is not on its nameservers,
see the CNAME, and issue a certificate. The domain shows **Active** when done — usually a
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
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create Token → **Edit Cloudflare Workers** template (Pages uses the same permission) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → the Account ID in the right-hand sidebar |

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
