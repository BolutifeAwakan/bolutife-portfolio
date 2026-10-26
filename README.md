# Bolutife Awakan — website

The website for bolutifeawakan.com. Content is managed in Sanity; the code is
this repo, with no dependencies and no build step.

The site now holds four designs that share one set of content:

- **The current site** (`legacy`): what bolutifeawakan.com shows today.
- **A. The Living Brand Book** (`book`): the site as your brand guidelines, in full-screen plates.
- **B. The Personal Editorial** (`editorial`): dark, photo-led, huge condensed type, with Mason Wong as the reference.
- **C. The Book** (`realbook`): the brand book as something you walk through (z1han.com as the reference): its pages held up on a curve you move along, each with one thing to touch. Black and white only; content from the positioning strategy.

Nothing changes for visitors until you switch it on (see "Run the A/B test").

- **Edit content:** https://bolutife.sanity.studio (sign in with your Sanity account)
- **Compare the designs:** `/preview` on any deployment

## Look at either design

Open `/preview` for links to both directions and the current site. Each link
keeps you inside that design as you click around, on desktop or phone:

- `/preview/brand-book` and any page under it, for example `/preview/brand-book/work`
- `/preview/personal-editorial` and any page under it
- `/preview/the-book` and any page under it
- `/preview/current` for today's site

Preview pages are hidden from search engines, and opening one marks your
browser as internal, so your own visits are never counted in the test.

## Add or update content

Projects, notes, testimonials, awards, services, speaking photos, playground
shots and most page text come from Sanity, as before. Publish there and both
designs update within a minute.

The new v2 content that Sanity doesn't hold yet lives in `content/v2.mjs`:
the headline, ventures (Design Lever, Lilac Africa), books, speaking topics
and talks, the path, and the On the side text. Edit that file and push, and
both designs update on the next deploy. These fields can move into Sanity
later; `lib/model.mjs` already prefers a Sanity value when one exists
(under `settings.v2`).

The 2025 portraits are in `public/assets/photos` (each at 640, 1280 and 2000px,
WebP and JPEG). `lib/photos.mjs` lists them with their descriptions.

### Add a new case study

1. Open the editor → **Project** → create a new one.
2. **Card** tab: title, web address (click Generate), one-line summary, thumbnail (GIFs work). Tick "Show on the home page" to feature it. Set its position (1 shows first).
3. **Case study** tab: client, services (industry), year, what you did, opening paragraph, cover image.
4. Add **story sections**: a small heading, the text (leave an empty line between paragraphs), and the images. Set each image to Full width or Half width; two half-width images sit side by side.
5. Hit **Publish**.

### Award hover images and the loader (current site only)

- **Awards:** each award has a "Hover image". It shows in a small card that follows the cursor on the current home page.
- **Loader:** the intro animation on the current home page. Edit the three lines of text and the two images under **Loader**, or untick "Show the loader" to turn it off. The new designs don't use a loader.

## Run the A/B test

All settings are environment variables in Vercel (Project → Settings →
Environment Variables → Production), followed by a redeploy (Deployments →
latest → Redeploy).

| Variable | What it does | Default |
|---|---|---|
| `EXPERIMENT_ENABLED` | `1` runs the test. Anything else turns it off. | off |
| `EXPERIMENT_ARMS` | The two designs to compare, for example `realbook,editorial`. | `book,editorial` |
| `EXPERIMENT_SPLIT` | Percent of new visitors who get the first design in `EXPERIMENT_ARMS`. | `50` |
| `EXPERIMENT_ID` | Name of this run. Change it to start over and reassign everyone. | `v2-directions-1` |
| `DEFAULT_DIRECTION` | What everyone sees when the test is off: `legacy`, `book`, `editorial` or `realbook`. | `legacy` |
| `ANALYTICS_FORWARD_URL` | Where to send each event so it's kept (see below). | none |

**Before you start the test**, decide where events are stored (Vercel keeps
function logs only briefly): set `ANALYTICS_FORWARD_URL` or add a log drain.
`docs/experiment.md` explains the events, the success metric and consent.

- **Change the split:** set `EXPERIMENT_SPLIT`, for example `70`, and redeploy. People already assigned keep their direction.
- **Read the results:** export the `ba_event` lines and run `node scripts/results.mjs events.jsonl`. It won't call a winner until there's enough evidence.
- **End the test:** set `EXPERIMENT_ENABLED` to `0` and redeploy. Everyone then sees `DEFAULT_DIRECTION`.
- **Make one design permanent:** set `DEFAULT_DIRECTION` to `book` or `editorial`, `EXPERIMENT_ENABLED` to `0`, and redeploy. Old addresses (`/notes`, `/playground`) redirect to the new ones (`/writing`, `/experiments`).
- **Retire a design for good:** once one is permanent, delete the other's folder (`lib/themes/book` or `lib/themes/editorial`) and its files in `public/assets` (`book.css` and `book.js`, or `editorial.css` and `editorial.js`), and remove it from `THEMES` in `lib/router.mjs`. The legacy templates (`lib/templates.mjs`, `public/assets/site.css`, `site.js`) can go too.

## How it's built

```
api/render.js          every page request; sets cookies and caching
api/collect.js         receives A/B test events
lib/content.mjs        reads Sanity (falls back to content/seed.mjs)
lib/model.mjs          the shared content layer both designs render from
lib/router.mjs         routes, previews, redirects, sitemap
lib/experiment.mjs     test settings and visitor assignment
lib/shell.mjs          SEO tags, canonical URLs and analytics, identical for both designs
lib/themes/book/       Direction A templates   (public/assets/book.css, book.js)
lib/themes/editorial/  Direction B templates   (public/assets/editorial.css, editorial.js)
lib/themes/realbook/   Direction C templates   (public/assets/realbook.css, realbook.js)
lib/themes/marks.mjs   the two BA monograms
lib/templates.mjs      the current site's templates
public/assets/track.js measurement, identical for both designs
test/run.mjs           checks both designs are complete and comparable
scripts/results.mjs    reads exported test events
docs/                  the test plan, usability script and evaluation
```

## Deploy

The repo is connected to Vercel. Pushing to `main` deploys production; any
other branch gets a preview deployment. Framework preset: Other, no build settings.

## Work on it locally

```
node dev.mjs                 # http://localhost:3000, live Sanity content
node test/run.mjs            # checks both designs render every page with the same content
```

To work offline, save a content snapshot module and run
`DEV_CONTENT=/path/to/snapshot.mjs node dev.mjs`.

## Playground (Experiments)

Shots and small explorations. The current site shows them at `/playground`;
both new designs show them at `/experiments`.

1. Open the editor → **Playground shot** → create a new one.
2. Pick a **Category** (e.g. Posters). To add a new one, create it under **Playground category** first.
3. Add an image or GIF (or a video), and optionally a title, caption, tags and a link to where it lives.
4. Tick "Make it wide" for landscape pieces.
5. Hit **Publish**.

## Image grade for notes

Every note image uses the same grade, based on Bolutife's CapCut look (Baked, warmth pulled back): warm but true skin, cream whites, softer highlights, gently lifted blacks.

For an Unsplash photo, add this to the end of its `images.unsplash.com/photo-…` link before uploading:

```
?w=2400&q=85&fm=jpg&sat=-15&con=-10&high=-25&shad=18&blend=E8A060&balph=20&bm=softlight
```

For your own photos, apply the Baked filter with warmth pulled back before uploading.
