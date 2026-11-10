import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFairy } from '../components/FairyProvider.jsx'
import MagicTrails from '../components/MagicTrails.jsx'
import { prefersReducedMotion } from '../lib/motion.js'

/*
 * Landing cinematográfica: uma sequência de vídeos controlada pela rolagem.
 * Cada vídeo ocupa uma janela [a, b] do progresso (0 → 1) e nunca toca sozinho:
 * o quadro exibido é calculado a partir da posição da rolagem.
 * O último quadro de um vídeo é idêntico ao primeiro do seguinte, então a troca é por corte.
 */
const VIDEOS = [
  { name: 'livro', a: 0, b: 0.16, show: [0, 0.16], label: 'Cena 1: o livro desperta' },
  { name: 't1', a: 0.16, b: 0.22, show: [0.16, 0.22] },
  { name: 'fantasia', a: 0.22, b: 0.3, show: [0.22, 0.3], label: 'Cena 2: fantasia' },
  { name: 't2', a: 0.3, b: 0.36, show: [0.3, 0.36] },
  { name: 'terror', a: 0.36, b: 0.44, show: [0.36, 0.44], label: 'Cena 3: terror' },
  { name: 't3', a: 0.44, b: 0.5, show: [0.44, 0.5] },
  { name: 'investigacao', a: 0.5, b: 0.6, show: [0.5, 0.6], label: 'Cena 4: investigação' },
  { name: 't4', a: 0.6, b: 0.66, show: [0.6, 0.66] },
  { name: 'romance', a: 0.66, b: 0.76, show: [0.66, 0.8], label: 'Cena 5: romance' },
  { name: 'livro-fecha', a: 0.79, b: 0.95, show: [0.76, 1.01], label: 'Cena 6: o livro se fecha' },
]

// Cor do texto e do halo acompanham cada universo: [início, cor, brilho, escurecimento].
const TEXT_COLORS = [
  [0, [247, 249, 244], [201, 181, 240], 0.45],
  [0.2, [235, 250, 238], [140, 230, 170], 0.5],
  [0.34, [255, 236, 232], [220, 40, 40], 0.6],
  [0.48, [232, 240, 255], [80, 140, 255], 0.6],
  [0.64, [255, 248, 240], [255, 150, 120], 0.55],
  [0.78, [247, 249, 244], [201, 181, 240], 0.5],
  [1, [247, 249, 244], [201, 181, 240], 0.5],
]

const FINAL_TITLE = 'Sua próxima história começa aqui.'

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const mix = (a, b, t) => a.map((v, i) => Math.round(lerp(v, b[i], t)))

function scrub(video, p) {
  const a = +video.dataset.a
  const b = +video.dataset.b
  if (p < a - 0.03 || p > b + 0.06) return
  const d = video.duration
  if (!d || !isFinite(d)) return
  const t = clamp((p - a) / (b - a)) * (d - 0.05)
  if (Math.abs(video.currentTime - t) > 0.02) {
    try {
      video.currentTime = t
    } catch {
      /* vídeo ainda carregando */
    }
  }
}

