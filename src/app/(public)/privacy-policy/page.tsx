import type { Metadata } from 'next';
import { PrivacyPageContent } from '@/components/public-pages';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'Learn how ANTWU handles information shared through its public website, contact form and membership application.',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: true, follow: true },
};

export default PrivacyPageContent;
