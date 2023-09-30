import './globals.css'
import { Montserrat } from 'next/font/google'

export const metadata = {
  title: 'Key Performance',
  description: 'Metrics for your business',
}

const montserratFont = Montserrat({ subsets: ['latin'] })
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserratFont.className}>{children}</body>
    </html>
  )
}
