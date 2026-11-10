import { useId } from 'react'

const PATH_L = 'M132 676 C 40 610, 118 500, 58 400 S 8 210, 70 120 S 126 40, 128 22'
const PATH_R = 'M-2 24 C 110 80, 22 200, 76 300 S 124 470, 60 570 S 4 650, 4 690'
const SPARK = 'M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z'

function Mover({ pathId, dur, begin = '0s', splines, children }) {
  return (
    <animateMotion dur={dur} begin={begin} repeatCount="indefinite" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines={splines}>
      <mpath href={`#${pathId}`} />
      {children}
    </animateMotion>
  )
}

// Dois fluxos de luz dourada: um sobe pela esquerda, outro desce pela direita e vira partículas.
export default function MagicTrails({ offset }) {
  const left = offset ?? 104
  const right = offset ?? 96
  const id = useId().replace(/:/g, '')
  const gL = `${id}gL`, gR = `${id}gR`, glow = `${id}glow`, pL = `${id}pL`, pR = `${id}pR`
  const sL = '.45 0 .35 1', sR = '.4 0 .3 1'

  return (
    <>
      <svg className="tb-mt" aria-hidden="true" viewBox="0 0 130 700" preserveAspectRatio="none" style={{ left: -left }}>
        <defs>
          <linearGradient id={gL} x1="0" y1="700" x2="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#E8C77D" stopOpacity=".2" />
            <stop offset=".2" stopColor="#E8C77D" stopOpacity=".95" />
            <stop offset=".75" stopColor="#FFF1C7" stopOpacity=".75" />
            <stop offset="1" stopColor="#FFF1C7" stopOpacity="0" />
          </linearGradient>
          <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path id={pL} d={PATH_L} />
        </defs>
        <path d={PATH_L} fill="none" stroke={`url(#${gL})`} strokeWidth="1.8" strokeLinecap="round" pathLength="1000" strokeDasharray="190 1000" filter={`url(#${glow})`}>
          <animate attributeName="stroke-dashoffset" values="1000;-190" dur="5.4s" repeatCount="indefinite" calcMode="spline" keySplines={sL} />
        </path>
        <g filter={`url(#${glow})`}>
          <circle r="2.8" fill="#FFF1C7">
            <Mover pathId={pL} dur="5.4s" splines={sL} />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.82;1" dur="5.4s" repeatCount="indefinite" />
          </circle>
          <circle r="1.7" fill="#E8C77D">
            <Mover pathId={pL} dur="5.4s" begin="-.25s" splines={sL} />
            <animate attributeName="opacity" values="0;.9;.5;0" keyTimes="0;.2;.75;1" dur="5.4s" begin="-.25s" repeatCount="indefinite" />
          </circle>
          <circle className="tb-mt-x" r="1.1" fill="#FFF1C7">
            <Mover pathId={pL} dur="5.4s" begin="-.5s" splines={sL} />
            <animate attributeName="opacity" values="0;.8;0" dur="5.4s" begin="-.5s" repeatCount="indefinite" />
          </circle>
          <path className="tb-mt-x" d={SPARK} fill="#FFF1C7">
            <Mover pathId={pL} dur="5.4s" begin="-.12s" splines={sL} />
            <animate attributeName="opacity" values="0;1;0;1;0" keyTimes="0;.3;.5;.7;1" dur="5.4s" begin="-.12s" repeatCount="indefinite" />
          </path>
        </g>
      </svg>

      <svg className="tb-mt" aria-hidden="true" viewBox="0 0 130 700" preserveAspectRatio="none" style={{ right: -right }}>
        <defs>
          <linearGradient id={gR} x1="0" y1="0" x2="0" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFF1C7" stopOpacity=".2" />
            <stop offset=".15" stopColor="#FFF1C7" stopOpacity=".85" />
            <stop offset=".7" stopColor="#E8C77D" stopOpacity=".85" />
            <stop offset="1" stopColor="#E8C77D" stopOpacity="0" />
          </linearGradient>
          <path id={pR} d={PATH_R} />
        </defs>
        <path d={PATH_R} fill="none" stroke={`url(#${gR})`} strokeWidth="1.8" strokeLinecap="round" pathLength="1000" strokeDasharray="170 1000" filter={`url(#${glow})`}>
          <animate attributeName="stroke-dashoffset" values="1000;-170" dur="6.6s" begin="-2.3s" repeatCount="indefinite" calcMode="spline" keySplines={sR} />
        </path>
        <g filter={`url(#${glow})`}>
          <circle r="2.6" fill="#FFF1C7">
            <Mover pathId={pR} dur="6.6s" begin="-2.3s" splines={sR} />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.82;1" dur="6.6s" begin="-2.3s" repeatCount="indefinite" />
          </circle>
          <circle r="1.6" fill="#E8C77D">
            <Mover pathId={pR} dur="6.6s" begin="-2.6s" splines={sR} />
            <animate attributeName="opacity" values="0;.9;.5;0" keyTimes="0;.2;.8;1" dur="6.6s" begin="-2.6s" repeatCount="indefinite" />
          </circle>
          <g className="tb-mt-x" transform="translate(10 650)">
            {[
              { cx: -6, cy: 0, r: 1.3, fill: '#FFF1C7', kt: '0;.78;.88;1', o: '1', ky: '0;.85;1', dy: 14 },
              { cx: 6, cy: -6, r: 1, fill: '#E8C77D', kt: '0;.8;.9;1', o: '1', ky: '0;.86;1', dy: 16 },
              { cx: 1, cy: 8, r: 0.9, fill: '#FFF1C7', kt: '0;.82;.92;1', o: '.9', ky: '0;.88;1', dy: 14 },
            ].map((p, i) => (
              <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.fill}>
                <animate attributeName="opacity" values={`0;0;${p.o};0`} keyTimes={p.kt} dur="6.6s" begin="-2.3s" repeatCount="indefinite" />
                <animate attributeName="cy" values={`${p.cy};${p.cy};${p.cy + p.dy}`} keyTimes={p.ky} dur="6.6s" begin="-2.3s" repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        </g>
      </svg>

      <div className="tb-mt-static" aria-hidden="true" style={{ left: -70 }} />
      <div className="tb-mt-static" aria-hidden="true" style={{ right: -70 }} />
    </>
  )
}
