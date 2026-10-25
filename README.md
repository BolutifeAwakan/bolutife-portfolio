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

## Award hover images and the loader

- **Awards:** each award has a "Hover image". It shows in a small card that follows the cursor on the home page.
- **Loader:** the intro animation on the home page. Edit the three lines of text and the two images under **Loader**, or untick "Show the loader" to turn it off. Each visitor sees it once, then not again for 7 days.

## Deploy

Import this repo in Vercel. Framework preset: Other. Leave build and output settings empty. Vercel serves `public/` and the `api/` function.

## Preview locally

```
node dev.mjs
```
Open http://localhost:3000.

## Playground

Shots and small explorations, shown as a gallery at /playground.

1. Open the editor → **Playground shot** → create a new one.
2. Pick a **Category** (e.g. Posters). To add a new one, create it under **Playground category** first. Categories show as filters on the page, but only once they have at least one shot.
3. Add an image or GIF (or a video), and optionally a title, caption, tags and a link to where it lives.
4. Tick "Make it wide" for landscape pieces that should span two columns.
5. Hit **Publish**. The Playground link appears in the menu as soon as there's at least one shot.

The page title and intro are under **Playground page**.
