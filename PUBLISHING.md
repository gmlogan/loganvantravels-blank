# Publishing cheat sheet

Site: <https://gmlogan.github.io/loganvantravels-blank/> · Repo: `gmlogan/loganvantravels-blank`

Deploys are **automatic**: every push to `main` triggers the GitHub Actions
workflow (`.github/workflows/hugo.yml`), which builds with Hugo and publishes to
GitHub Pages in ~30–40s. You never configure Pages by hand.

Run everything below from the project root: `<your clone of loganvantravels-blank>`

---

## One-time setup (new machine / fresh clone)

The theme's CSS is built with Tailwind and isn't committed to the repo, so
after cloning (with submodules) run:

```bash
cd themes/congo && npm install && cd ../..
npm run build
```

This writes `assets/css/compiled/main.css` (git-ignored). You only need to
re-run `npm run build` after editing a layout/template file — plain content
edits (new posts, front matter) don't need it.

---

## Everyday cycle

Preview locally while editing (live-reloads on save):

```bash
hugo server -D
```

Publish when happy:

```bash
git add -A
git commit -m "Add Foo Bar trip"
git push
```

Live a minute later.

---

## New post

**Easiest — the helper script** (names the folder, fills the front matter,
prefills the date line, opens it in the editor):

```bash
bin/new-post "The Bell Inn, Somewhere"
```

Add `2026-07-04` as a second argument to date it other than today. Then write
the body, drop images in that **same folder** (`![](image-1.jpg)`), and run the
`git add / commit / push` cycle.

**By hand / `hugo new`** — `hugo new content posts/some-place/index.md` uses
`archetypes/posts.md`; rename the folder to add the `YYYY-MM-DD-` prefix and fix
the `slug`.

Front matter used on this site:

```yaml
---
title: "Some Place"
date: 2026-07-05
draft: false
slug: "some-place"
wp_published: 2026-07-05   # original blog date; = date for new posts
campsites: CCC             # optional; one of CCC, CAMC, Aire, Independent, Pub, Off-Grid
---
```

`campsites` is a Hugo taxonomy: it builds `/campsites/` (all types) and
`/campsites/<type>/` (posts of that type), shows as a pill on the post, and is
linked from the "Campsite types" nav item. Omit the line for no tag.

---

## Check the build before pushing (optional)

```bash
hugo --gc --minify
```

Non-zero exit or `ERROR:` lines → fix before pushing. A broken build fails the
Action and the previous live site stays up.

---

## Watch / troubleshoot the deploy

```bash
gh run watch --repo gmlogan/loganvantravels-blank --exit-status
```

```bash
gh run view --repo gmlogan/loganvantravels-blank --log-failed
```

Force a redeploy with no code change:

```bash
gh workflow run "Deploy Hugo site to Pages" --repo gmlogan/loganvantravels-blank
```

Actions dashboard: <https://github.com/gmlogan/loganvantravels-blank/actions>

---

## CMS extras

- **Galleries:** in the post body, choose Insert → Gallery and tap Upload to
  pick several photos at once (on a phone the photo library allows
  multi-select; on a computer you can also drop files). Reorder with the
  arrows on each photo. Captions are optional, one line per photo in the same
  order. Use as many galleries per post as you like. Stored as
  `{{< gallery >}} … {{< /gallery >}}` around ordinary image lines
  (`layouts/_shortcodes/gallery.html`, `static/admin/gallery.js`, styles in
  `assets/css/custom.css`).
- **Trips and Tags pickers:** pick existing ones, or use "Add Trip page" or
  "Add Tag" to create a new one. That writes `content/trips/<slug>/_index.md`
  or `content/tags/<slug>/_index.md` in the same commit as the post.

---

## Notes

- **Theme** is a git submodule (`themes/congo`). After `git clone` on a new
  machine: `git submodule update --init --recursive`. To update it later:
  `git submodule update --remote themes/congo` then commit.
- `public/` and `resources/` are build output — git-ignored, never committed.
- The site is served from GitHub's default address, set in `baseURL` in
  `config/_default/hugo.toml`. For a custom domain: add `static/CNAME`
  containing the domain, change `baseURL`, add the DNS CNAME record, and set
  the domain under Settings → Pages.
- If the site looks stale right after a deploy, it's browser/CDN cache —
  hard-refresh (Cmd-Shift-R).
