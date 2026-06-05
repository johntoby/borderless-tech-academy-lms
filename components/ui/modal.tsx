'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-scale"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full max-w-lg',
          'bg-[#111116] border border-[#1D1D26] rounded-2xl shadow-2xl shadow-black/70',
          'max-h-[90vh] flex flex-col',
          'animate-fade-in',
          className
        )}
      >
        {/* Gold top accent line */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[rgba(212,168,83,0.4)] to-transparent rounded-full" />

        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1D1D26] shrink-0">
            <h2 className="text-base font-semibold text-[#DDDDE8]">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#17171D] text-[#45455A] hover:text-[#9090A8] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto scrollbar-thin">{children}</div>
      </div>
    </div>
  )
}
