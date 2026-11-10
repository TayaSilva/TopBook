import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import BackgroundCycle from './BackgroundCycle.jsx'
import GlassCard from './GlassCard.jsx'
import { prefersReducedMotion } from '../lib/motion.js'

const GoContext = createContext(() => {})

/** Navega com a transição do cartão (sai subindo com desfoque e a próxima tela entra de baixo). */
export const useAuthGo = () => useContext(GoContext)

export const linkFocus = 'rounded focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-ui'

export function TransitionLink({ to, state, className = '', children, ...props }) {
  const go = useAuthGo()
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault()
        go(to, { state })
      }}
      className={`${linkFocus} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}

/**
 * Moldura das telas de conta: fundo em ciclo, logo e cartão de vidro.
 * `preview` desliga a navegação (usado dentro da transição da fada na landing).
 */
export function AuthShell({ children, preview = false }) {
  const navigate = useNavigate()
  const { pathname, state } = useLocation()
  const instant = preview || !!state?.instant
  const [leaving, setLeaving] = useState(false)

  useEffect(() => setLeaving(false), [pathname])

  const go = useCallback(
    (to, opts) => {
      if (preview) return
      if (prefersReducedMotion()) return navigate(to, opts)
      setLeaving(true)
      setTimeout(() => navigate(to, opts), 380)
    },
    [navigate, preview],
  )

  return (
    <GoContext.Provider value={go}>
      <div className="relative min-h-screen overflow-hidden bg-night font-sans text-surface">
        <BackgroundCycle />

        <TransitionLink to="/" aria-label="TopBook, voltar para a página inicial" className="absolute left-6 top-5 z-[2] flex min-h-11 items-center">
          <img src="/images/logo-topbook.webp" alt="TopBook" className="block h-12 w-auto" />
        </TransitionLink>

        <main className="relative z-[1] box-border flex min-h-screen items-center justify-center px-4 pb-8 pt-24 min-[861px]:justify-end min-[861px]:px-[clamp(16px,7vw,120px)] min-[861px]:pt-8">
          <GlassCard key={preview ? 'preview' : pathname} leaving={leaving} instant={instant}>
            {children}
          </GlassCard>
        </main>
      </div>
    </GoContext.Provider>
  )
}

/** Rota-layout: o fundo continua rodando enquanto só o cartão troca. */
export function AuthLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  )
}

export function CardHeader({ eyebrow, title, subtitle, titleClass = 'text-[38px] leading-[1.05]' }) {
  return (
    <div className="flex flex-col gap-1.5">
      {eyebrow && <p className="m-0 text-xs uppercase tracking-[.16em] text-gold-ui">{eyebrow}</p>}
      <h1 className={`m-0 font-display font-medium tracking-[-0.01em] ${titleClass}`}>{title}</h1>
      {subtitle && <p className="m-0 text-base leading-normal text-surface/78">{subtitle}</p>}
    </div>
  )
}

export function PrimaryButton({ className = '', children, ...props }) {
  return (
    <button
      className={`min-h-[52px] cursor-pointer rounded-full border-0 bg-green text-base font-bold text-surface shadow-[0_10px_30px_rgba(47,103,78,.45)] transition hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_14px_34px_rgba(47,103,78,.55)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-ui ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function FooterLink({ text, to, label }) {
  return (
    <p className="m-0 text-center text-[15px] text-surface/80">
      {text}{' '}
      <TransitionLink to={to} className="font-bold text-gold-ui no-underline hover:text-white">
        {label}
      </TransitionLink>
    </p>
  )
}
