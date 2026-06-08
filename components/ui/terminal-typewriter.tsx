'use client'

import { useEffect, useState } from 'react'

interface TerminalTypewriterProps {
  lines: string[]
  className?: string
  speed?: number
}

export function TerminalTypewriter({ lines, className, speed = 45 }: TerminalTypewriterProps) {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (lineIndex >= lines.length) { setDone(true); return }
    const current = lines[lineIndex]
    if (charIndex < current.length) {
      const t = setTimeout(() => setCharIndex(c => c + 1), speed)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => { setLineIndex(l => l + 1); setCharIndex(0) }, 480)
    return () => clearTimeout(t)
  }, [lineIndex, charIndex, lines, speed])

  return (
    <div className={className} style={{ fontFamily: 'var(--font-mono)' }}>
      {lines.slice(0, lineIndex).map((line, i) => (
        <p key={i} className="leading-relaxed">
          <span className="text-[#00D4FF]">$</span> {line}
        </p>
      ))}
      {!done && (
        <p className="leading-relaxed">
          <span className="text-[#00D4FF]">$</span> {lines[lineIndex]?.slice(0, charIndex)}
          <span className="inline-block w-[7px] h-[1em] -mb-[2px] ml-0.5 bg-[#00D4FF] animate-pulse" />
        </p>
      )}
    </div>
  )
}
