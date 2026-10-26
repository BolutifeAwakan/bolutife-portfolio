// A/B experiment between the two v2 directions.
//
// Everything is controlled by environment variables in Vercel
// (Project → Settings → Environment Variables), then a redeploy:
//
//   EXPERIMENT_ENABLED   "1" to run the test. Anything else = off (the default).
//   EXPERIMENT_ID        Name of this test run. Changing it reassigns everyone.
//   EXPERIMENT_ARMS      The two directions to compare, e.g. "arc,editorial". Default "book,editorial".
//   EXPERIMENT_SPLIT     Percent of new visitors who get the first arm (0–100). Default 50.
//   DEFAULT_DIRECTION    What everyone sees when the test is off:
//                        "legacy" (the current site, the default), "book", "editorial" or "arc".
//
// Visitors are assigned on the server before the page is built, so there is
// no flicker, and the choice is kept in a first-party cookie for 30 days.

export const DIRECTIONS = {
  book: { key: "book", name: "The Living Brand Book", slug: "brand-book" },
  editorial: { key: "editorial", name: "The Personal Editorial", slug: "personal-editorial" },
  arc: { key: "arc", name: "The Arc", slug: "the-arc" },
  legacy: { key: "legacy", name: "Current site", slug: "current" },
};

export const PREVIEW_PREFIX = "/preview";
export const ASSIGN_COOKIE = "ba_dir";
export const INTERNAL_COOKIE = "ba_internal";

export function config(env = process.env) {
  const split = Number(env.EXPERIMENT_SPLIT);
  const def = env.DEFAULT_DIRECTION;
  const arms = String(env.EXPERIMENT_ARMS || "book,editorial").split(",").map((s) => s.trim()).filter((k) => DIRECTIONS[k] && k !== "legacy");
  return {
    arms: arms.length === 2 && arms[0] !== arms[1] ? arms : ["book", "editorial"],
    enabled: env.EXPERIMENT_ENABLED === "1",
    id: (env.EXPERIMENT_ID || "v2-directions-1").replace(/[^a-z0-9-]/gi, ""),
    splitBook: Number.isFinite(split) ? Math.min(100, Math.max(0, split)) : 50,
    defaultDirection: DIRECTIONS[def] ? def : "legacy",
  };
}

export function parseCookies(header = "") {
  return Object.fromEntries(
    String(header || "")
      .split(";")
      .map((p) => p.trim().split("="))
      .filter(([k]) => k)
      .map(([k, ...v]) => [k, decodeURIComponent(v.join("="))])
  );
}

// Decide which direction a production request gets.
// Returns { direction, assigned, setCookie }.
export function resolve(cookies, cfg = config(), rand = Math.random) {
  if (!cfg.enabled) return { direction: cfg.defaultDirection, inExperiment: false, setCookie: null };
  const saved = cookies[ASSIGN_COOKIE] || "";
  const [id, dir] = saved.split(":");
  const arms = cfg.arms || ["book", "editorial"];
  if (id === cfg.id && arms.includes(dir)) {
    return { direction: dir, inExperiment: true, setCookie: null };
  }
  const direction = rand() * 100 < cfg.splitBook ? arms[0] : arms[1];
  return {
    direction,
    inExperiment: true,
    setCookie: `${ASSIGN_COOKIE}=${cfg.id}:${direction}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax; Secure`,
  };
}

export const internalCookie = `${INTERNAL_COOKIE}=1; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax; Secure`;
