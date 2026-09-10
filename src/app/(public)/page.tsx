import type { Metadata } from 'next';
import { AboutPreview, BlogPreview, CommitteePreview, ContactCta, FaqSection, GalleryPreview, Hero, StatsBand, UpdatesSection } from '@/components/home-sections';
export const metadata: Metadata = { title: 'All Nepal Transport Workers Union', description: 'The official ANTWU website. Find committee representatives, union notices, documents and membership registration.', alternates: { canonical: '/' } };
export default function HomePage() { return <main><Hero /><AboutPreview /><StatsBand /><UpdatesSection /><CommitteePreview /><GalleryPreview /><BlogPreview /><FaqSection /><ContactCta /></main>; }
