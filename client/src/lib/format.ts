/**
 * Format a price as Indian Rupees (INR) with standard Indian comma grouping
 * Example: 104900 -> ₹1,04,900.00
 */
export function formatPrice(amount: number | string | undefined | null): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0.00';
  }
  const num = Number(amount);
  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format rating with 1 decimal place safely
 * Example: 4.82 -> 4.8
 */
export function formatRating(rating: number | string | undefined | null): string {
  if (rating === null || rating === undefined || isNaN(Number(rating))) {
    return '0.0';
  }
  return Number(rating).toFixed(1);
}
