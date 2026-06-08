import type { Metadata } from 'next'
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Borderless Tech Academy',
  description: 'DevOps Training School — Your laptop is your visa.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
