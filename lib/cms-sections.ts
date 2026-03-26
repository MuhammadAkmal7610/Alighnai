/**
 * Future CMS “sections”: store an ordered list on `Page.metadata` (e.g. `metadata.sections`).
 * Editors can add/reorder blocks without changing public `/site` route files in phase 2.
 */
export type CmsSectionBlock =
  | { id: string; type: "richtext"; html: string }
  | { id: string; type: "hero"; title: string; subtitle?: string };
