export const extractVideoIdFromSlug = (slug: string): string => {
  // [Analysis] YouTube IDs are always after the last hyphen
  const matches = slug.match(/-([^-]+)$/);
  console.log('Extracting ID from slug:', slug, 'Matches:', matches); // Debug log
  return matches ? matches[1] : '';
};