import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CardHeader, FooterLink, PrimaryButton, useAuthGo } from '../components/AuthShell.jsx'
import OtpInput from '../components/OtpInput.jsx'
import { FieldError } from '../components/TextField.jsx'

const textBtn = 'min-h-11 cursor-pointer rounded border-0 bg-transparent p-0 font-bold text-gold-ui hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-ui'

// Etapa 2 de 3: código de 6 dígitos enviado por e-mail.
export default function CodigoSenha({ onVerify, onResend }) {
  const go = useAuthGo()
  const email = useLocation().state?.email
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const [resent, setResent] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(code)) {
      setErr('Digite os 6 dígitos do código.')
      return
    }
    setErr('')
    const ok = (await onVerify?.(email, code)) ?? true
    if (!ok) return setErr('Código inválido. Confira o e-mail e tente de novo.')
    go('/esqueci-senha/nova-senha', { state: { email, code } })
  }

  return (
    <>
      <CardHeader
        eyebrow="Etapa 2 de 3"
        title="Confira seu e-mail"
        titleClass="text-[34px] leading-[1.08]"
        subtitle={`Enviamos um código de 6 dígitos para ${email || 'o seu e-mail'}. Digite-o abaixo.`}
      />
      <form noValidate onSubmit={submit} className="flex flex-col gap-3.5">
        <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
          <legend className="mb-2.5 p-0 text-sm font-medium">Código de verificação</legend>
          <OtpInput
            value={code}
            invalid={!!err}
            onChange={(v) => {
              setCode(v)
              if (err) setErr('')
            }}
          />
          <FieldError>{err}</FieldError>
        </fieldset>
        <PrimaryButton type="submit">Verificar código</PrimaryButton>
        <div className="flex flex-wrap justify-between gap-3 text-sm">
          <button
            type="button"
            className={textBtn}
            onClick={() => {
              setResent(true)
              onResend?.(email)
            }}
          >
            {resent ? 'Código reenviado' : 'Reenviar código'}
          </button>
          <button type="button" className={textBtn} onClick={() => go('/esqueci-senha', { state: { email } })}>
            Trocar e-mail
          </button>
        </div>
      </form>
      <FooterLink text="Lembrou a senha?" to="/entrar" label="Entrar" />
    </>
  )
}
