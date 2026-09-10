'use client';

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string; delay?: number }) {
  // Content should remain available immediately. The hero owns the entrance
  // choreography; these wrappers preserve the existing component API without
  // forcing a repeated fade-and-slide on every section.
  return <div className={`reveal ${className}`}>{children}</div>;
}

export function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  // Keep the real value in the DOM immediately. Count-up can be reintroduced
  // after the data layer is live, but it should never make impact numbers
  // unreadable while a section is entering the viewport.
  return <span>{value}{suffix}</span>;
}

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = '' }: SkeletonProps) {
  return <span className={`skeleton ${className}`} aria-hidden="true" />;
}

export function PublicLoading() {
  return <main className="route-loading" aria-busy="true">
    <p className="motion-sr-only" role="status" aria-live="polite">Loading ANTWU content</p>
    <section className="route-loading-hero"><div className="container route-loading-grid">
      <div className="route-loading-copy"><Skeleton className="skeleton-kicker" /><Skeleton className="skeleton-title" /><Skeleton className="skeleton-title skeleton-title-short" /><Skeleton className="skeleton-copy" /><div className="route-loading-actions"><Skeleton className="skeleton-button" /><Skeleton className="skeleton-button skeleton-button-outline" /></div></div>
      <div className="route-loading-visual"><Skeleton className="skeleton-image" /><Skeleton className="skeleton-rail" /></div>
    </div></section>
    <section className="section route-loading-section"><div className="container"><Skeleton className="skeleton-section-kicker" /><Skeleton className="skeleton-section-title" /><div className="route-loading-cards"><Skeleton className="skeleton-card" /><Skeleton className="skeleton-card" /><Skeleton className="skeleton-card" /></div></div></section>
  </main>;
}
