'use client';

import Link from 'next/link';

export default function GlobalError() {
  return <html lang="en"><body style={{ margin: 0, background: '#121f20', color: '#f7f4ec', fontFamily: 'Arial, sans-serif' }}><main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '32px', textAlign: 'center' }}><div style={{ maxWidth: '560px' }}><p style={{ color: '#f08b99', fontSize: '12px', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' }}>ANTWU · 500</p><h1 style={{ margin: '18px 0', fontSize: 'clamp(42px, 8vw, 84px)', lineHeight: .95 }}>We’re temporarily offline.</h1><p style={{ color: '#c3d0cc', fontSize: '16px', lineHeight: 1.7 }}>The website encountered an unexpected error. Please refresh the page or try again shortly.</p><Link href="/" style={{ display: 'inline-flex', marginTop: '24px', padding: '13px 18px', color: '#fff', background: '#c8102e', textDecoration: 'none', fontWeight: 700 }}>Return home →</Link></div></main></body></html>;
}
