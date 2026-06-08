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
        className="absolute inset-0 bg-[#020611]/70 backdrop-blur-sm animate-fade-scale"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full max-w-lg',
          'bg-[#111827] border border-[#1E3A5F] rounded-2xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(14,165,233,0.08)]',
          'max-h-[90vh] flex flex-col',
          'animate-fade-in',
          className
        )}
      >
        {/* Cyan top accent line */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[rgba(0,212,255,0.45)] to-transparent rounded-full" />

        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3A5F] shrink-0">
            <h2 className="text-base font-semibold text-[#F1F5F9]">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#1E293B] text-[#64748B] hover:text-[#F1F5F9] transition-colors"
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
