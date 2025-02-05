// [Analysis] Enhanced ID extraction with validation and logging
export const extractVideoIdFromSlug = (slug: string): string => {
  if (!slug) {
    console.error('No slug provided to extract video ID');
    return '';
  }

  // [Analysis] YouTube IDs are 11 characters, match last segment after hyphen
  const matches = slug.match(/-([A-Za-z0-9_-]{11})$/);
  console.log('Extracting ID from slug:', slug, 'Matches:', matches); // Debug log
  
  if (!matches || !matches[1]) {
    console.error('Could not extract video ID from slug:', slug);
    return '';
  }

  return matches[1];
};