# Evaluation: the two directions side by side

October 2026, before any live test or usability session. This compares what
was built and what was measured in development. It is not a verdict: the
choice should wait for the usability sessions and, traffic permitting, the A/B test.

Three kinds of statement appear below and are labelled:
**Built** (implemented and checked), **Measured** (observed, with how), and
**Judgement** (an assessment to test with real people).

## The two directions in one line each

- **A. The Living Brand Book.** The site set as your personal brand guidelines:
  a cover, a contents page, seven numbered chapters, running heads, figure
  captions, spec tables and previous/next chapter folios. White paper, near-black
  ink and one spot green taken from the 2025 portraits. Instrument Sans (its
  narrow widths for display) with Instrument Serif. Monogram: a geometric BA
  whose B waist runs on as the A crossbar, drawn on its construction grid.
- **B. The Personal Editorial.** The site set as a magazine profile: your name
  as the masthead across the page and over your portrait, deep wine from the
  patchwork top, plaster white from the arches, and green from the trousers.
  Bodoni Moda with Schibsted Grotesk. Monogram: a hand-drawn high-contrast BA
  whose hairline A leg crosses into the B. Lagos and London clocks, a contact
  sheet of the shoot, drop caps and pull quotes.

## Same content, same journeys (Built)

- One content model (`lib/model.mjs`) feeds both. Pages in both: Home, Work,
  case studies, Writing and articles, Ventures, Speaking, About, On the side,
  Contact, a full content index, Experiments and a not-found page.
- Home in both, in this order: introduction, selected work, practice and
  leadership, ventures, speaking, writing and books, personal introduction, contact.
- `node test/run.mjs` renders every page in both directions and fails if any
  page is missing a project, venture, talk, note, award, the email address or
  the book; if a page lacks an h1, a skip link or image alt text; if a preview
  page is indexable or has the wrong canonical URL; or if a link leaves the
  preview. It currently passes.
- SEO tags, canonical URLs and the measurement script come from one shared
  file (`lib/shell.mjs`), so neither direction is optimised differently.

## Performance (Measured)

Measured on the preview deployment in the Claude desktop browser at phone
width (375 × 812), warm cache, on a Lagos connection, 26 October 2026. One run
per page after a warm-up visit. Treat as indicative; repeat with Lighthouse or
PageSpeed Insights on the preview URLs for a lab comparison.

| Page | Direction | Server response | First content | Largest content | Layout shift |
|---|---|---|---|---|---|
| Home | A Brand Book | 360 ms | 496 ms | 496 ms | 0 |
| Home | B Editorial | 129 ms | 356 ms | 356 ms | 0 |
| Home | Current site | 124 ms | 368 ms | 388 ms | 0 |
| About | A Brand Book | 189 ms | 304 ms | 304 ms | 0 |
| About | B Editorial | 128 ms | 320 ms | 320 ms | 0 |
| Case study | A Brand Book | 125 ms | 372 ms | 380 ms | 0 |
| Case study | B Editorial | 181 ms | 352 ms | 352 ms | 0 |

Page weight before fonts and CMS images (local server, uncompressed):

| | A Brand Book | B Editorial |
|---|---|---|
| HTML, home | 21 KB | 18 KB |
| CSS | 27 KB | 30 KB |
| JavaScript (design + measurement) | 7 KB | 7 KB |
| Web fonts (Google Fonts, measured in browser) | about 71 KB | about 143 KB |
| Elements on the home page | 354 | 253 |

Neither uses a loader or splash screen. Each has one load animation, skipped
for visitors who ask for reduced motion. B's animation hides the name and
portrait for about a second on first paint; it did not delay first content in
the runs above, but watch Largest Contentful Paint in field data.

## Accessibility (Built and Measured)

- Both: skip link first in the tab order; visible focus outlines; one h1 per
  page and no skipped heading levels (checked automatically); alt text on
  every image; the menu or contents panel moves focus in, closes with Escape
  and returns focus to its button (checked in a headless browser); form fields
  have labels; motion off for reduced-motion users; no horizontal scroll at 375px.
- Colour contrast (WCAG AA needs 4.5:1 for body text):

| Pair | A | B |
|---|---|---|
| Body text on background | 17.2 : 1 | 14.6 : 1 |
| Secondary text | 6.4 : 1 | 5.4 : 1 |
| Accent green on background | 6.6 : 1 | 5.5 : 1 |
| Text on wine | n/a | 12.4 : 1 |

- Not yet done: a screen-reader pass with VoiceOver, and an automated axe
  audit on the deployed preview.

## Side by side (Judgement)

| | A. The Living Brand Book | B. The Personal Editorial |
|---|---|---|
| Visual identity | Systematic and calm. Reads as a designer who builds systems. | Bold and personal. Reads as a person first, then a practice. |
| Originality | The brand-book conceit is unusual for a personal site, but the visual language (white, grid, rules) is close to many design portfolios. The construction-line monogram is distinctive. | Name-as-masthead over the portrait and the wine palette are memorable and specific to the shoot. |
| How it uses you | Your portrait is one of three cover elements. | Your portraits carry most pages. |
| Navigation | Strongest for scanning: a contents rail on wide screens, numbered chapters, "in this chapter" lists, previous/next folios. | Conventional and quick: top bar on wide screens, full-screen menu on phones. Fewer wayfinding devices. |
| Reading | Long pages break into numbered sections, good for reference. | Long-read layout with drop caps and pull quotes, good for stories and articles. |
| Fit with your positioning | Shows governance and systems thinking without saying it. | Shows personality, heritage and presence, the speaker and founder side. |
| Risk | Can feel cool or formal; the numbering is extra structure to maintain. | The big type and photo-led layout depend on strong portraits for every new section. |
| Maintenance | New chapters need a number and a place in the contents. | New sections slot in more freely. |

## Content to confirm before any public launch

These come from the current site or your notes, and need checking:

- The experience table says Chief Design Officer at Neo Health, 2023 to now. Your current role isn't on the site; decide whether to name it.
- Education lists an Executive MBA (Future London Academy, 2025), an International MBA (Rome Business School, 2024) and an MBA (Valencia de Universidad, 2024). Your notes say a 2023 MBA and a design leadership programme at Future London Academy graduating in 2026. Make them agree.
- Spellings and names from your voice notes: Mavin, Johnny Drille, Chike, Di'Ja, Waje.
- The Worth the Work link points to worth-the-work.vercel.app. Confirm that's the book's public page.
- Photo credit "KN Photography" is read from the watermark on three portraits.
- Lilac Africa has no website link yet.

## What would decide it

1. Run the six-task usability sessions (`docs/usability-test.md`) with 6 to 8
   people, alternating which design they see first.
2. If traffic allows, run the live test (`docs/experiment.md`) for at least
   two weeks with event storage set up first.
3. Choose on task success and the primary metric before preference ratings.
