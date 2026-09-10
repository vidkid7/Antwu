'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Facebook, Instagram, Mail, MapPin, Menu, Phone, X } from '@/components/icons';
import { BrandLockup } from '@/components/logo';
import { L, LanguageSwitcher, useLanguage } from '@/components/language';
import { useContent } from '@/components/content-provider';
import { text, type Localized } from '@/lib/types';
type NavLink = { href: string; label: Localized };
type Group = { key: string; label: Localized; links: NavLink[] };
const aboutLinks: NavLink[] = [
  { href: '/render_about', label: { en: 'Introduction', ne: 'परिचय' } },
  { href: '/orgnizationchart', label: { en: 'Organizational Chart', ne: 'संगठनात्मक चार्ट' } },
  { href: '/render_central_members', label: { en: 'Central Committee Members', ne: 'केन्द्रीय समिति सदस्यहरू' } },
  { href: '/render_province_members', label: { en: 'Province Committee Members', ne: 'प्रदेश समिति सदस्यहरू' } },
  { href: '/render_district_members', label: { en: 'District Committee Members', ne: 'जिल्ला समिति सदस्यहरू' } },
  { href: '/render_campus_members', label: { en: 'International Committee Members', ne: 'अन्तर्राष्ट्रिय समिति सदस्यहरू' } },
  { href: '/render_chairperson', label: { en: 'Message from Chairperson', ne: 'अध्यक्षको सन्देश' } },
];
const mobileAboutLinks: NavLink[] = [...aboutLinks.slice(0, 6), { href: '/render_unit_members', label: { en: 'Unit Committee Members', ne: 'इकाई समिति सदस्यहरू' } }, aboutLinks[6]];
const documentsLinks: NavLink[] = [
  { href: '/render_rules', label: { en: 'Acts & Regulations', ne: 'ऐन तथा नियमावली' } },
  { href: '/render_directot', label: { en: 'Directory', ne: 'निर्देशिका' } },
  { href: '/render_publication', label: { en: 'Publication', ne: 'प्रकाशन' } },
];
const downloadsLinks: NavLink[] = [
  { href: '/render_news', label: { en: 'Notice', ne: 'सूचना' } },
  { href: '/render_press', label: { en: 'Press Release', ne: 'प्रेस विज्ञप्ति' } },
  { href: '/render_tender', label: { en: 'Tender', ne: 'बोलपत्र' } },
  { href: '/render_news', label: { en: 'News', ne: 'समाचार' } },
  { href: '/render_other', label: { en: 'Others', ne: 'अन्य' } },
];
const galleryLinks: NavLink[] = [
  { href: '/render_images', label: { en: 'Photo Gallery', ne: 'फोटो ग्यालेरी' } },
  { href: '/render_videos', label: { en: 'Video Gallery', ne: 'भिडियो ग्यालेरी' } },
];
const statsLinks: NavLink[] = [
  { href: '/render_youthactivity', label: { en: 'Activity', ne: 'गतिविधि' } },
  { href: '/render_youthstats', label: { en: 'Statistics', ne: 'तथ्याङ्क' } },
];
const desktopGroups: Group[] = [
  { key: 'about', label: { en: 'About Us', ne: 'हाम्रो संघ' }, links: aboutLinks },
  { key: 'information', label: { en: 'Information', ne: 'सूचना' }, links: [] },
  { key: 'gallery', label: { en: 'Gallery', ne: 'ग्यालरी' }, links: galleryLinks },
  { key: 'stats', label: { en: 'Statisics/Activity', ne: 'तथ्याङ्क/गतिविधि' }, links: statsLinks },
];
const mobileGroups: Group[] = [
  { key: 'about', label: { en: 'About Us', ne: 'हाम्रो संघ' }, links: mobileAboutLinks },
  { key: 'documents', label: { en: 'Documents', ne: 'कागजात' }, links: documentsLinks },
  { key: 'downloads', label: { en: 'Downloads', ne: 'डाउनलोड' }, links: downloadsLinks },
  { key: 'gallery', label: { en: 'Gallery', ne: 'ग्यालरी' }, links: galleryLinks },
  { key: 'stats', label: { en: 'Statistics/Activity', ne: 'तथ्याङ्क/गतिविधि' }, links: statsLinks },
];
const focusable = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
export function PublicHeader() {
  const row = useContent().settings[0]; const { lang } = useLanguage(); const pathname = usePathname(); const router = useRouter();
  const [open, setOpen] = useState<string | null>(null); const [mobile, setMobile] = useState(false);
  const header = useRef<HTMLElement>(null); const mobilePanel = useRef<HTMLElement>(null); const toggle = useRef<HTMLButtonElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  useEffect(() => { setOpen(null); setMobile(false); }, [pathname]);
  useEffect(() => { if (!mobile) return; const before = document.body.style.overflow; document.body.style.overflow = 'hidden'; mobilePanel.current?.querySelector<HTMLElement>(focusable)?.focus(); return () => { document.body.style.overflow = before; }; }, [mobile]);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setOpen(null); };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { if (mobile) { setMobile(false); toggle.current?.focus(); } else if (open) { triggers.current[open]?.focus(); setOpen(null); } }
      if (event.key === 'Tab' && mobile) { const elements = [...(mobilePanel.current?.querySelectorAll<HTMLElement>(focusable) || [])].filter(el => el.getClientRects().length); const first = elements[0]; const last = elements.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } }
    };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', key); return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', key); };
  }, [mobile, open]);
  const closeMobile = () => { setMobile(false); toggle.current?.focus(); };
  useEffect(() => { const utility = document.querySelector('.utility-strip'); utility?.setAttribute('role', 'complementary'); utility?.setAttribute('aria-label', lang === 'ne' ? 'सम्पर्क तथा भाषा' : 'Contact and language'); }, [lang]);
  return <><a href="#main-content" className="skip-link"><L value={{ en: 'Skip to content', ne: 'मुख्य सामग्रीमा जानुहोस्' }} /></a><div className="utility-strip"><div className="container utility-inner"><span className="utility-motto"><span className="status-dot" /><L value={{ en: 'Together for transport workers', ne: 'यातायात श्रमिकका लागि एकजुट' }} /></span><div className="utility-contact">{row?.phone && <a href={`tel:${row.phone.replace(/[^+\d]/g, '')}`}><Phone size={12} />{row.phone}</a>}{row?.email && <a href={`mailto:${row.email}`}><Mail size={12} />{row.email}</a>}</div><LanguageSwitcher /></div></div>
  <header className="site-header" ref={header}><div className="container nav-inner"><Link href="/" aria-label="ANTWU home"><BrandLockup /></Link><nav className="main-nav" aria-label={lang === 'ne' ? 'मुख्य नेभिगेसन' : 'Main navigation'}><Link href="/" className={pathname === '/' ? 'active' : ''} aria-current={pathname === '/' ? 'page' : undefined}><L value={{ en: 'Home', ne: 'गृहपृष्ठ' }} /></Link>{desktopGroups.map(group => { const hasDropdown = group.links.length > 0; const isOpen = hasDropdown && open === group.key; return <div className={`nav-group ${isOpen ? 'is-open' : ''}`} key={group.key} onMouseEnter={() => { if (hasDropdown) setOpen(group.key); }} onMouseLeave={() => { if (hasDropdown) setOpen(null); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(null); }}><button ref={node => { triggers.current[group.key] = node; }} type="button" className={`nav-trigger ${(group.links.some(item => item.href === pathname) || (group.key === 'information' && pathname.startsWith('/documents'))) ? 'active' : ''}`} aria-expanded={isOpen} aria-controls={hasDropdown ? `nav-${group.key}` : undefined} onClick={() => { if (hasDropdown) setOpen(isOpen ? null : group.key); else if (group.key === 'information') router.push('/documents'); }} onKeyDown={event => { if (hasDropdown && event.key === 'ArrowDown') { event.preventDefault(); setOpen(group.key); requestAnimationFrame(() => document.getElementById(`nav-${group.key}`)?.querySelector('a')?.focus()); } }}><L value={group.label} />{hasDropdown && <ChevronDown size={13} />}</button>{isOpen && <div className="nav-dropdown" id={`nav-${group.key}`}>{group.links.map(item => <Link key={`${item.href}-${item.label.en}`} href={item.href} onClick={() => setOpen(null)} aria-current={pathname === item.href ? 'page' : undefined}><L value={item.label} /><ArrowRight size={13} /></Link>)}</div>}</div>; })}<Link href="/render_all_posts" className={pathname.includes('posts') || pathname.startsWith('/blog') ? 'active' : ''}><L value={{ en: 'Blog', ne: 'ब्लग' }} /></Link><Link href="/portal/contact_page" className={pathname.includes('contact') ? 'active' : ''}><L value={{ en: 'Contact', ne: 'सम्पर्क' }} /></Link></nav><div className="header-actions"><button type="button" className="menu-toggle" ref={toggle} aria-expanded={mobile} aria-controls="mobile-navigation" aria-label={lang === 'ne' ? 'नेभिगेसन खोल्नुहोस्' : 'Open navigation'} onClick={() => { setOpen(null); setMobile(true); }}><Menu size={23} /></button></div></div>
  {mobile && <nav ref={mobilePanel} id="mobile-navigation" className="mobile-nav" aria-label={lang === 'ne' ? 'मोबाइल नेभिगेसन' : 'Mobile navigation'}><div className="mobile-nav-top"><button className="icon-button" onClick={closeMobile} type="button" aria-label={lang === 'ne' ? 'नेभिगेसन बन्द गर्नुहोस्' : 'Close navigation'}><X size={22} /></button></div><Link href="/" onClick={closeMobile}><L value={{ en: 'Home', ne: 'गृहपृष्ठ' }} /></Link>{mobileGroups.map(group => <div className="mobile-nav-group" key={group.key}><button type="button" aria-expanded={open === group.key} onClick={() => setOpen(open === group.key ? null : group.key)}><L value={group.label} /><ChevronDown size={18} /></button>{open === group.key && <div className="mobile-nav-children">{group.links.map(item => <Link key={`${item.href}-${item.label.en}`} href={item.href} onClick={closeMobile}><L value={item.label} /></Link>)}</div>}</div>)}<Link href="/render_all_posts" onClick={closeMobile}><L value={{ en: 'Blog', ne: 'ब्लग' }} /></Link><Link href="/portal/contact_page" onClick={closeMobile}><L value={{ en: 'Contact', ne: 'सम्पर्क' }} /></Link></nav>}</header></>;
}
export function PublicFooter() {
  const row = useContent().settings[0]; const { lang } = useLanguage();
  return <footer className="footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Link href="/" aria-label="ANTWU home"><BrandLockup inverse /></Link>{row?.mission && <p><L value={row.mission} /></p>}<div className="footer-social">{row?.facebook && <a href={row.facebook} aria-label="Facebook"><Facebook size={18} /></a>}{row?.instagram && <a href={row.instagram} aria-label="Instagram"><Instagram size={18} /></a>}</div></div><div><h2><L value={{ en: 'The union', ne: 'संघ' }} /></h2><div className="footer-list"><Link href="/about"><L value={{ en: 'About ANTWU', ne: 'अन्तुको परिचय' }} /></Link><Link href="/committee"><L value={{ en: 'Our committee', ne: 'हाम्रो समिति' }} /></Link><Link href="/activities"><L value={{ en: 'Activities', ne: 'गतिविधि' }} /></Link><Link href="/membership"><L value={{ en: 'Membership', ne: 'सदस्यता' }} /></Link></div></div><div><h2><L value={{ en: 'Stay informed', ne: 'जानकारी लिनुहोस्' }} /></h2><div className="footer-list"><Link href="/updates"><L value={{ en: 'Updates & notices', ne: 'अपडेट र सूचना' }} /></Link><Link href="/documents"><L value={{ en: 'Documents', ne: 'कागजात' }} /></Link><Link href="/gallery"><L value={{ en: 'Photo & video gallery', ne: 'फोटो र भिडियो ग्यालरी' }} /></Link><Link href="/blog"><L value={{ en: 'Blog', ne: 'ब्लग' }} /></Link><Link href="/faq"><L value={{ en: 'FAQ', ne: 'बारम्बार सोधिने प्रश्नहरू' }} /></Link></div></div><div><h2><L value={{ en: 'Get in touch', ne: 'सम्पर्कमा रहनुहोस्' }} /></h2><address className="footer-contact">{row?.address && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.address.en)}`} target="_blank" rel="noreferrer"><MapPin size={16} /><span>{text(row.address, lang)}</span></a>}{row?.phone && <a href={`tel:${row.phone.replace(/[^+\d]/g, '')}`}><Phone size={16} /><span>{row.phone}</span></a>}{row?.email && <a href={`mailto:${row.email}`}><Mail size={16} /><span>{row.email}</span></a>}</address><Link href="/contact" className="footer-contact-link"><L value={{ en: 'Contact the office', ne: 'कार्यालयमा सम्पर्क गर्नुहोस्' }} /><ArrowRight size={16} /></Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ANTWU. <L value={{ en: 'All rights reserved.', ne: 'सर्वाधिकार सुरक्षित।' }} /></span><span lang="ne">अखिल नेपाल यातायात मजदुर संघ</span><nav className="footer-legal" aria-label={lang === 'ne' ? 'कानूनी पृष्ठहरू' : 'Legal pages'}><Link href="/privacy-policy"><L value={{ en: 'Privacy', ne: 'गोपनीयता' }} /></Link><Link href="/terms-and-conditions"><L value={{ en: 'Terms', ne: 'सर्तहरू' }} /></Link><Link href="/contact-us"><L value={{ en: 'Contact us', ne: 'सम्पर्क' }} /></Link></nav><a className="footer-credit" href="https://www.aashatech.com/" target="_blank" rel="noreferrer"><span><L value={{ en: 'Powered by', ne: 'द्वारा सञ्चालित' }} /></span><span className="footer-credit-logo"><Image src="/assets/aashatech-logo.png" alt="AashaTech" width={136} height={66} /></span></a><Link href="/admin/login"><L value={{ en: 'Office login', ne: 'कार्यालय लगइन' }} /></Link></div></div></footer>;
}
export function PublicShell({ children }: { children: React.ReactNode }) { return <><PublicHeader /><div id="main-content" tabIndex={-1}>{children}</div><PublicFooter /></>; }
