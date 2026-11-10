import { useRef } from 'react'
import { inputClass } from './TextField.jsx'

/** 6 caixas para o código, com dígitos dourados. Aceita colar o código inteiro. */
export default function OtpInput({ value, onChange, invalid }) {
  const refs = useRef([])
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '')

  const setAt = (i, d) => {
    const next = [...digits]
    next[i] = d
    onChange(next.join(''))
  }

  return (
    <div className="grid grid-cols-6 gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Dígito ${i + 1} de 6`}
          aria-invalid={invalid || undefined}
          className={`${inputClass} h-[58px] p-0! text-center font-display text-[26px] font-semibold text-gold-ui! caret-gold-ui [text-shadow:0_0_10px_rgba(255,210,122,.55)]`}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(-1)
            setAt(i, v)
            if (v) refs.current[i + 1]?.focus()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !d && i > 0) {
              e.preventDefault()
              setAt(i - 1, '')
              refs.current[i - 1]?.focus()
            }
            if (e.key === 'ArrowLeft') refs.current[i - 1]?.focus()
            if (e.key === 'ArrowRight') refs.current[i + 1]?.focus()
          }}
          onPaste={(e) => {
            const p = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6)
            if (!p) return
            e.preventDefault()
            onChange(p)
            refs.current[Math.min(p.length, 5)]?.focus()
          }}
        />
      ))}
    </div>
  )
}
