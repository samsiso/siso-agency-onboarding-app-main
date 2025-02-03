export const extractVideoIdFromSlug = (slug: string): string => {
  // [Analysis] YouTube IDs are always after the last double dash
  const matches = slug.match(/--([^-]+)$/);
  return matches ? matches[1] : '';
};