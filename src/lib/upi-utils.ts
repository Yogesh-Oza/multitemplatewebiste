/**
 * Utility functions for handling UPI payment strings
 */

/**
 * Extracts UPI ID from a full UPI payment string
 * @param upiString - Full UPI string like "upi://pay?pa=user@upi&pn=Name&am=0&cu=INR"
 * @returns UPI ID (e.g., "user@upi") or the original string if not a valid UPI string
 */
export function extractUpiId(upiString: string): string {
  if (!upiString || !upiString.includes('upi://')) {
    // If it's not a full UPI string, assume it's already just the UPI ID
    return upiString;
  }

  try {
    const url = new URL(upiString);
    const pa = url.searchParams.get('pa');
    return pa || upiString;
  } catch {
    // If URL parsing fails, try regex
    const match = upiString.match(/[?&]pa=([^&]+)/);
    return match ? match[1] : upiString;
  }
}

/**
 * Extracts payee name from a full UPI payment string
 * @param upiString - Full UPI string
 * @returns Payee name or empty string
 */
export function extractPayeeName(upiString: string): string {
  if (!upiString || !upiString.includes('upi://')) {
    return '';
  }

  try {
    const url = new URL(upiString);
    const pn = url.searchParams.get('pn');
    return pn || '';
  } catch {
    const match = upiString.match(/[?&]pn=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }
}

/**
 * Builds a full UPI payment string from UPI ID and payee name
 * @param upiId - UPI ID (e.g., "user@okaxis")
 * @param payeeName - Payee name (e.g., "Rupesh More")
 * @param transactionNote - Optional transaction note (e.g., "Property Tax" or "Water Tax")
 * @returns Full UPI payment string
 */
export function buildUpiString(
  upiId: string,
  payeeName: string = '',
  transactionNote: string = ''
): string {
  if (!upiId) {
    return '';
  }

  // If it's already a full UPI string, return as is
  if (upiId.includes('upi://')) {
    return upiId;
  }

  // Clean the UPI ID (remove any whitespace)
  const cleanUpiId = upiId.trim();

  // Build the UPI string
  const params = new URLSearchParams();
  params.set('pa', cleanUpiId);
  
  if (payeeName) {
    params.set('pn', payeeName.trim());
  }
  
  params.set('am', '0'); // Amount (0 means user enters amount)
  params.set('cu', 'INR'); // Currency
  
  if (transactionNote) {
    params.set('tn', transactionNote.trim());
  }

  return `upi://pay?${params.toString()}`;
}

