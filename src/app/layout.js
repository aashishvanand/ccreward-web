import './globals.css'
import { Inter } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ThemeRegistry from '../components/ThemeRegistry';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}