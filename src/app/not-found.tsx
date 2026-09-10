import Link from 'next/link';
import { ArrowRight } from '@/components/icons';
import { L } from '@/components/language';

export default function NotFound() {
  return <main id="main-content" className="error-page not-found-page"><div className="container error-page-inner"><span className="error-code">404</span><span className="eyebrow"><L value={{ en: 'Page not found', ne: 'पृष्ठ भेटिएन' }} /></span><h1><L value={{ en: 'This page has moved.', ne: 'यो पृष्ठ सारिएको छ।' }} /></h1><p><L value={{ en: 'The page you requested is not available. Return to the ANTWU home page or contact the union office for help.', ne: 'तपाईंले खोज्नुभएको पृष्ठ उपलब्ध छैन। अन्तुको गृहपृष्ठमा फर्कनुहोस् वा सहयोगका लागि संघ कार्यालयमा सम्पर्क गर्नुहोस्।' }} /></p><div className="error-actions"><Link href="/" className="button primary"><L value={{ en: 'Back to home', ne: 'गृहपृष्ठमा फर्कनुहोस्' }} /><ArrowRight size={17} aria-hidden="true" /></Link><Link href="/faq" className="text-link"><L value={{ en: 'Read FAQs', ne: 'बारम्बार सोधिने प्रश्न हेर्नुहोस्' }} /><ArrowRight size={17} aria-hidden="true" /></Link></div></div></main>;
}
