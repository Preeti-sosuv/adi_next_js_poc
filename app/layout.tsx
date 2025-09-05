import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'ADI Next.js POC',
  description: 'Next.js Proof of Concept with Redux',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}