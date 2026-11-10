import MagicTrails from './MagicTrails.jsx'

// Cartão de vidro escuro com borda dourada luminosa e rastros de magia.
export default function GlassCard({ leaving = false, instant = false, children }) {
  const anim = leaving ? 'animate-card-out pointer-events-none' : instant ? '' : 'animate-card-in'
  return (
    <div className={`relative w-full max-w-[460px] rounded-card ${anim}`}>
      <div className="au-ring au-glow" aria-hidden="true" />
      <div className="au-ring" aria-hidden="true" />
      <MagicTrails />
      <div className="relative flex flex-col gap-5 rounded-card border border-[rgba(255,214,120,.18)] bg-[linear-gradient(140deg,rgba(40,30,58,.74),rgba(16,12,24,.62))] p-[clamp(26px,4vw,40px)] shadow-[0_30px_80px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-[24px] backdrop-saturate-150">
        {children}
      </div>
    </div>
  )
}
