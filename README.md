# Bolutife Awakan — portfolio

The website for bolutifeawakan. Same design as the Framer site, with content managed in Sanity.

- **Edit content:** https://bolutife.sanity.studio (sign in with your Sanity account)
- **Website code:** this repo. No dependencies, no build step.

## How it works

Every page is rendered by `api/render.js` from the content in Sanity (project `4t9br1cb`, dataset `production`). When you publish in the editor, the site shows the change within about a minute. If Sanity can't be reached, the site falls back to `content/seed.mjs`.

## Add a new case study

1. Open the editor → **Project** → create a new one.
2. **Card** tab: title, web address (click Generate), one-line summary, thumbnail (GIFs work). Tick "Show on the home page" to feature it. Set its position (1 shows first).
3. **Case study** tab: client, services (industry), year, what you did, opening paragraph, cover image.
4. Add **story sections**: a small heading, the text (leave an empty line between paragraphs), and the images. Set each image to Full width or Half width; two half-width images sit side by side.
5. Hit **Publish**.

## Deploy

Import this repo in Vercel. Framework preset: Other. Leave build and output settings empty. Vercel serves `public/` and the `api/` function.

## Preview locally

```
node dev.mjs
```
Open http://localhost:3000.
