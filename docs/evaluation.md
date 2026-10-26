# Evaluation: the two directions side by side

October 2026, before any live test or usability session. This compares what
was built and what was measured in development. It is not a verdict: the
choice should wait for the usability sessions and, traffic permitting, the A/B test.

Three kinds of statement appear below and are labelled:
**Built** (implemented and checked), **Measured** (observed, with how), and
**Judgement** (an assessment to test with real people).

## The two directions in one line each

Both were rebuilt on 26 October 2026 after feedback that the first versions read as "a hub of texts". Content is unchanged; prose is cut to short lines and the pictures and type carry the pages.

- **A. The Living Brand Book.** The site as your brand guidelines, set as full-screen plates the way a London studio would publish a guideline site. Cover on Aso Green with the BA monogram drawing on its construction grid; contents; Foundations; The mark (unit grid, clear space, six colourways); Colour (six swatches sampled from the portraits, click to copy); Typography (your name with live width and weight sliders); Photography (Do and Don't notes on the real shots); Applications (work); Brand architecture ("a house of brands, not a branded house": you, Design Lever and Lilac Africa as separate identities); Tone of voice ("Practical. Human. Memorable." from your own speaking intro, on Stripe Red); Editorial; Off-grid (the one plate where the grid breaks); Usage ("Clear space for a conversation"). Instrument Sans and Instrument Serif. A running head shows the chapter and folio and changes colour with the plate.
- **B. The Personal Editorial (Mason Wong as the reference).** Black sampled from the studio portraits so the textile shot melts into the page; BOLUTIFE in heavy condensed type across the full width with "Awakan" signed above it; a statement with small photos set inside the sentence; selected work as full-screen cards that stack as you scroll; big type lists where a photo follows the cursor; an "On stage" ticker of talk topics; a desk of polaroids you can drag on "On the side"; "Say hello" signed "Bolu". Archivo at its narrowest width, IBM Plex Mono for bracketed labels, Ms Madi for the signatures. The patchwork stripe from your top is the only graphic device.

### Added 26 October: C. The Book

The brand-book idea as a real object you handle, not a brand manual, and in black, white and grey only (photographs in black and white; the work shows its colour only when you reach for it).

- **The object:** a black cloth-bound book with a blind-embossed BA, lying on a grey table under a lamp that follows the cursor. Paper has grain and curves into the spine; the page block thins on one side and grows on the other as you read.
- **Handling it:** the cover swings open on its hinge. Pages fold from the corner you hold, like paper: hover near a corner and it lifts, grab and drag and the page bends over showing its back and casting a shadow on the page beneath, let go to finish the turn or let it fall back. A tap on a page turns it; arrow keys, a sideways trackpad swipe, and Back and Turn buttons work too. Contents entries and the cover-line doors riffle through the pages to their chapter. Page sound (synthesised paper and the cover's thud) is off until turned on. No scroll-jacking: the page scrolls normally.
- **The content follows the positioning strategy:** a title page with the cover line ("Making design count in the brands I build, the teams I lead, and the leaders I grow", each phrase a door), the Currently facts and three intents (Work with me, Book a talk, Explore the book); then contents and eight chapters: What I believe, Who I am (Make, Lead, Build the conditions), The work (with proof: brands and teams, recognitions), What I'm building (each venture in its own name), On stage ("Hope, then a first step." with the four tracks) and Field notes, How I lead, On the side, and Work with me (four ways to work together).
- **Phones:** one page at a time, folding under the finger.
- **Chapter pages:** the same paper laid flat, with a running head and "Back to the book", which reopens it at that chapter.
- **Accessibility:** only the pages in view take focus; reduced motion turns pages without animation; without JavaScript the pages sit one after another.

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

## Performance

The figures measured earlier on 26 October were for the first versions and no longer apply. Re-measure both rebuilt directions on the preview with PageSpeed Insights (phone) before deciding.

Page weight of the rebuilt home pages before fonts and images (local server, uncompressed):

| | A Brand Book | B Editorial |
|---|---|---|
| HTML, home | 46 KB | 25 KB |
| CSS | 54 KB | 36 KB |
| JavaScript (design) | 5 KB | 5 KB |
| Elements on the home page | about 770 | about 400 |
| Web font families | 2 (Instrument Sans, Instrument Serif) | 3 (Archivo, IBM Plex Mono, Ms Madi) |

Neither uses a loader. Each has one load animation, skipped for reduced motion: A draws the monogram's construction lines; B raises the letters of your name and writes "Awakan". B adds a light film grain over the page.

## Accessibility (Built and Measured)

- Both: skip link first in the tab order; visible focus outlines; one h1 per page and no skipped heading levels; alt text on every image; the menu (B) and contents (A) are modal: focus stays inside, Escape closes, focus returns to the button; form fields have labels; motion off for reduced-motion users; no horizontal scroll at 390px. A's type sliders are labelled range inputs; B's draggable photos are a mouse-only extra and hold nothing you can't read elsewhere.
- Colour contrast meets WCAG AA in both. A: green and red fields carry white text, gold and sky carry Night. B: body text on black about 15 : 1, secondary text about 6 : 1, gold signatures about 5.6 : 1.
- Not yet done: a screen-reader pass with VoiceOver, and an automated axe
  audit on the deployed preview.

## Side by side (Judgement)

| | A. The Living Brand Book | B. The Personal Editorial |
|---|---|---|
| Visual identity | Systematic, colourful, witty. Reads as a designer who builds and governs brands. | Cinematic, personal, bold. Reads as a person with presence first. |
| Memorable moment | The site is literally your brand guidelines: colour plate, type sliders, brand architecture. | Your name across the screen with the portrait melting into black; the stacking work cards. |
| Positioning fit | Shows brand governance and systems thinking without saying it, which suits design leadership and fractional clients. | Shows the speaker and founder side, and your style. |
| Navigation | Contents dialog, running head with chapter and folio, numbered chapters. | Top bar, full-screen menu on phones, big list rows. |
| Risk | Dense; the concept takes a second to land. More markup to maintain. | Dark and photo-led; needs strong pictures for every new section. |

## Content to confirm before any public launch

These come from the current site or your notes, and need checking:

- Lemuwé's client shows as "MerrJep" in the case study data. Check it.
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
