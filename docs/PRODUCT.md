# Product

## Register

brand

## Users

Four audiences arrive at the same site, and the docs must serve all of them:

- **Evaluating** — landed from GitHub or a search for "hijri calendar react". Deciding in about thirty seconds whether this is credible, maintained, and worth a dependency. They need to see a real calendar working, in their framework, before they read a sentence.
- **Mid-integration** — already installed it. Wants the prop, the token, the keyboard contract, and code they can copy that works unmodified.
- **Theming** — wants to see the thirty-three themes, understand the `--hc-*` token contract, and learn how to write their own.
- **Contributing** — reading the architecture (one state machine, five bindings), the parity contract, and the known gaps.

The library spans five frameworks, so nearly every reader is reading past four framework's worth of content they don't care about. Letting them declare their framework once and see only that is a load-bearing part of the design, not a convenience.

## Product Purpose

Documentation for Taqwim: deterministic Umm al-Qura, Islamic Civil and Islamic TBLA date utilities, with accessible calendars for Vue, React, Svelte 5, Solid and Angular — thirteen packages versioned in lockstep.

The docs exist to make unfamiliar Hijri calendar systems tractable to developers who have never shipped one. Hijri dates are not Gregorian dates with different numbers: the selected system determines month lengths and the absolute day represented by the fields, the weekend defaults to Friday/Saturday, and the default Umm al-Qura table covers 1343–1500 AH and throws outside it. A developer who gets this wrong ships wrong dates to people for whom those dates matter.

Success is a developer choosing the library, integrating it correctly the first time, and understanding what it will not do before they hit it in production.

## Brand Personality

**Scholarly, careful, regional.**

Hijri calendar systems have real domains and real communities behind them. The docs should read like they were written by someone who takes that seriously — precise about what the Umm al-Qura table covers, explicit about the Civil and TBLA arithmetic rules, and treating Arabic and RTL as the primary case they were designed for rather than a localisation afterthought.

Careful means the limits are stated as plainly as the features. The library throws `HijriRangeError` rather than returning a silently wrong date; the docs should have the same instinct.

Not academic-dry, and not chatty. The voice of a good reference work: confident, quiet, and answerable.

## Anti-references

- **Generic themed Starlight.** A recolored default with a glow behind the hero. Every OSS docs site of 2025 looks like this, and it says nothing about the project. If the identity survives swapping the accent color for a different one, there is no identity.
- **A wall of unstyled API dump.** TypeDoc output with no narrative around it. Technically complete and useless: it tells you every signature and nothing about how to use the library.
- **An over-animated showcase.** Scroll-jacking, staggered reveals on every section, parallax. Motion that puts itself between the reader and the answer.

## Design Principles

1. **Practice what you preach.** The library ships an accessibility guide and gates its own themes on a WCAG contrast audit. The docs are held to at least the bar they advocate; anything less discredits the guide on the page.
2. **Show the real component.** Every demo imports the published package the way a reader's app would. If an adapter breaks, the docs break with it. Nothing on the site may style `[data-taqwim-*]` — showing readers something they cannot reproduce by installing the package is a lie in a demo's clothing.
3. **Name the limits.** The selected calendar system, the Umm al-Qura range, the Angular DOM-coverage gap, and the Friday/Saturday default. A reader should learn the edges here rather than in production.
4. **The calendar is the subject.** Chrome, motion and decoration exist to frame a working calendar, never to compete with it. Arabic and RTL rendering are first-class throughout.
5. **One framework at a time.** The reader declares theirs once; the site respects it on every page. Five parallel code blocks per concept is a failure of the design, not a feature of the coverage.

## Accessibility & Inclusion

**WCAG 2.2 AA, enforced** — checkable rather than asserted, matching how the themes package gates its own contrast on every test run.

- Body text ≥4.5:1, large text ≥3:1, in both the light and dark themes.
- Full keyboard operability for every interactive demo, including the framework switcher and theme gallery. The calendar's own roving-tabindex contract must remain observable in the docs.
- `prefers-reduced-motion` honoured for every transition on the site.
- RTL and Arabic numerals treated as a primary rendering case, not a demo footnote.
- Color is never the only signal: the active framework, the selected theme and the consumed-key state each carry a second cue.
