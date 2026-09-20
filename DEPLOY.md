# Deploying to punjabi.mohijitsingh.com

The app is a static site — no server, no database, no environment variables. `next build`
writes plain HTML, CSS and JS into `out/`, and Cloudflare Pages serves that directory.

## 1. Push the repository

```bash
git add -A
git commit -m "Punjabi learning platform: content, exercise engine and lesson player"
gh repo create punjabi-platform --public --source . --remote origin --push
```

Use `--private` instead of `--public` if you prefer; Cloudflare Pages works with both.

## 2. Create the Cloudflare Pages project

Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**,
then pick the repository and set:

| Setting | Value |
|---|---|
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | *(leave blank)* |

Node version comes from `.node-version` (22). No environment variables are needed.

The first build publishes to `<project-name>.pages.dev`. Check that URL works before
touching DNS — every later push to the default branch redeploys automatically.

## 3. Attach the domain

In the Pages project → **Custom domains** → **Set up a custom domain** →
`punjabi.mohijitsingh.com`. Cloudflare will report that the domain is not on its
nameservers and give you a CNAME target.

## 4. Add the DNS record at Wix

`mohijitsingh.com` is delegated to Wix (`ns12.wixdns.net`, `ns13.wixdns.net`), so the
record is added there, not at Cloudflare:

Wix → **Domains** → mohijitsingh.com → **DNS Records** → **Add Record**

| Field | Value |
|---|---|
| Type | CNAME |
| Host name | `punjabi` |
| Value / Points to | `<project-name>.pages.dev` |
| TTL | leave default |

This only adds a subdomain. The apex `mohijitsingh.com` keeps pointing at GitHub Pages
(`185.199.108–111.153`) and is not affected.

Propagation is usually minutes. Verify with:

```bash
nslookup punjabi.mohijitsingh.com 8.8.8.8
```

Cloudflare issues the TLS certificate automatically once the record resolves; the custom
domain shows **Active** in the Pages project when it is done.

## Notes

- `output: "export"` in `next.config.ts` is what produces `out/`. Adding any feature that
  needs a server — route handlers, server actions, cookies, image optimization — breaks
  the export, and the build will say so.
- `out/404.html` is generated from the app's not-found page and Cloudflare Pages serves it
  automatically for unknown paths.
- Because every route is prerendered, `dynamicParams = false` is set on `/learn/[lessonId]`:
  a lesson id that is not in `content/lessons/` 404s rather than being rendered on demand.
