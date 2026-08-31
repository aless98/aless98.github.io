/** Date helpers for CV-style content, where frontmatter dates are ISO strings. */

const MONTH_YEAR: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' }

/** `2022-02-01` -> `Feb 2022`. Returns the input unchanged if unparseable. */
export function formatMonthYear(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', MONTH_YEAR)
}

/** `2022-02-01` -> `2022`. Returns the input unchanged if unparseable. */
export function formatYear(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return String(d.getFullYear())
}

/** An ongoing entry (no end date) renders as `Feb 2022 – Present`. */
export function formatRange(startDate: string, endDate?: string): string {
  const start = formatMonthYear(startDate)
  return `${start} – ${endDate ? formatMonthYear(endDate) : 'Present'}`
}

/** Year-granularity range, for compact lists: `2020 – 2023`. */
export function formatYearRange(startDate: string, endDate?: string): string {
  const start = formatYear(startDate)
  const end = endDate ? formatYear(endDate) : 'present'
  return start === end ? start : `${start} – ${end}`
}

/**
 * Most recent first, by end date. An entry with no end date is ongoing and
 * therefore sorts above everything finished. Falls back to start date on ties.
 */
export function byRecencyDesc(
  a: { startDate: string; endDate?: string },
  b: { startDate: string; endDate?: string },
): number {
  const end = (x: { endDate?: string }) =>
    x.endDate ? new Date(x.endDate).getTime() : Number.POSITIVE_INFINITY
  const diff = end(b) - end(a)
  if (diff !== 0 && Number.isFinite(diff)) return diff
  if (end(a) !== end(b)) return end(b) - end(a)
  return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
}
