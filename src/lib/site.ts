/**
 * DRAFT SWITCH — see README.md § "Going live".
 *
 * While `isDraft` is true the site is marked `noindex, nofollow` and
 * robots.txt disallows everything. It is true because the photography on the
 * page is placeholder stock, not M. McCrohan's own work (see PHOTOS.md).
 * Swap the photographs for the business's own, set this to false, and set
 * `siteUrl` to the real domain.
 */
export const isDraft = true;

/** The production origin. Used for canonical, og:url and the sitemap. */
export const siteUrl = "https://mmccrohan-painting.netlify.app";
