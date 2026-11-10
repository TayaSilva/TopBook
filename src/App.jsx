import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from './components/AuthShell.jsx'
import { FairyProvider } from './components/FairyProvider.jsx'
import Landing from './pages/Landing.jsx'
import Entrar from './pages/Entrar.jsx'
import Cadastro from './pages/Cadastro.jsx'
import EsqueciSenha from './pages/EsqueciSenha.jsx'
import CodigoSenha from './pages/CodigoSenha.jsx'
import NovaSenha from './pages/NovaSenha.jsx'

// Para ligar ao seu backend, passe os callbacks nas páginas:
// <Entrar onLogin={...} />, <Cadastro onSignup={...} />, <EsqueciSenha onRequestCode={...} />,
// <CodigoSenha onVerify={...} onResend={...} />, <NovaSenha onReset={...} />
export default function App() {
  return (
    <FairyProvider>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AuthLayout />}>
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/esqueci-senha/codigo" element={<CodigoSenha />} />
        <Route path="/esqueci-senha/nova-senha" element={<NovaSenha />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </FairyProvider>
  )
}
