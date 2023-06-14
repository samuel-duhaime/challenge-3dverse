import '@/styles/global.css';

import FilesProvider from '@/components/providers/FilesProvider';

export const metadata = {
  title: '3dverse Test',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): JSX.Element | null {
  return (
    <html data-theme="winter" lang="en">
      <body>
        <FilesProvider>
          <div className="container mx-auto my-8 max-w-3xl text-center">{children}</div>
        </FilesProvider>
      </body>
    </html>
  );
}
