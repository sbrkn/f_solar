import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export function formatDate(date: Date | Timestamp | null | undefined): string {
  if (!date) return '';
  const d = date instanceof Timestamp ? date.toDate() : date;

  if (isToday(d)) {
    return `Today at ${format(d, 'h:mm a')}`;
  }
  if (isYesterday(d)) {
    return `Yesterday at ${format(d, 'h:mm a')}`;
  }
  return format(d, 'MMM d, yyyy');
}

export function formatRelativeTime(
  date: Date | Timestamp | null | undefined
): string {
  if (!date) return '';
  const d = date instanceof Timestamp ? date.toDate() : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatFullDate(
  date: Date | Timestamp | null | undefined
): string {
  if (!date) return '';
  const d = date instanceof Timestamp ? date.toDate() : date;
  return format(d, 'MMMM d, yyyy h:mm a');
}
