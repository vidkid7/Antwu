import type { Metadata } from 'next';
import { CommitteePageContent } from '@/components/public-pages';
export const metadata: Metadata = { title: 'Committee directory', description: 'Find ANTWU representatives by name, role and committee category.', alternates: { canonical: '/committee' } };
export default CommitteePageContent;

