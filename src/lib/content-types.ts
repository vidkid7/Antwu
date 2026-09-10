import type { Localized, CommitteeMember, Notice, BlogPost, GalleryItem, IconName } from './types';

export type Published = { status?: 'Published' | 'Draft'; order?: number };
export type DocumentRecord = Published & { id: string; category: string; title: Localized; date: string; type: string; size: string; file: string; image?: string; description?: Localized };
export type HeroRecord = Published & { id: string; kicker: Localized; title: Localized; sub: Localized; image: string };
export type ActivityRecord = Published & { id: string; title: Localized; body: Localized; date: string; image: string };
export type PageRecord = Published & { id: string; title: Localized; body: Localized; image?: string };
export type SiteSettings = { id: string; address: Localized; phone: string; email: string; mission: Localized; siteTitle: Localized; description: Localized; facebook?: string; instagram?: string };
export type ContentData = {
  committeeMembers: (CommitteeMember & Published)[];
  notices: (Notice & Published & { body?: Localized })[];
  blogPosts: (BlogPost & Published & { body?: Localized })[];
  galleryItems: (GalleryItem & Published & { video?: string })[];
  documents: DocumentRecord[];
  heroSlides: HeroRecord[];
  activities: ActivityRecord[];
  pages: PageRecord[];
  stats: (Published & { id: string; value: number; label: Localized; suffix: string })[];
  values: (Published & { id: string; icon: IconName; number: string; title: Localized; body: Localized })[];
  settings: SiteSettings[];
};
export type ContentCollection = keyof ContentData;
export const contentCollections: ContentCollection[] = ['committeeMembers', 'notices', 'blogPosts', 'galleryItems', 'documents', 'heroSlides', 'activities', 'pages', 'stats', 'values', 'settings'];
export type SubmissionRecord = { id: string; status: string; submittedAt: string; name: string; email?: string; phone?: string; [key: string]: unknown };
export type AdminData = ContentData & { messages: SubmissionRecord[]; applications: SubmissionRecord[] };
