import Image from 'next/image';
export function LogoMark() { return <span className="logo-mark"><Image src="/assets/official/logo.png" alt="ANTWU official emblem" width={76} height={76} priority /></span>; }
export function BrandLockup({ inverse = false }: { inverse?: boolean }) { return <div className={`brand-lockup ${inverse ? 'inverse' : ''}`}><LogoMark /><span className="brand-text"><span className="brand-name">ANTWU<span className="brand-dot">.</span></span><span className="brand-sub" lang="ne">अखिल नेपाल यातायात मजदुर संघ</span></span></div>; }
