export type Language = 'en' | 'ne';

export type Localized = { en: string; ne: string };

export type IconName = 'shield' | 'eye' | 'flag' | 'users' | 'heart' | 'book' | 'megaphone' | 'bus' | 'map' | 'handshake';

export type CommitteeCategory = 'Central' | 'Province' | 'District' | 'Unit' | 'International';

export type CommitteeMember = {
  id: string;
  name: Localized;
  role: Localized;
  category: CommitteeCategory;
  location: Localized;
  image: string;
  accent: string;
  phone?: string;
};

export type Notice = {
  id: string;
  category: 'Notice' | 'Press release' | 'Tender' | 'News';
  title: Localized;
  date: string;
  urgent?: boolean;
  image?: string;
  file?: string;
  excerpt: Localized;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: Localized;
  excerpt: Localized;
  date: string;
  category: Localized;
  image: string;
  readTime: string;
};

export type GalleryItem = {
  id: string;
  title: Localized;
  image: string;
  type: 'photo' | 'video';
  size: 'wide' | 'tall' | 'square';
};

export const text = (value: Localized, lang: Language) => value[lang] || value.en;

export const noticeCategoryLabels: Record<Notice['category'], Localized> = {
  Notice: { en: 'Notice', ne: 'सूचना' },
  'Press release': { en: 'Press release', ne: 'प्रेस विज्ञप्ति' },
  Tender: { en: 'Tender', ne: 'बोलपत्र' },
  News: { en: 'News', ne: 'समाचार' },
};

export const documentCategoryLabels: Record<string, Localized> = {
  'Acts & regulations': { en: 'Acts & regulations', ne: 'ऐन तथा नियमावली' },
  Directives: { en: 'Directives', ne: 'निर्देशन' },
  Publications: { en: 'Publications', ne: 'प्रकाशन' },
};


