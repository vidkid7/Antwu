'use client';
import { createContext, Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Language, Localized } from '@/lib/types';
const LanguageContext = createContext<{ lang: Language; setLang: (lang: Language) => void }>({ lang: 'en', setLang: () => undefined });
function QueryLanguage({ change }: { change: (lang: Language) => void }) { const search = useSearchParams(); const next = search.get('change_language'); useEffect(() => { if (next === 'en' || next === 'ne') change(next); }, [next, change]); return null; }
export function LanguageProvider({ children, initialLang = 'en' }: { children: React.ReactNode; initialLang?: Language }) {
  const [lang, setState] = useState<Language>(initialLang);
  const setLang = useCallback((next: Language) => { setState(next); document.cookie = `antwu-language=${next}; Path=/; Max-Age=31536000; SameSite=Lax`; try { localStorage.setItem('antwu-language', next); } catch {} }, []);
  useEffect(() => { try { const saved = localStorage.getItem('antwu-language'); if (saved === 'en' || saved === 'ne') setState(saved); } catch {} }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LanguageContext.Provider value={value}><Suspense fallback={null}><QueryLanguage change={setLang} /></Suspense>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }
export function L({ value, className = '' }: { value: Localized; className?: string }) { const { lang } = useLanguage(); return <span className={`${lang === 'ne' ? 'nepali' : ''} ${className}`.trim()} lang={lang}>{value[lang] || value.en}</span>; }
export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage(); const router = useRouter();
  const change = (next: Language) => { setLang(next); const url = new URL(window.location.href); url.searchParams.set('change_language', next); router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false }); };
  return <div className="language-switcher" role="group" aria-label="Language / भाषा"><button type="button" onClick={() => change('en')} aria-pressed={lang === 'en'} className={lang === 'en' ? 'active' : ''}>EN</button><span aria-hidden="true">/</span><button type="button" onClick={() => change('ne')} aria-pressed={lang === 'ne'} className={lang === 'ne' ? 'active' : ''}>नेपाली</button></div>;
}
