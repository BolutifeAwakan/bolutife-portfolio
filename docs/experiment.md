# The A/B test: how it works and how to run it

## What is being compared

Two complete designs of the same site, with the same pages, content, projects,
contact form and analytics:

- **A. The Living Brand Book** (`book`)
- **B. The Personal Editorial** (`editorial`)

The current site (`legacy`) stays live until you choose.

## Assignment

- A visitor's first page request is assigned on the server, before the page is
  built, so there is no flicker.
- The assignment is kept in a first-party cookie `ba_dir` (value
  `<test id>:<direction>`) for 30 days. Every page and return visit inside
  that window shows the same direction.
- Changing `EXPERIMENT_ID` starts a fresh test: everyone is reassigned.
- While the test runs, pages are served with `Cache-Control: private, no-store`
  so one visitor's direction is never cached for another. With the test off,
  pages are cached at the edge as before.
- Both directions use the same URLs, the same canonical tags and the same
  sitemap, so search engines see one site.

## Who is measured

Only real visitors who:

1. arrive while the test is on,
2. are not on a `/preview` link, and have never opened one (that sets a
   `ba_internal` cookie for a year), and
3. say yes to the measurement question.

Anyone who says no still gets the full site; nothing is sent.

## Events

Sent by `public/assets/track.js`, identical in both directions, received by
`api/collect.js`. Each event carries the test id, the direction, the page type,
a random per-tab session id and phone or desktop. No IP, user agent, name or
email is stored.

| Event | Fires when |
|---|---|
| `exposure` | Any page is shown |
| `home_engaged` | The visitor scrolls half the home page or clicks anything on it |
| `work_click` | A link to `/work` or a case study is followed |
| `case_view` | A case study page is viewed |
| `about_view`, `ventures_view`, `speaking_view`, `writing_view` | Those pages are viewed (writing includes articles) |
| `venture_click` | A link out to Design Lever or the book's site is followed |
| `contact_cta` | Any contact or "work with me" link, or the email address, is clicked |
| `speaking_cta` | Any "book me to speak" link is clicked |
| `contact_submit` / `speaking_submit` | The contact form is sent (it opens an email draft; whether the email is then sent can't be known) |
| `nav_open` | The menu or contents panel is opened |
| `qualified` | **Primary metric.** In one session, the visitor viewed a case study and then took a contact or speaking action |

### Success, defined before launch

- **Primary:** share of sessions with `qualified`.
- **Secondary:** any contact or speaking action; form sends; case study views;
  clicks to work; home engagement; About, Ventures and Writing visits; split by phone and desktop.
- **Not a success measure:** time on site. Longer can mean lost.

### Known differences that could affect results

These are design differences, kept on purpose, and noted so they can be read into the results:

- A shows a contents list on the home page and a contents rail on wide
  screens; B uses a top navigation bar and a full-screen menu on phones.
- B repeats a "Let's work together" band at the bottom of most pages; A ends
  every chapter with previous/next chapter links and contact details in the footer.
- B's header has a "Work with me" button on wide screens; A's contact link
  sits in the contents.
- A has one load animation (the monogram draws); B has one (the name rises and the portrait opens). Both are skipped for people who ask for reduced motion.

Avoid changing either design substantially while the test runs.

## Storing the events

The endpoint writes each event as one JSON line to the Vercel function log
(search the logs for `ba_event`). Vercel only keeps logs for a short time
on most plans, so before the test starts, set **one** of:

- `ANALYTICS_FORWARD_URL`: any HTTPS endpoint that accepts a JSON POST (for
  example a webhook into a spreadsheet, a database, or an analytics tool), or
- a Vercel log drain to a log store you can export from.

Then run `node scripts/results.mjs events.jsonl` on the exported lines. The
script reports each metric per direction, tests the primary metric, and will
not call a winner before 400 sessions per direction, 14 days and 30 qualified
sessions in total. With fewer visitors than that, use the usability sessions
(`docs/usability-test.md`).

## Consent

The measurement question appears once, only while the test runs. The `ba_dir`
cookie is set for every visitor in the test so their experience stays
consistent; it holds no personal data. UK guidance (PECR) treats A/B testing
cookies as not strictly necessary, so if you want to be fully cautious, ask
for consent before assigning as well. That would mean visitors who decline
see the default site and aren't part of the test.