export default function Landing() {
  const navigate = useNavigate()
  const scroller = useRef(null)
  const raf = useRef(0)
  const pRef = useRef(0)
  const [p, setP] = useState(0)
  const startFairy = useFairy()
  const rm = prefersReducedMotion()

  const onScroll = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    const next = max > 0 ? el.scrollTop / max : 0
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      pRef.current = next
      el.querySelectorAll('video[data-a]').forEach((v) => scrub(v, next))
      setP(next)
    })
  }, [])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  // "Pular introdução": salta direto para a tela final, sem rolar os vídeos.
  const skip = (e) => {
    e.preventDefault()
    const el = scroller.current
    el.style.scrollBehavior = 'auto'
    el.scrollTop = el.scrollHeight - el.clientHeight
    el.style.scrollBehavior = ''
  }

  // A fada atravessa a tela e "puxa" a página de conta atrás dela; então navegamos.
  const fairyGo = (to, page) => (e) => {
    e.preventDefault()
    if (rm) return navigate(to)
    startFairy(to, page)
  }

  // ---------- valores derivados do progresso ----------
  const s = (a, b) => clamp((p - a) / (b - a))
  const inout = (a, b, c, d) => Math.min(s(a, b), 1 - s(c, d))
  const show = ([a, b]) => (p >= a && p < b ? 'visible' : 'hidden')
  const txt = (o) => ({
    opacity: o,
    transform: `translate(-50%, ${((1 - o) * 18).toFixed(1)}px)`,
    filter: `blur(${((1 - o) * 6).toFixed(1)}px)`,
    visibility: o > 0.005 ? 'visible' : 'hidden',
  })

  const closeReveal = easeInOut(s(0.765, 0.795))
  const fin = easeInOut(s(0.948, 0.988))
  const finIn = easeInOut(s(0.972, 0.995))
  const flash = s(0.74, 0.768) * (1 - s(0.775, 0.81))

  let k = 0
  while (k < TEXT_COLORS.length - 2 && p > TEXT_COLORS[k + 1][0]) k++
  const [A, B] = [TEXT_COLORS[k], TEXT_COLORS[k + 1]]
  const t0 = clamp((p - A[0]) / (B[0] - A[0]))
  const tt = t0 * t0 * (3 - 2 * t0)
  const textVars = {
    '--tb-tc': `rgb(${mix(A[1], B[1], tt).join(',')})`,
    '--tb-glow': `rgba(${mix(A[2], B[2], tt).join(',')},.55)`,
    '--tb-scrim': lerp(A[3], B[3], tt).toFixed(2),
  }

  const typed = rm ? FINAL_TITLE.length : Math.round(FINAL_TITLE.length * s(0.98, 0.999))

  const sceneStyle = (v) => {
    const st = { visibility: show(v.show) }
    if (v.name === 'livro-fecha') {
      st.filter = `blur(${rm ? 0 : (6 * fin).toFixed(2)}px) brightness(${(1 - 0.25 * fin).toFixed(3)})`
      if (closeReveal < 1) st.clipPath = `circle(${lerp(0, 150, closeReveal).toFixed(2)}% at 50% 30%)`
    }
    return st
  }

  const quote = 'font-display text-[clamp(28px,4vw,52px)] leading-[1.1]'
  const caption = 'text-base leading-normal'
  const capTitle = 'text-[13px] uppercase tracking-[.14em]'

  return (
    <div ref={scroller} onScroll={onScroll} className="relative h-screen overflow-x-hidden overflow-y-auto scroll-smooth bg-[#07060a] font-sans text-surface">
      <div className="relative h-[2400vh]">
        <div className="sticky top-0 h-screen overflow-hidden" style={textVars}>
          <h1 className="sr-only">TopBook — a rede social onde os livros viram conversas</h1>

          {/* Sequência de vídeos */}
          {VIDEOS.map((v) => (
            <section key={v.name} aria-label={v.label} aria-hidden={!v.label || undefined} className="tb-scene" style={sceneStyle(v)}>
              <video
                className="tb-vid"
                data-a={v.a}
                data-b={v.b}
                muted
                playsInline
                preload="auto"
                poster={`/videos/${v.name}-poster.webp`}
                aria-hidden="true"
                tabIndex={-1}
                onLoadedMetadata={(e) => scrub(e.currentTarget, pRef.current)}
              >
                <source media="(max-width: 760px)" src={`/videos/${v.name}-854.mp4`} type="video/mp4" />
                <source src={`/videos/${v.name}-1280.mp4`} type="video/mp4" />
              </video>
              {v.name === 'romance' && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[22%] aspect-square w-[90vmax] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
                  style={{
                    background: 'radial-gradient(circle, #fff8e4 0%, rgba(255,222,160,.85) 22%, rgba(255,190,140,.35) 45%, rgba(255,190,140,0) 70%)',
                    opacity: flash * (rm ? 0.5 : 1),
                  }}
                />
              )}
              {v.name === 'livro-fecha' && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(0,0,0,0)_50%,rgba(5,3,8,.5)_100%)]" />
              )}
            </section>
          ))}

          {/* Cena final */}
          <section aria-label="TopBook" className="tb-scene bg-[#efe6e4] text-ink" style={{ visibility: show([0.947, 1.01]), opacity: fin }}>
            <img src="/images/final-fundo.webp" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 block h-full w-full object-cover" style={rm ? undefined : { transform: `scale(${lerp(1.12, 1.02, fin).toFixed(3)})` }} />
            <img
              src="/images/final-petalas.webp"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 block h-full w-full object-cover"
              style={{ opacity: fin, transform: rm ? undefined : `translateY(${lerp(-8, 4, s(0.95, 1)).toFixed(2)}%) scale(1.1)` }}
            />
            <div className="relative box-border flex h-full flex-col items-center justify-center px-5 pb-[72px] pt-24" style={{ opacity: finIn, transform: `translateY(${((1 - finIn) * 30).toFixed(1)}px)` }}>
              <div className="tb-glass relative box-border flex w-full max-w-[680px] flex-col items-center gap-[18px] rounded-card px-[clamp(20px,4vw,52px)] py-[clamp(24px,4vw,44px)] text-center">
                <div className="tb-ring tb-ring-glow" aria-hidden="true" />
                <div className="tb-ring" aria-hidden="true" />
                <MagicTrails offset={112} />
                <img src="/images/logo-topbook.webp" alt="TopBook" className="block h-auto w-[min(340px,80%)]" />
                <h2 aria-label={FINAL_TITLE} className="m-0 font-display text-[clamp(34px,5vw,60px)] font-medium leading-[1.05] tracking-[-0.02em] text-ink [text-wrap:balance]">
                  <span aria-hidden="true">{FINAL_TITLE.slice(0, typed)}</span>
                  {!rm && p <= 0.999 && <span aria-hidden="true" className="tb-caret" />}
                  <span aria-hidden="true" className="text-transparent">
                    {FINAL_TITLE.slice(typed)}
                  </span>
                </h2>
                <p className="m-0 font-display text-[clamp(18px,2vw,22px)] italic text-purple">A rede social onde os livros viram conversas.</p>
                <p className="m-0 max-w-[520px] text-[17px] leading-[1.55] text-[#3e3a4d] [text-wrap:pretty]">
                  Descubra livros, participe de comunidades, encontre seu clube de leitura e compartilhe suas histórias.
                </p>
                <div className="mt-1.5 flex flex-wrap justify-center gap-3">
                  <a href="/cadastro" onClick={fairyGo('/cadastro', 'cadastro')} className="tb-cta inline-flex min-h-[52px] items-center rounded-full bg-green px-7 text-base font-bold text-surface no-underline hover:text-surface">
                    Criar minha conta
                  </a>
                  <a href="/entrar" onClick={fairyGo('/entrar', 'entrar')} className="tb-cta inline-flex min-h-[52px] items-center rounded-full border-[1.5px] border-purple bg-white/45 px-7 text-base font-bold text-purple no-underline hover:text-purple">
                    Já tenho conta
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Textos das cenas (HTML: acessíveis e indexáveis) */}
          <p className={`tb-txt top-[15%] ${quote}`} style={txt(1 - s(0.025, 0.045))}>
            E se cada página fosse uma porta para outro mundo?
          </p>
          <p aria-hidden="true" className="absolute bottom-[6%] left-1/2 m-0 -translate-x-1/2 text-[13px] uppercase tracking-[.2em] text-lavender" style={{ opacity: 1 - s(0.004, 0.02) }}>
            Role para abrir o livro
          </p>

          <p className={`tb-txt top-[15%] ${quote}`} style={txt(inout(0.225, 0.24, 0.285, 0.3))}>
            Existem histórias que nos fazem acreditar no impossível.
          </p>
          <div className="tb-txt bottom-[10%] flex flex-col items-center gap-2.5" style={txt(inout(0.235, 0.25, 0.29, 0.305))}>
            <p className="m-0 text-[13px] uppercase tracking-[.16em]">Comunidades e debates literários</p>
            <div className="flex flex-wrap justify-center gap-2 [text-shadow:none]">
              {['Fantasia', 'Ficção Científica', 'Teorias'].map((t) => (
                <span key={t} className="rounded-full border border-green-soft/40 bg-[rgba(15,35,29,.7)] px-3.5 py-2 text-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <p className={`tb-txt top-[15%] ${quote}`} style={txt(inout(0.365, 0.38, 0.425, 0.44))}>
            Algumas histórias fazem o coração acelerar.
          </p>
          <p className={`tb-txt bottom-[10%] ${caption}`} style={txt(inout(0.375, 0.39, 0.43, 0.445))}>
            <strong className={capTitle}>Clubes de leitura</strong>
            <br />
            Um livro, um grupo, uma conversa: interpretações e opiniões sobre a mesma história.
          </p>

          <p className={`tb-txt top-[15%] ${quote}`} style={txt(inout(0.505, 0.52, 0.585, 0.6))}>
            Algumas histórias guardam segredos.
          </p>
          <p className={`tb-txt bottom-[10%] ${caption}`} style={txt(inout(0.515, 0.53, 0.59, 0.605))}>
            <strong className={capTitle}>Anti-spoiler</strong>
            <br />
            Spoilers? Só quando você quiser. Aqui é possível classificar se o texto tem spoilers ou não.
          </p>

          <p className={`tb-txt top-[15%] ${quote}`} style={txt(inout(0.675, 0.69, 0.735, 0.75))}>
            E outras histórias fazem o mundo inteiro desaparecer.
          </p>
          <p className={`tb-txt bottom-[10%] ${caption}`} style={txt(inout(0.685, 0.7, 0.74, 0.755))}>
            <strong className={capTitle}>Sua estante</strong>
            <br />
            Guarde seus favoritos, avalie suas leituras e encontre quem ama as mesmas histórias.
          </p>

          <p className="tb-txt top-[13%] font-display text-[clamp(26px,3.6vw,46px)] leading-[1.12]" style={txt(inout(0.82, 0.835, 0.885, 0.9))}>
            Milhares de histórias. Infinitos sentimentos. Um lugar para compartilhar todos eles.
          </p>

          <a
            href="#topbook"
            onClick={skip}
            className="tb-skip absolute bottom-4 right-4 box-border inline-flex min-h-12 items-center gap-2 rounded-full border border-lavender/55 bg-[rgba(41,38,58,.78)] px-5 text-[15px] font-bold text-surface no-underline shadow-[0_8px_30px_rgba(0,0,0,.35)] backdrop-blur-[8px] transition-opacity hover:bg-[rgba(102,80,164,.9)] hover:text-white"
            style={p > 0.97 ? { opacity: 0, visibility: 'hidden', pointerEvents: 'none' } : undefined}
          >
            Pular introdução
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14" />
              <path d="M6 13l6 6 6-6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
