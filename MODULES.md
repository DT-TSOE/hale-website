# Hale — Module Library

A catalog of the reusable page modules used across the site. Use it to assemble new pages
fast: pick the modules you need, copy the snippet from the "canonical example" file, swap the
copy, done. Every module's styling lives in `css/hale.css` — no new CSS needed to reuse one.

**Conventions**
- Colors/spacing come from CSS custom properties (`--gold`, `--fg`, `--fg-dim`, `--border`,
  `--radius`, `--sec-y`, `--shell`). Never hard-code hex — use the tokens.
- No em-dashes in copy. Left-align headlines (don't center body copy).
- Scroll-in animation: add `class="reveal"` (and `data-stagger` for children) — the
  IntersectionObserver in `js/hale.js` adds `.is-in`. Always ships a `.no-js` + reduced-motion
  fallback, so modules render fine without JS.
- Every section is `<section class="section [bg-base|bg-surface]">` with an inner `<div class="shell">`.

---

## 1. Section shell & header
The frame every module sits in.

- **Classes:** `.section` (+ `.section--tight` for less vertical padding, `.bg-base` / `.bg-surface` for alternating bands), `.shell` (max-width + gutter), `.sec-head` + `.eyebrow` + `h2`.
- **JS:** none.
- **Canonical:** any page.

```html
<section class="section bg-surface">
  <div class="shell">
    <div class="sec-head reveal">
      <p class="eyebrow">Section label</p>
      <h2>The headline for this section.</h2>
    </div>
    <!-- module goes here -->
  </div>
</section>
```

## 2. Split page hero (with data-viz)
Interior page hero: breadcrumb + eyebrow + big headline + lede + CTAs on the left, an animated
SVG chart on the right.

- **Classes:** `.page-hero--split`, `.page-hero__viz`; pair with any viz from §12.
- **JS:** none (SVG self-animates on `.reveal.is-in`).
- **Canonical:** `services/organic-performance/index.html` (compounding-growth chart), `services/marketing-strategy/index.html` (priority matrix).

## 3. Two-column intro row (copy + visual)
Balanced "what this is" row: heading + paragraph on one side, a framed visual on the other.

- **Classes:** `.svc-intro`, `.svc-intro--top` (first row spacing), `.svc-intro--viz`, `.viz-frame`, `.viz-label`. Center-align variant: `.viz-caption` under the graphic to balance long copy.
- **JS:** none.
- **Canonical:** `services/organic-performance/index.html` (search-surfaces panel), `services/marketing-strategy/index.html` (diagnostic radar).

## 4. Tabbed section (+ optional CTA)
Turns a flat list into tabs, each panel showing copy + a unique mini-visual. Great for
"problems we solve" / "what you get" sections.

- **Classes:** `.tabs`, `.tabs__nav` + `.tabs__tab` (`.is-active`), `.tabs__panels` + `.tabs__panel` (`.is-active`). Each panel reuses `.svc-intro--viz` + `.viz-frame` + a `.viz-mini` SVG (§12). Optional `.tabs-cta` (lead line + button) closes the section.
- **JS:** small click handler (see snippet) — put one copy before `</main>`.
- **Canonical:** `services/organic-performance/index.html` ("The problems organic performance should actually solve").

```html
<div class="tabs reveal">
  <div class="tabs__nav" role="tablist" aria-label="...">
    <button class="tabs__tab is-active" data-tab="0" role="tab" aria-selected="true">Label</button>
    <button class="tabs__tab" data-tab="1" role="tab" aria-selected="false">Label</button>
  </div>
  <div class="tabs__panels">
    <div class="tabs__panel is-active" data-panel="0" role="tabpanel">
      <div class="svc-intro svc-intro--viz">
        <div><h3>Panel headline</h3><p>Panel copy.</p></div>
        <div class="viz-frame"><!-- .viz-mini SVG --></div>
      </div>
    </div>
    <!-- more panels -->
  </div>
  <!-- optional CTA under the tabs -->
  <div class="tabs-cta reveal">
    <p class="tabs-cta__lead">One-line hook tied to the tabbed content.</p>
    <a class="btn btn--primary" href="/contact/">Get Your Free Growth Audit <span class="arw" aria-hidden="true">&rarr;</span></a>
  </div>
</div>
```
```html
<!-- once per page, before </main> -->
<script>(function(){var t=document.querySelectorAll(".tabs__tab"),p=document.querySelectorAll(".tabs__panel");t.forEach(function(b){b.addEventListener("click",function(){var i=b.getAttribute("data-tab");t.forEach(function(x){x.classList.remove("is-active");x.setAttribute("aria-selected","false");});p.forEach(function(x){x.classList.toggle("is-active",x.getAttribute("data-panel")===i);});b.classList.add("is-active");b.setAttribute("aria-selected","true");});});})();</script>
```

## 5. Belief-chip checklist
A checklist rendered as cards with solid gold icon chips (far more visual than plain checks).

- **Classes:** `.check-list.check-list--cards.check-list--belief`; each `<li>` = a `.ico` gold chip (`<span class="ico">…svg…</span>`) + `<p><strong>Title.</strong> Detail.</p>`.
- **JS:** none.
- **Canonical:** `services/organic-performance/index.html` ("Why this matters more than it used to"), `about/index.html` ("What We Believe").

## 6. Feature / channel card grid
Icon + title + description tiles. The workhorse "what we do / what's included" grid.

- **Classes:** `.feature-card` inside a `.card-grid` (or `.cards`); gold line-icon top-left.
- **JS:** none.
- **Canonical:** `services/performance-marketing/index.html` (platform tiles), `services/organic-performance/index.html` ("Four channels, one system").

## 7. Numbered process stepper
Vertical numbered steps; dots pop and the connecting line draws on scroll.

- **Classes:** `.model2` (+ `.model2__step`, numbered). Animation via `.reveal.is-in`.
- **JS:** none.
- **Canonical:** `services/organic-performance/index.html` ("Visibility. Authority. Conversion…").

## 8. Explore Services band  ← *new*
Compact, CTA-focused "go see the other services" band: one row of icon tiles + a primary CTA.
Low copy, high click intent. **This is the standard closer for every service detail page.**

- **Classes:** section gets `.section.svc-explore-sec.bg-surface` (tight, band-like padding); grid is `.svc-explore` (2-col mobile → 3 → 5 across in one line on desktop); each tile = `.se-ico` (gold line-icon) + `.se-name` + `.se-arw`. Primary CTA in `.svc-explore-cta`.
- **JS:** none.
- **Canonical:** `services/organic-performance/index.html` (`#related`).

```html
<section class="section svc-explore-sec bg-surface" id="related">
  <div class="shell">
    <div class="sec-head reveal" style="text-align:center;max-width:none">
      <p class="eyebrow" style="justify-content:center">Explore Services</p>
      <h2>The rest of the growth system</h2>
    </div>
    <div class="svc-explore reveal" data-stagger>
      <a href="/services/marketing-strategy/"><span class="se-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.4"/></svg></span><span class="se-name">Marketing Strategy</span><span class="se-arw">&rarr;</span></a>
      <!-- repeat per service; drop the current page's own tile -->
    </div>
    <div class="svc-explore-cta reveal">
      <a class="btn btn--primary" href="/contact/">Get Your Free Growth Audit <span class="arw" aria-hidden="true">&rarr;</span></a>
    </div>
  </div>
</section>
```
Line-icons used for the service tiles (drop into `.se-ico > svg`):
- Marketing Strategy — `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.4"/>`
- Performance Marketing — `<polyline points="3 17 9 11 13 15 21 6"/><polyline points="15 6 21 6 21 12"/>`
- Website Development — `<rect x="3" y="4.5" width="18" height="15" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>`
- Analytics & Measurement — `<line x1="4" y1="20" x2="20" y2="20"/><line x1="7" y1="20" x2="7" y2="13"/><line x1="12" y1="20" x2="12" y2="8"/><line x1="17" y1="20" x2="17" y2="11"/>`
- AI Search Optimization — `<path d="M12 3.5 L13.7 9.6 L19.8 11.3 L13.7 13 L12 19.1 L10.3 13 L4.2 11.3 L10.3 9.6 Z"/>`
- SEO — `<circle cx="10.5" cy="10.5" r="6.5"/><line x1="20.5" y1="20.5" x2="15.1" y2="15.1"/>`

## 9. Thin services band
A one-line "services leaned on most" strip (label + pill links). For when a section doesn't
warrant a full block.

- **Classes:** `.svc-band-sec` (thin padding, top/bottom rule), `.svc-band` + `.svc-band__label` + `.svc-band__links a`.
- **JS:** none.
- **Canonical:** `services/index.html`.

## 10. Gold final-CTA band
The yellow, split, left-aligned closing CTA. **On every page**, just above the footer.

- **Classes:** `.gold-cta` (split layout). Button text is the standard **"Get Your Free Growth Audit"**.
- **JS:** none.
- **Canonical:** homepage `index.html`; present site-wide.

## 11. FAQ accordion
- **Classes:** `.faq` + `<details>`/`<summary>` rows. Also emit matching `FAQPage` JSON-LD in `<head>`.
- **JS:** none (native `<details>`).
- **Canonical:** all service pages.

## 12. Backgrounds, textures & data-viz
Drop-in visual layers so sections aren't "black + words + icons."

**Section backgrounds** (add the layer div as first child of the section, or the class on the section):
- `.svc-section` + `.svc-aurora` — gentle drifting gold glow.
- `.tex-dots` — gold dot-matrix.
- `.tex-storm` / `.tex-bg` / `.tex-scrim` — subtle full-bleed texture.

**Signature SVG visuals** (each is an inline SVG using `pathLength="1"` draw-on-reveal; all have reduced-motion + `.no-js` fallbacks). Wrap in `.viz-frame` (full) or size with `.viz-mini` (≤380px, for tab panels):
- `.viz-growth` — compounding paid-vs-organic chart (hero).
- `.viz-matrix` — priority/impact matrix.
- `.viz-radar` — diagnostic radar.
- `.viz-surfaces` — search-visibility bars (`.sf-bar`).
- `.viz-brief` — "strategy brief" deliverable graphic.
- `.viz-mini` set (tab panels): flat-line-vs-potential, traffic-up/revenue-flat, low email bars, conversion funnel, AI-answer-brand-missing.

## 13. Inline highlight
Gold underline emphasis inside headings/copy.
- **Class:** `.hl`. **JS:** none.

---

### Standard service-detail page recipe
Assemble in this order:
1. Split hero (§2) with a hero viz (§12)
2. Two-column intro (§3)
3. "Why it matters" belief chips (§5) on a textured `bg-surface` section (§12)
4. "Problems we solve" tabs (§4) on a textured `bg-base` section
5. "What's included" feature cards (§6)
6. Process stepper (§7)
7. **Explore Services band (§8)**
8. FAQ (§11)
9. Gold final-CTA (§10)
