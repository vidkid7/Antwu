import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Temporarily unavailable',
  description: 'ANTWU is temporarily unable to complete this request.',
  robots: { index: false, follow: false },
};

export default function ServerErrorPage() {
  return <main className="error-page" id="main-content"><div className="container error-page-inner"><span className="error-code">500</span><span className="eyebrow">Temporary interruption</span><h1>We’re working on it.</h1><p>The union website could not complete that request. Please try again or return to the home page.</p><div className="error-actions"><Link href="/" className="button primary">Back to home <ArrowRight size={17} aria-hidden="true" /></Link><Link href="/contact" className="text-link">Contact the office <ArrowRight size={17} aria-hidden="true" /></Link></div></div></main>;
}
