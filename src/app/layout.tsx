import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { LanguageProvider } from '@/components/language';
import { ContentProvider } from '@/components/content-provider';
import { getPublicContent } from '@/lib/server/store';
import './globals.css';

export const dynamic = 'force-dynamic';
const siteBase = () => (process.env.NEXT_PUBLIC_SITE_URL || 'https://antwu.org.np').replace(/\/+$/, '');

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#121f20',
  colorScheme: 'light',
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = getPublicContent().settings[0];
  const title = settings?.siteTitle.en || 'All Nepal Transport Workers’ Union';
  const description = settings?.description.en || 'Official ANTWU website.';
  const base = siteBase();
  return {
    title: { default: `ANTWU — ${title}`, template: '%s · ANTWU' }, description,
    metadataBase: new URL(base),
    keywords: ['ANTWU', 'All Nepal Transport Workers Union', 'Nepal transport workers', 'transport workers rights', 'श्रमिक संघ'],
    authors: [{ name: 'All Nepal Transport Workers’ Union', url: base }],
    creator: 'All Nepal Transport Workers’ Union', publisher: 'ANTWU', category: 'labour union',
    icons: { icon: [{ url: '/icon.png', sizes: '64x64', type: 'image/png' }], apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }] },
    openGraph: { title, description, url: base, siteName: 'ANTWU', type: 'website', locale: 'en_US', alternateLocale: 'ne_NP', images: [{ url: '/assets/official/union-gathering.webp', width: 1600, height: 954, alt: 'ANTWU members gathered together' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/assets/official/union-gathering.webp'] },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const initial = getPublicContent();
  const lang = (await cookies()).get('antwu-language')?.value === 'ne' ? 'ne' : 'en';
  const settings = initial.settings[0];
  const base = siteBase();
  const organisation = { '@context': 'https://schema.org', '@type': 'Organization', name: settings?.siteTitle.en, alternateName: settings?.siteTitle.ne, url: base, logo: `${base}/assets/official/logo.png`, email: settings?.email, telephone: settings?.phone, address: { '@type': 'PostalAddress', streetAddress: settings?.address.en, addressCountry: 'NP' } };
  const website = { '@context': 'https://schema.org', '@type': 'WebSite', name: settings?.siteTitle.en || 'ANTWU', url: base, inLanguage: ['en-NP', 'ne-NP'], publisher: { '@type': 'Organization', name: settings?.siteTitle.en || 'ANTWU', url: base } };
  return <html lang={lang}><body><LanguageProvider initialLang={lang}><ContentProvider initial={initial}>{children}</ContentProvider></LanguageProvider><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation).replace(/</g, '\\u003c') }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website).replace(/</g, '\\u003c') }} /></body></html>;
}
