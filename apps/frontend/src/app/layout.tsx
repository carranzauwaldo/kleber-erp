import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KLEBER ERP',
  description: 'ERP modular para gestión de transportes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
