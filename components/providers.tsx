'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(17,24,39,0.85)',
            backdropFilter: 'blur(14px)',
            color: '#F1F5F9',
            border: '1px solid #1E3A5F',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          },
          success: { iconTheme: { primary: '#00D4FF', secondary: '#0A0F1E' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#0A0F1E' } },
        }}
      />
    </SessionProvider>
  )
}
