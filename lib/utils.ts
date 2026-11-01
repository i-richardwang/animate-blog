import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Tailwind class merging, the same `cn` the Animate UI registry files use.
export { cn } from 'cn';

export function formatDate(date: Date) {
  return format(date, 'MMM d, yyyy', { locale: enUS });
}
