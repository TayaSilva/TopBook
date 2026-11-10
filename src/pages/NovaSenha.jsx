import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CardHeader, FooterLink, PrimaryButton, TransitionLink } from '../components/AuthShell.jsx'
import { FieldError, PasswordField } from '../components/TextField.jsx'

// Etapa 3 de 3: código verificado → nova senha → concluído.
export default function NovaSenha({ onReset }) {
  const { state } = useLocation()
  const [done, setDone] = useState(false)
  const [shown, setShown] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const a = f.elements.senha.value || ''
    const b = f.elements.senha2.value || ''
    const msg = a.length < 8 ? 'A nova senha precisa ter pelo menos 8 caracteres.' : a !== b ? 'As senhas não coincidem.' : ''
    if (msg) {
      setErr(msg)
      f.elements[a.length < 8 ? 'senha' : 'senha2'].focus()
      return
    }
    setErr('')
    await onReset?.({ email: state?.email, code: state?.code, senha: a })
    setDone(true)
  }

  if (done) {
    return (
      <>
        <CardHeader eyebrow="Concluído" title="Senha redefinida" titleClass="text-[34px] leading-[1.08] text-[#F3DDA0]" subtitle="Tudo certo! Agora é só entrar com a sua nova senha." />
        <div aria-hidden="true" className="flex h-16 w-16 items-center justify-center self-center rounded-full border border-gold/50 bg-gold/15 shadow-[0_0_24px_rgba(232,199,125,.35)]">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ffd27a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <TransitionLink
          to="/entrar"
          className="flex min-h-[52px] items-center justify-center rounded-full bg-green font-bold text-surface no-underline shadow-[0_10px_30px_rgba(47,103,78,.45)] transition hover:-translate-y-px hover:bg-green-hover hover:text-surface"
        >
          Voltar para o login
        </TransitionLink>
      </>
    )
  }

  const fieldFocus = 'focus:border-lavender! focus:shadow-[0_0_0_3px_rgba(201,181,240,.3)]!'

  return (
    <>
      <CardHeader eyebrow="Etapa 3 de 3" title="Crie uma nova senha" titleClass="text-[34px] leading-[1.08] text-[#F3DDA0]" subtitle="Agora escolha uma senha nova para voltar às suas leituras." />
      <form noValidate onSubmit={submit} className="flex flex-col gap-3.5">
        <div className="nv-badge flex items-center gap-3 rounded-2xl border border-gold/50 bg-[linear-gradient(135deg,rgba(47,103,78,.42),rgba(102,80,164,.34))] px-3.5 py-3 shadow-[0_0_26px_rgba(232,199,125,.2),inset_0_1px_0_rgba(255,255,255,.12)]" role="status">
          <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" className="flex-none">
            <defs>
              <linearGradient id="nvRing" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FFF1C7" />
                <stop offset=".5" stopColor="#E8C77D" />
                <stop offset="1" stopColor="#C9B5F0" />
              </linearGradient>
              <radialGradient id="nvFill" cx="50%" cy="40%" r="60%">
                <stop offset="0" stopColor="#5fa77a" />
                <stop offset="1" stopColor="#2F674E" />
              </radialGradient>
            </defs>
            <circle cx="24" cy="24" r="21" fill="url(#nvFill)" stroke="url(#nvRing)" strokeWidth="2.5" />
            <path className="nv-check" d="M15 24.5l6 6 12-13" fill="none" stroke="#FFF1C7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
          </svg>
          <div className="flex flex-col gap-0.5">
            <strong className="text-base text-[#A8E2BC]">Código verificado</strong>
            <span className="text-[13px] text-lilac-light">Sua identidade foi confirmada com sucesso.</span>
          </div>
        </div>

        <PasswordField
          id="es-pw"
          label="Nova senha"
          labelClass="text-green-soft"
          className={fieldFocus}
          name="senha"
          autoComplete="new-password"
          placeholder="Mínimo de 8 caracteres"
          shown={shown}
          onToggle={() => setShown((s) => !s)}
          aria-invalid={!!err || undefined}
          aria-describedby="es-pw-err"
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="es-pw2" className="text-sm font-medium text-green-soft">
            Confirmar nova senha
          </label>
          <PasswordConfirm shown={shown} invalid={!!err} className={fieldFocus} />
          <FieldError id="es-pw-err">{err}</FieldError>
        </div>
        <PrimaryButton
          type="submit"
          className="bg-[linear-gradient(135deg,#6650A4,#8a6ad0)]! shadow-[0_10px_30px_rgba(102,80,164,.45),inset_0_0_0_1px_rgba(232,199,125,.65)]! hover:bg-[linear-gradient(135deg,#513B8F,#7a5bc2)]!"
        >
          Redefinir senha
        </PrimaryButton>
      </form>
      <FooterLink text="Lembrou a senha?" to="/entrar" label="Entrar" />
    </>
  )
}

function PasswordConfirm({ shown, invalid, className }) {
  return (
    <input
      id="es-pw2"
      name="senha2"
      type={shown ? 'text' : 'password'}
      autoComplete="new-password"
      placeholder="Repita a nova senha"
      aria-invalid={invalid || undefined}
      aria-describedby="es-pw-err"
      className={`w-full min-h-12 rounded-input border border-white/28 bg-white/8 px-4 py-3 text-base text-surface placeholder:text-surface/55 outline-none transition aria-invalid:border-error ${className}`}
    />
  )
}
