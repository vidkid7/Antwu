import type { MetadataRoute } from 'next';
import { getPublicContent } from '@/lib/server/store';
export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://antwu.org.np').replace(/\/+$/, '');
  const paths = ['/', '/about', '/about-us', '/committee', '/activities', '/updates', '/documents', '/gallery', '/blog', '/faq', '/contact', '/contact-us', '/membership', '/privacy-policy', '/terms-and-conditions', '/render_about', '/orgnizationchart', '/render_central_members', '/render_province_members', '/render_district_members', '/render_unit_members', '/render_campus_members', '/render_chairperson', '/render_rules', '/render_directot', '/render_publication', '/render_notice', '/render_press', '/render_tender', '/render_news', '/render_other', '/render_images', '/render_videos', '/render_youthactivity', '/render_youthstats', '/render_all_posts', '/portal/contact_page', '/registermember'];
  paths.push('/render_international_members', ...getPublicContent().blogPosts.map((post) => `/blog/${post.slug}`));
  return paths.map((path) => ({ url: `${base}${path}`, changeFrequency: path === '/' ? 'weekly' : 'monthly', priority: path === '/' ? 1 : path.startsWith('/blog') || ['/about', '/about-us', '/contact', '/contact-us', '/faq'].includes(path) ? .8 : .6, alternates: { languages: { en: `${base}${path}?change_language=en`, ne: `${base}${path}?change_language=ne` } } }));
}
