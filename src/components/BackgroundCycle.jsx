import { useMemo } from 'react'

// Ordem: dia → tarde → noite → madrugada → amanhecendo → dia...
const SCENES = [
  '/images/bg-dia.webp',
  '/images/bg-tarde.webp',
  '/images/bg-noite.webp',
  '/images/bg-madrugada.webp',
  '/images/bg-amanhecendo.webp',
]
const SLOT = 16 // segundos por cena (10s visível + dissolução)
const TOTAL = SCENES.length * SLOT

export default function BackgroundCycle() {
  // Fase pelo relógio: todas as telas mostram a mesma cena, sem recomeçar ao navegar.
  const phase = useMemo(() => (Date.now() / 1000) % TOTAL, [])

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {SCENES.map((src, k) => {
        const delay = `${(k * SLOT - 6 - phase).toFixed(2)}s`
        return (
          <img
            key={src}
            src={src}
            alt=""
            className="au-bg"
            style={{
              animation: `au-cycle ${TOTAL}s linear infinite, au-kb ${TOTAL}s ease-in-out infinite`,
              animationDelay: `${delay}, ${delay}`,
            }}
          />
        )
      })}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,9,18,.1)_0%,rgba(11,9,18,.15)_45%,rgba(11,9,18,.55)_100%)]" />
    </div>
  )
}
