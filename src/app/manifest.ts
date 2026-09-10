import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'All Nepal Transport Workers’ Union',
    short_name: 'ANTWU',
    description: 'The official website of the All Nepal Transport Workers’ Union.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f4ec',
    theme_color: '#121f20',
    lang: 'en-NP',
    icons: [{ src: '/icon.png', sizes: '64x64', type: 'image/png', purpose: 'maskable' }, { src: '/apple-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any' }],
  };
}
