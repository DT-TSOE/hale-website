# Hale Digital — Website

Static marketing site. **No build step** — plain HTML, CSS, and JS.
Edit a file, commit, push. The host rebuilds and deploys automatically.

## Structure

```
/                       homepage (index.html)
/css/hale.css           single stylesheet (design system + all sections)
/js/hale.js             progressive enhancement + canvas background effects
/assets/                logos, client logos, textures
/services/              services hub + 7 service pages
/industries/            industries hub + 5 industry pages
/our-work/              work hub + case studies (tentree, orangetheory, saje)
/insights/              insights hub + 4 articles
/about/  /team/  /contact/  /resources/
sitemap.xml  robots.txt  llms.txt
netlify.toml            hosting config (headers, caching)
```

## Local preview

Absolute paths (`/services/`) require a server — opening files directly
via `file://` will make nav links 404. Run:

```bash
cd hale
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying changes

Once the repo is connected to Netlify (see below), deploying is just:

```bash
git add .
git commit -m "Update homepage copy"
git push
```

Netlify builds and publishes in ~30 seconds. Every push is versioned,
and any previous deploy can be restored instantly from the Netlify UI.

## Editing notes

- **Design tokens** (colours, fonts, spacing) live at the top of `css/hale.css` under `:root`.
- **Fonts**: Prompt (headlines) + Manrope (body), loaded from Google Fonts in each page `<head>`.
- **Section backgrounds**: canvas effects use `data-fx="orbs|network|glitter"`; textures use `.tex-bg`.
- Pages are standalone HTML — no templating engine. The nav/footer markup is
  duplicated per page, so nav changes need to be applied across pages.

## Before public launch

- [ ] Wire the contact form to a backend/CRM (currently front-end only)
- [ ] Confirm client approval on case-study metrics and testimonials
- [ ] Remove the "Hold for approval" banner from `/our-work/saje/`
- [ ] Add analytics
- [ ] Point the custom domain and confirm canonical URLs
