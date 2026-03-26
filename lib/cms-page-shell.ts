/**
 * Shared layout classes for `/admin` dashboard pages (responsive padding, width).
 */
export const CMS_PAGE_SHELL =
  "min-w-0 w-full max-w-7xl mx-auto px-4 pb-8 pt-2 sm:px-6 sm:pb-10 md:px-8 md:pb-12";

/** Page title row: stacks on small screens, actions full-width on mobile */
export const CMS_PAGE_HEADER =
  "mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between";

export const CMS_H1 =
  "text-2xl font-bold tracking-tight text-navy sm:text-3xl md:text-4xl";

/** Wrap `<Table>` (inside CardContent) for horizontal scroll on narrow viewports */
export const CMS_TABLE_SCROLL =
  "overflow-x-auto [-webkit-overflow-scrolling:touch]";
