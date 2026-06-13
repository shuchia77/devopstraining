import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDateShort(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
}

export function formatDateFull(dateString: string): string {
  try {
    return format(parseISO(dateString), 'EEEE, MMMM dd, yyyy');
  } catch {
    return dateString;
  }
}

export function formatTimeAgo(dateString: string): string {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function isToday(dateString: string): boolean {
  return dateString === getDateString();
}
