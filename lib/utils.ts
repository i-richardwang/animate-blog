// Tailwind class merging, the same `cn` the Animate UI registry files use.
export { cn } from 'cn';

// A content date is a calendar day (`date: 2025-10-15`, read as midnight
// UTC). It is formatted in UTC so that the server and every reader's browser
// print the same day, whatever time zone each of them is in.
const dateFormats = {
  medium: new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }),
  long: new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }),
};

/** `Oct 15, 2025`, or `October 15, 2025` with the `long` style. */
export function formatDate(date: Date, style: 'medium' | 'long' = 'medium') {
  return dateFormats[style].format(date);
}
