export const ContentType = {
  BLOG_POST: 'BLOG_POST',
  ARTICLE: 'ARTICLE',
  NEWS: 'NEWS',
  CASE_STUDY: 'CASE_STUDY',
} as const

export type ContentType = (typeof ContentType)[keyof typeof ContentType]

export const ContentStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const

export type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus]

export const InfoType = {
  CONTACT: 'CONTACT',
  ABOUT: 'ABOUT',
  SOCIAL: 'SOCIAL',
  LEGAL: 'LEGAL',
  SETTINGS: 'SETTINGS',
} as const

export type InfoType = (typeof InfoType)[keyof typeof InfoType]

export const UserRole = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  AUTHOR: 'AUTHOR',
  VIEWER: 'VIEWER',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]
