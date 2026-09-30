import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Undangan Pernikahan Digital',
  description: 'Spesial Undangan Pernikahan Digital 3D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased selection:bg-[#B39365] selection:text-white">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
