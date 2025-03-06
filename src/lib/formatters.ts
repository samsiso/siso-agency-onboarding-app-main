
/**
 * [Analysis] Collection of formatting utilities for consistent display across the application
 */

/**
 * Formats a number with locale-specific thousands separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Formats a date string to a human-readable format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

/**
 * Formats a percentage value with a % symbol
 */
export const formatPercentage = (value: number): string => {
  return `${value}%`;
};

/**
 * Shortens a large number to a abbreviated format (e.g., 1.2k, 3.5M)
 */
export const formatCompactNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  
  const formatter = new Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(num);
};

/**
 * Truncates text to a specified length and adds ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
