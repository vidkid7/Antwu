import type { Metadata } from 'next';
import { TermsPageContent } from '@/components/public-pages';

export const metadata: Metadata = {
  title: 'Terms & conditions',
  description: 'Read the terms for using the ANTWU public website and its published information.',
  alternates: { canonical: '/terms-and-conditions' },
  robots: { index: true, follow: true },
};

export default TermsPageContent;
