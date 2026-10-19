import { BUSINESS_RULES } from '../constants/businessRules';

export interface ISTTimeComponents {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hours: number; // 0-23
  minutes: number; // 0-59
  dateString: string; // YYYY-MM-DD
  timeString: string; // HH:mm
}

/**
 * Extracts date and time components strictly in Asia/Kolkata timezone.
 */
export function getISTComponents(date: Date = new Date()): ISTTimeComponents {
  // Use Intl.DateTimeFormat for reliable timezone conversion without external deps
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: BUSINESS_RULES.TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(date);
  const partMap: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      partMap[part.type] = part.value;
    }
  }

  const year = parseInt(partMap.year, 10);
  const month = parseInt(partMap.month, 10);
  const day = parseInt(partMap.day, 10);
  const hours = parseInt(partMap.hour, 10);
  const minutes = parseInt(partMap.minute, 10);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateString = `${year}-${pad(month)}-${pad(day)}`;
  const timeString = `${pad(hours)}:${pad(minutes)}`;

  return { year, month, day, hours, minutes, dateString, timeString };
}

/**
 * Helper to parse "HH:mm" into total minutes from midnight.
 */
function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map((val) => parseInt(val, 10));
  return h * 60 + (m || 0);
}

/**
 * Checks whether the ordering window is currently open.
 * Returns true strictly if openingTime <= currentTime < cutoffTime in Asia/Kolkata.
 */
export function isOrderWindowOpen(
  now: Date = new Date(),
  openingTime: string = BUSINESS_RULES.DEFAULT_OPENING_TIME,
  cutoffTime: string = BUSINESS_RULES.ORDER_CUTOFF_TIME
): boolean {
  const ist = getISTComponents(now);
  const currentMinutes = ist.hours * 60 + ist.minutes;
  const openMinutes = parseTimeToMinutes(openingTime);
  const closeMinutes = parseTimeToMinutes(cutoffTime);

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

/**
 * Checks whether customer self-cancellation is permitted.
 * In V1: Self-cancellation is strictly permitted before 11:00 PM (23:00) on the order placement date.
 */
export function isCancellationAllowed(
  orderCreatedAtIso: string,
  now: Date = new Date(),
  cutoffTime: string = BUSINESS_RULES.CANCELLATION_CUTOFF_TIME
): boolean {
  const currentIST = getISTComponents(now);
  const orderDate = new Date(orderCreatedAtIso);
  const orderIST = getISTComponents(orderDate);

  // Cancellation is only valid on the order's creation calendar day in IST
  if (currentIST.dateString !== orderIST.dateString) {
    return false;
  }

  const currentMinutes = currentIST.hours * 60 + currentIST.minutes;
  const cutoffMinutes = parseTimeToMinutes(cutoffTime);

  return currentMinutes < cutoffMinutes;
}

/**
 * Returns tomorrow's delivery date in YYYY-MM-DD format (IST).
 */
export function getNextDeliveryDate(now: Date = new Date()): string {
  // Add 24 hours to date, then format in IST
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const ist = getISTComponents(tomorrow);
  return ist.dateString;
}
