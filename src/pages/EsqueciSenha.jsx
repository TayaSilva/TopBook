import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CardHeader, FooterLink, PrimaryButton, useAuthGo } from '../components/AuthShell.jsx'
import { FieldError, TextField } from '../components/TextField.jsx'
import { isEmail } from '../lib/motion.js'

// Etapa 1 de 3: pede o e-mail e envia o código de 6 dígitos.
export default function EsqueciSenha({ onRequestCode }) {
  const go = useAuthGo()
  const { state } = useLocation()
  const [err, setErr] = useState('')
  const ref = useRef(null)

  const submit = async (e) => {
    e.preventDefault()
    const v = (ref.current?.value || '').trim()
    const msg = !v ? 'Informe o e-mail da sua conta.' : isEmail(v) ? '' : 'Digite um e-mail válido, como voce@email.com.'
    if (msg) {
      setErr(msg)
      ref.current?.focus()
      return
    }
    setErr('')
    await onRequestCode?.(v)
    go('/esqueci-senha/codigo', { state: { email: v } })
  }

  return (
    <>
      <CardHeader
        eyebrow="Etapa 1 de 3"
        title="Esqueci minha senha"
        titleClass="text-[34px] leading-[1.08]"
        subtitle="Informe o e-mail da sua conta e enviaremos um código de 6 dígitos para você redefinir a senha."
      />
      <form noValidate onSubmit={submit} className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <TextField
            ref={ref}
            id="es-email"
            label="E-mail da conta"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="voce@email.com"
            defaultValue={state?.email || ''}
            aria-invalid={!!err || undefined}
            aria-describedby="es-email-err"
            onChange={() => err && setErr('')}
          />
          <FieldError id="es-email-err">{err}</FieldError>
        </div>
        <PrimaryButton type="submit">Enviar código</PrimaryButton>
      </form>
      <FooterLink text="Lembrou a senha?" to="/entrar" label="Entrar" />
    </>
  )
}
