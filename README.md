# elevate-websites

Client websites, one directory each. Every site is self-contained — its own
HTML, CSS, JavaScript, fonts and images, with no shared root-level build.

| Directory | Client | Status |
| --- | --- | --- |
| [`ozcar-services/`](ozcar-services/) | OZCAR Services — trailer hire and towing, Leopold VIC | Built (5 pages); needs the real photos, domain, a form endpoint and the trailer specs before going live |

Each site has its own `README.md` covering local preview, handover steps and
anything left to confirm. Start there.

## Deploying

`netlify.toml` at the repo root publishes `ozcar-services/`. When a second site
is added, either change `publish` to point at it or give each site its own
Netlify project with the base directory set accordingly.

Nothing here needs a build step — the sites are static files and can equally be
dropped on Cloudflare Pages, cPanel, S3 or any other static host.
