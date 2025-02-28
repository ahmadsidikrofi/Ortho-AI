import "./globals.css";
import { Quicksand, Inter } from 'next/font/google'
import { ThemeProvider } from "../components/ui/theme-provider";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider enableSystem attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
