'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ContentData } from '@/lib/content-types';

const ContentContext = createContext<ContentData | null>(null);
export function ContentProvider({ initial, children }: { initial: ContentData; children: React.ReactNode }) {
  const [content, setContent] = useState(initial);
  useEffect(() => { setContent(initial); }, [initial]);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => { fetch('/api/content', { cache: 'no-store', signal: controller.signal }).then((response) => response.ok ? response.json() : null).then((data: ContentData | null) => { if (data) setContent(data); }).catch(() => {}); };
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('focus', refresh); controller.abort(); };
  }, []);
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
export function useContent(): ContentData {
  const context = useContext(ContentContext);
  if (!context) throw new Error('ContentProvider is required.');
  return context;
}
