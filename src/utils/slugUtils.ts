export const extractVideoIdFromSlug = (slug: string): string => {
  const parts = slug.split('-');
  return parts[parts.length - 1] || '';
};