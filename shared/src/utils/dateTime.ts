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

export interface OrderWindowOptions {
  /** Configured opening time in 24hr "HH:mm" format (from Admin system settings) */
  openingTime: string;
  /** Configured or locked cutoff time in 24hr "HH:mm" format (defaults to locked 23:00 IST) */
  cutoffTime?: string;
  /** Optional reference date for testing or server timestamps */
  now?: Date;
}

/**
 * Extracts date and time components strictly in Asia/Kolkata timezone.
 */
export function getISTComponents(date: Date = new Date()): ISTTimeComponents {
  // Use Intl.DateTimeFormat for reliable timezone conversion without external dependencies
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
 * Checks whether the ordering window is currently open based on configured opening and cutoff times.
 *
 * NOTE: The opening time is NOT a fixed business rule. It must be supplied from Admin-configurable
 * system settings. The cutoff time defaults to the locked operational rule of 23:00 IST.
 *
 * @param openingTime Configured opening time in "HH:mm" 24hr format (e.g. from Admin settings)
 * @param cutoffTime Configured cutoff time in "HH:mm" (defaults to locked 23:00 IST)
 * @param now Reference timestamp (defaults to current server/client time)
 * @returns boolean strictly evaluating openingTime <= currentTime < cutoffTime in Asia/Kolkata
 */
export function isOrderWindowOpen(
  openingTime: string,
  cutoffTime?: string,
  now?: Date
): boolean;
export function isOrderWindowOpen(options: OrderWindowOptions): boolean;
export function isOrderWindowOpen(
  openingTimeOrOptions: string | OrderWindowOptions,
  cutoffTimeParam: string = BUSINESS_RULES.ORDER_CUTOFF_TIME,
  nowParam: Date = new Date()
): boolean {
  let openingTime: string;
  let cutoffTime: string;
  let now: Date;

  if (typeof openingTimeOrOptions === 'object') {
    openingTime = openingTimeOrOptions.openingTime;
    cutoffTime = openingTimeOrOptions.cutoffTime ?? BUSINESS_RULES.ORDER_CUTOFF_TIME;
    now = openingTimeOrOptions.now ?? new Date();
  } else {
    openingTime = openingTimeOrOptions;
    cutoffTime = cutoffTimeParam;
    now = nowParam;
  }

  const ist = getISTComponents(now);
  const currentMinutes = ist.hours * 60 + ist.minutes;
  const openMinutes = parseTimeToMinutes(openingTime);
  const closeMinutes = parseTimeToMinutes(cutoffTime);

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

/**
 * Checks whether customer self-cancellation is permitted.
 * In V1: Self-cancellation is strictly permitted before the cancellation cutoff (locked at 23:00 IST)
 * on the order placement date.
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
