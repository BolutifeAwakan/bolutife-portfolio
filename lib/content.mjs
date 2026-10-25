import seed from "../content/seed.mjs";

// Reads content from Sanity (project 4t9br1cb), falling back to the seed if
// Sanity is unreachable or not yet filled. Cached in memory for a minute.

const PROJECT_ID = process.env.SANITY_PROJECT_ID ?? "4t9br1cb";
const DATASET = process.env.SANITY_DATASET || "production";
const TTL = 60 * 1000;

const M = `{"url": coalesce(image.asset->url, video.asset->url, url), "w": image.asset->metadata.dimensions.width, "h": image.asset->metadata.dimensions.height, "mime": coalesce(image.asset->mimeType, video.asset->mimeType), size, alt}`;
const PUBLISHED = `!(_id in path("drafts.**"))`;

const QUERY = `{
  "settings": *[_id == "siteSettings"][0]{
    ...,
    "portrait": portrait${M},
    "clientLogos": clientLogos[]${M},
    "aboutPortrait": aboutPortrait${M},
    "nowPlaying": nowPlaying{..., "cover": cover${M}},
    "aboutPhotos": aboutPhotos[]${M},
    "speakingImage": speakingImage${M},
    "speakingPhotos": speakingPhotos[]${M}
  },
  "projects": *[_type == "project" && defined(slug.current) && ${PUBLISHED}] | order(coalesce(order, 999) asc, year desc){
    ..., "slug": slug.current, "thumbnail": thumbnail${M}, "cover": cover${M},
    "sections": sections[]{..., "images": images[]${M}}
  },
  "services": *[_type == "service" && ${PUBLISHED}] | order(order asc),
  "awards": *[_type == "award" && ${PUBLISHED}] | order(year desc){..., "hoverImage": hoverImage.asset->url},
  "loader": *[_id == "loader"][0]{..., "backdrop": backdrop.asset->url, "portrait": portrait.asset->url},
  "testimonials": *[_type == "testimonial" && ${PUBLISHED}] | order(order asc){..., "avatar": avatar${M}},
  "notes": *[_type == "note" && ${PUBLISHED}] | order(order asc){..., "thumbnail": thumbnail${M}}
}`;

let cache = { data: null, at: 0 };

export async function getContent() {
  if (!PROJECT_ID) return seed;
  if (cache.data && Date.now() - cache.at < TTL) return cache.data;
  try {
    const url = `https://${PROJECT_ID}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(QUERY)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`Sanity ${res.status}`);
    const { result } = await res.json();
    const data = result && result.settings && result.projects?.length ? clean(result) : seed;
    cache = { data, at: Date.now() };
    return data;
  } catch (err) {
    console.error("Content fetch failed, using last good copy:", err.message);
    return cache.data || seed;
  }
}

function clean(r) {
  return {
    settings: r.settings,
    projects: r.projects || [],
    services: r.services || [],
    awards: r.awards || [],
    testimonials: r.testimonials || [],
    notes: r.notes || [],
    loader: r.loader || seed.loader,
  };
}
