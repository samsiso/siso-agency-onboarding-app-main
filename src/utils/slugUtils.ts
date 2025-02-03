export function generateVideoSlug(title: string, videoId: string): string {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .substring(0, 60) // Limit length
    .replace(/-+$/, '')}-${videoId}`; // Append video ID
}

export function extractVideoIdFromSlug(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1];
}