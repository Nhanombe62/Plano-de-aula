import './globals.css'

export const metadata = {
  title: 'Portal de Permuta - Moçambique',
  description: 'Sistema Nacional de Trocas de Posto de Trabalho para Professores',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-MZ">
      <body>{children}</body>
    </html>
  )
}
