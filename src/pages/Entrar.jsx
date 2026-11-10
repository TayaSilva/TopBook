import { CardHeader, FooterLink, PrimaryButton, TransitionLink } from '../components/AuthShell.jsx'
import FlowerCheckbox from '../components/FlowerCheckbox.jsx'
import { PasswordField, TextField } from '../components/TextField.jsx'

export default function Entrar({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    onLogin?.({ email: data.email, senha: data.senha, lembrar: data.lembrar === 'on' })
  }

  return (
    <>
      <CardHeader title="Entrar" subtitle="Que bom ver você de novo. Sua estante está esperando." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <TextField id="au-email" label="E-mail" type="email" name="email" autoComplete="email" placeholder="voce@email.com" required />
        <PasswordField
          id="au-senha"
          label="Senha"
          name="senha"
          autoComplete="current-password"
          placeholder="Sua senha"
          required
          aside={
            <TransitionLink to="/esqueci-senha" className="text-[13px] text-gold-ui no-underline hover:text-white">
              Esqueci minha senha
            </TransitionLink>
          }
        />
        <FlowerCheckbox id="au-lembrar" name="lembrar" label="Lembrar de mim" />
        <PrimaryButton type="submit" className="mt-1">
          Entrar
        </PrimaryButton>
      </form>

      <FooterLink text="Ainda não tem conta?" to="/cadastro" label="Criar conta" />
    </>
  )
}
