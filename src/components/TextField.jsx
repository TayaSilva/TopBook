import { forwardRef, useState } from 'react'

export const inputClass =
  'w-full min-h-12 rounded-input border border-white/28 bg-white/8 px-4 py-3 text-base text-surface placeholder:text-surface/55 outline-none transition focus:border-gold-ui focus:bg-white/12 focus:shadow-[0_0_0_3px_rgba(255,210,122,.22)] aria-invalid:border-error aria-invalid:shadow-[0_0_0_3px_rgba(255,180,171,.18)]'

function FieldLabel({ id, label, aside, labelClass = '' }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <label htmlFor={id} className={`text-sm font-medium ${labelClass}`}>
        {label}
      </label>
      {aside}
    </div>
  )
}

export function FieldError({ id, children }) {
  return (
    <p id={id} className="m-0 min-h-[18px] text-[13px] text-error" aria-live="polite">
      {children}
    </p>
  )
}

export const TextField = forwardRef(function TextField({ id, label, aside, labelClass, className = '', ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel id={id} label={label} aside={aside} labelClass={labelClass} />
      <input ref={ref} id={id} className={`${inputClass} ${className}`} {...props} />
    </div>
  )
})

/** Campo de senha com botão Mostrar/Ocultar. Passe `shown`/`onToggle` para controlar de fora. */
export function PasswordField({ id, label, aside, labelClass, className = '', shown: shownProp, onToggle, ...props }) {
  const [own, setOwn] = useState(false)
  const shown = shownProp ?? own
  const toggle = onToggle ?? (() => setOwn((s) => !s))
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel id={id} label={label} aside={aside} labelClass={labelClass} />
      <div className="relative">
        <input id={id} type={shown ? 'text' : 'password'} className={`${inputClass} pr-[92px] ${className}`} {...props} />
        <button
          type="button"
          onClick={toggle}
          aria-controls={id}
          aria-pressed={shown}
          className="absolute right-1 top-0.5 min-h-11 cursor-pointer rounded-full border-0 bg-transparent px-3.5 text-sm font-bold text-lavender focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-ui"
        >
          {shown ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    </div>
  )
}
