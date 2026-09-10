import type { Metadata } from 'next';
import { FaqPageContent } from '@/components/public-pages';

export const metadata: Metadata = {
  title: 'Frequently asked questions',
  description: 'Answers about ANTWU membership, documents, support and the union’s work for transport workers.',
  alternates: { canonical: '/faq' },
};

export default FaqPageContent;
