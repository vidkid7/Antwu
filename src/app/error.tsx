'use client';

import Link from 'next/link';
import { ArrowRight } from '@/components/icons';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="error-page" id="main-content"><div className="container error-page-inner"><span className="error-code">500</span><span className="eyebrow">Something went wrong</span><h1>We hit a rough patch.</h1><p>The page could not finish loading. Try again, or return to the ANTWU home page.</p><div className="error-actions"><button type="button" className="button primary" onClick={() => reset()}>Try again <ArrowRight size={17} aria-hidden="true" /></button><Link href="/" className="text-link">Back to home <ArrowRight size={17} aria-hidden="true" /></Link></div></div></main>;
}
