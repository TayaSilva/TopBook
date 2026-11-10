import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell.jsx'
import Cadastro from '../pages/Cadastro.jsx'
import Entrar from '../pages/Entrar.jsx'

export const FAIRY_MS = 4000
// Tempo extra em que a cópia continua na tela depois de navegar, até a página real estar pintada.
const HANDOFF_MS = 500

const FairyContext = createContext(() => {})
export const useFairy = () => useContext(FairyContext)

/**
 * A transição da fada vive acima das rotas: a cópia (preview) só é removida
 * depois que a página real já montou e pintou por baixo dela.
 */
export function FairyProvider({ children }) {
  const navigate = useNavigate()
  const [fairy, setFairy] = useState(null) // 'cadastro' | 'entrar' | null
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const start = useCallback(
    (to, page) => {
      setFairy(page)
      timers.current.push(
        setTimeout(() => {
          navigate(to, { state: { instant: true } })
          timers.current.push(setTimeout(() => setFairy(null), HANDOFF_MS))
        }, FAIRY_MS),
      )
    },
    [navigate],
  )

  return (
    <FairyContext.Provider value={start}>
      {children}
      {fairy && (
        <div aria-hidden="true" className="fixed inset-0 z-[60] overflow-hidden">
          <div className="tb-pull absolute inset-0 overflow-hidden bg-night">
            <div className="pointer-events-none">
              <AuthShell preview>{fairy === 'cadastro' ? <Cadastro /> : <Entrar />}</AuthShell>
            </div>
          </div>
          <div className="tb-pull-edge absolute inset-0" />
          <div className="tb-fairy absolute left-0 top-0 aspect-[1536/1024] w-[min(640px,54vw)]">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <img key={n} className="tb-flap" src={`/images/fada-${n}.webp`} alt="" style={{ animationName: `tb-f${n}` }} />
            ))}
          </div>
        </div>
      )}
    </FairyContext.Provider>
  )
}
