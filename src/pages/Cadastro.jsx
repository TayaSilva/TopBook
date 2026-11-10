import { CardHeader, FooterLink, PrimaryButton } from '../components/AuthShell.jsx'
import FlowerCheckbox from '../components/FlowerCheckbox.jsx'
import { PasswordField, TextField } from '../components/TextField.jsx'

const termLink = 'rounded text-gold-ui hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-ui'

export default function Cadastro({ onSignup }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    onSignup?.({ nome: data.nome, email: data.email, senha: data.senha })
  }

  return (
    <>
      <CardHeader title="Criar conta" subtitle="Sua próxima história começa aqui." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <TextField id="au-nome" label="Nome" type="text" name="nome" autoComplete="name" placeholder="Como você quer ser chamado" required />
        <TextField id="au-email" label="E-mail" type="email" name="email" autoComplete="email" placeholder="voce@email.com" required />
        <PasswordField id="au-senha" label="Senha" name="senha" autoComplete="new-password" placeholder="Crie uma senha" required />
        <FlowerCheckbox
          id="au-termos"
          name="termos"
          required
          align="start"
          label={
            <>
              Li e aceito os <a href="#" className={termLink}>Termos</a>, a <a href="#" className={termLink}>Política de Privacidade</a> e as{' '}
              <a href="#" className={termLink}>Diretrizes</a> do TopBook.
            </>
          }
        />
        <PrimaryButton type="submit" className="mt-1">
          Criar minha conta
        </PrimaryButton>
      </form>

      <FooterLink text="Já tem conta?" to="/entrar" label="Entrar" />
    </>
  )
}
