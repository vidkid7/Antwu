import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from '@/components/icons';
import { L } from '@/components/language';
import { BodyText, OfficeAside, PageHero } from '@/components/public-ui';
import { getPublicContent } from '@/lib/server/store';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = getPublicContent().blogPosts.find(item => item.slug === slug && item.status !== 'Draft'); return { title: post?.title.en || 'Story not found', description: post?.excerpt.en }; }
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const post = getPublicContent().blogPosts.find(item => item.slug === slug && item.status !== 'Draft'); if (!post) notFound(); return <main><PageHero title={post.title} description={post.excerpt} section={{ en: 'Blog', ne: 'ब्लग' }} /><section className="section"><div className="container two-col"><article><div className="blog-meta"><L value={post.category} /><time>{post.date}</time></div>{post.image && <Image className="article-image" src={post.image} alt={post.title.en} width={1100} height={750} sizes="(max-width: 760px) 100vw, 65vw" />}{post.body && <BodyText value={post.body} />}<div className="below-archive-link"><Link href="/blog" className="text-link"><L value={{ en: 'Back to all stories', ne: 'सबै लेखमा फर्कनुहोस्' }} /><ArrowRight size={17} /></Link></div></article><OfficeAside /></div></section></main>; }
