import React from 'react'
import {
  nodes,
  edges,
  DEPT_COLORS,
  EDGE_COLORS,
  EDGE_DASH,
  EDGE_WIDTH,
  type Node,
  type Edge,
  type EdgeType,
} from '../data/connections'

// ─── Viewport ─────────────────────────────────────────────────────────────────
const W = 1440
const H = 1020

// Geometria canônica — pilar central 700, direito 930, esquerdo 470, aux 130
// Mais espaço vertical no fundo para arcos de loop e sub-items de Malkhut
const NODE_POS: Record<string, { x: number; y: number }> = {
  keter:    { x: 700, y: 100  },
  daat:     { x: 700, y: 255  },
  tiferet:  { x: 700, y: 490  },
  yesod:    { x: 700, y: 700  },
  malkhut:  { x: 700, y: 900  },
  hokhmah:  { x: 930, y: 185  },
  hesed:    { x: 930, y: 405  },
  netzach:  { x: 930, y: 625  },
  binah:    { x: 470, y: 185  },
  gevurah:  { x: 470, y: 405  },
  hod:      { x: 470, y: 625  },
  substrato:{ x: 130, y: 490  },
}

function pos(id: string) { return NODE_POS[id] ?? { x: 0, y: 0 } }

const NODE_R = 36

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nodeById(id: string): Node {
  return nodes.find((n) => n.id === id)!
}

function borderPt(
  fx: number, fy: number,
  tx: number, ty: number,
  r: number
): [number, number] {
  const dx = tx - fx, dy = ty - fy
  const d = Math.sqrt(dx * dx + dy * dy) || 1
  return [fx + dx / d * r, fy + dy / d * r]
}

// Ponto ao longo de bezier quadrática em t
function qBez(
  ax: number, ay: number,
  cx: number, cy: number,
  bx: number, by: number,
  t: number
): [number, number] {
  const mt = 1 - t
  return [
    mt * mt * ax + 2 * mt * t * cx + t * t * bx,
    mt * mt * ay + 2 * mt * t * cy + t * t * by,
  ]
}

// Perpendicular normalizado de (ax,ay)→(bx,by): aponta "para a esquerda" do vetor
function perpLeft(ax: number, ay: number, bx: number, by: number): [number, number] {
  const dx = bx - ax, dy = by - ay
  const d = Math.sqrt(dx * dx + dy * dy) || 1
  return [-dy / d, dx / d]
}

// ─── Configuração especial por aresta ────────────────────────────────────────
// Permite fixar o lado do chip manualmente para evitar colisões conhecidas

const CHIP_SIDE_OVERRIDE: Record<string, 1 | -1> = {
  e01: -1,  // keter→tiferet: chip à esquerda
  e02: 1,   // keter→netzach: chip à direita
  e03: -1,  // keter→binah: chip à esquerda
  e04: 1,   // keter→hokhmah: chip à direita
  e05: -1,  // binah→tiferet: chip à esquerda
  e06: 1,   // tiferet→hesed: chip à direita
  e07: 1,   // hesed→netzach: chip à direita
  e08: 1,   // hokhmah→daat: chip à direita
  e09: -1,  // gevurah→yesod: chip à esquerda
  e10: -1,  // tiferet→malkhut: chip à esquerda
  e11: -1,  // daat→malkhut: chip à esquerda
  e15: -1,  // hod→gevurah: chip à esquerda
  e16: -1,  // binah→netzach: chip à esquerda
  e22: 1,   // yesod→daat: chip à direita
}

// t ao longo da linha para posicionar o chip (0=origem, 1=destino)
const CHIP_T_OVERRIDE: Record<string, number> = {
  e01: 0.28,  // keter→tiferet: acima do daat
  e10: 0.72,  // tiferet→malkhut: abaixo de yesod
  e11: 0.35,  // daat→malkhut: no terço superior
  e09: 0.5,
  e22: 0.5,
}

// Para segmentos quase-verticais, perpLeft retorna ~[-1,0] então o chip vai só 20px
// Esses overrides forçam offset manual em [dx,dy] absoluto
const CHIP_ABSOLUTE_OFFSET: Record<string, [number, number]> = {
  e01: [-140, -18], // keter→tiferet: longe do daat (deslocado acima-esquerda)
  e10: [-85, 0],  // tiferet→malkhut
  e11: [-75, 0],  // daat→malkhut
  e09: [-75, 0],  // gevurah→yesod
  e22: [75, 0],   // yesod→daat
}

// ─── Builder de caminho ────────────────────────────────────────────────────────

interface PathResult {
  d: string
  chipX: number
  chipY: number
}

// Loops: todos por fora à direita, raios escalonados por índice
// Ordem em loopEdges: e17(malkhut→hesed), e18(malkhut→netzach), e19(malkhut→gevurah), e20(gevurah→tiferet), e21(malkhut→daat)
const LOOP_OFFSETS = [170, 270, 380, 220, 490]

function buildPath(edge: Edge, loopIdx: number): PathResult {
  const fp = pos(edge.from)
  const tp = pos(edge.to)

  const isLoop = edge.type === 'retroalimentacao'
  const isSubstrato = edge.from === 'substrato' || edge.to === 'substrato'

  if (isLoop) {
    const offset = LOOP_OFFSETS[loopIdx % LOOP_OFFSETS.length]
    const [fx, fy] = borderPt(fp.x, fp.y, tp.x, tp.y, NODE_R)
    const [tx, ty] = borderPt(tp.x, tp.y, fp.x, fp.y, NODE_R)
    // Ponto de controle sempre à direita (x+offset do midpoint)
    const mx = (fx + tx) / 2 + offset
    const my = (fy + ty) / 2
    // Chip no ponto do arco mais à direita (t=0.5), deslocado +20px para além do arco
    const [lx, ly] = qBez(fx, fy, mx, my, tx, ty, 0.5)
    // Escalonar chipY por loopIdx para chips de loops próximos não se sobreporem
    const chipYOff = (loopIdx % 3) * 14 - 14
    return {
      d: `M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`,
      chipX: lx + 22,
      chipY: ly + chipYOff,
    }
  }

  const [fx, fy] = borderPt(fp.x, fp.y, tp.x, tp.y, NODE_R)
  const [tx, ty] = borderPt(tp.x, tp.y, fp.x, fp.y, NODE_R)

  // Posição t ao longo da linha para o chip
  const t = CHIP_T_OVERRIDE[edge.id] ?? 0.5
  const lx = fx + (tx - fx) * t
  const ly = fy + (ty - fy) * t

  // Absolute offset override para segmentos quase-verticais
  const absOff = CHIP_ABSOLUTE_OFFSET[edge.id]
  if (absOff) {
    return {
      d: `M ${fx} ${fy} L ${tx} ${ty}`,
      chipX: lx + absOff[0],
      chipY: ly + absOff[1],
    }
  }

  // Offset perpendicular — 20px, lado configurável
  const [px, py] = perpLeft(fx, fy, tx, ty)
  const side = CHIP_SIDE_OVERRIDE[edge.id] ?? 1

  return {
    d: `M ${fx} ${fy} L ${tx} ${ty}`,
    chipX: lx + px * 20 * side,
    chipY: ly + py * 20 * side,
  }
}

// ─── EdgePath ─────────────────────────────────────────────────────────────────

interface EdgePathProps {
  edge: Edge
  loopIdx?: number
}

function EdgePath({ edge, loopIdx = 0 }: EdgePathProps) {
  const color = EDGE_COLORS[edge.type]
  const dash = EDGE_DASH[edge.type]
  const isSubstrato = edge.from === 'substrato' || edge.to === 'substrato'
  const opacity = isSubstrato ? 0.2 : 0.62
  const width = isSubstrato ? 0.75 : (edge.label ? EDGE_WIDTH[edge.type] : 1)
  const { d } = buildPath(edge, loopIdx)
  const arrowId = `arr-${edge.id}`

  return (
    <g>
      <defs>
        <marker id={arrowId} markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
          <path d="M0,0 L0,5 L7,2.5 z" fill={color} opacity={isSubstrato ? 0.25 : 0.7} />
        </marker>
      </defs>
      <path
        d={d} fill="none"
        stroke={color} strokeWidth={width}
        strokeDasharray={dash} strokeOpacity={opacity}
        markerEnd={`url(#${arrowId})`}
      />
    </g>
  )
}

// ─── Chip de rótulo ───────────────────────────────────────────────────────────

function estimateW(text: string) { return text.length * 5.3 + 16 }

function EdgeChip({ edge, loopIdx = 0 }: EdgePathProps) {
  if (!edge.label) return null
  const isSubstrato = edge.from === 'substrato' || edge.to === 'substrato'
  if (isSubstrato) return null

  const { chipX, chipY } = buildPath(edge, loopIdx)
  const color = EDGE_COLORS[edge.type]
  const cw = estimateW(edge.label)
  const ch = 15

  return (
    <g>
      <rect
        x={chipX - cw / 2} y={chipY - ch / 2}
        width={cw} height={ch}
        fill="#111113" fillOpacity={0.96}
        stroke={color} strokeWidth={0.4} strokeOpacity={0.35}
        rx={1}
      />
      <text
        x={chipX} y={chipY}
        textAnchor="middle" dominantBaseline="middle"
        fill="#d4d2cd"
        fontSize={8.5}
        fontFamily="Montserrat, sans-serif"
        fontWeight={400}
        letterSpacing={0.2}
      >
        {edge.label}
      </text>
    </g>
  )
}

// ─── NodeCircle ───────────────────────────────────────────────────────────────

function NodeCircle({ node }: { node: Node }) {
  const p = pos(node.id)
  const color = DEPT_COLORS[node.department]
  const isHidden = node.hidden
  const isAux = node.department === 'auxiliar'

  const nameColor = node.department === 'projetos' ? '#1a1a1c' : '#edeae4'
  const sephColor = node.department === 'projetos' ? '#555' : '#bcbab5'

  if (isHidden) {
    return (
      <g>
        <circle cx={p.x} cy={p.y} r={NODE_R} fill={color} fillOpacity={0.04}
          stroke={color} strokeWidth={1.5} strokeDasharray="6,4" strokeOpacity={0.3} />
        <text x={p.x} y={p.y - NODE_R - 8} textAnchor="middle"
          fill="#e8e6e1" fontSize={10} fontFamily="Cormorant Garamond, serif"
          fontWeight={300} opacity={0.28}>
          {node.label}
        </text>
        <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          fill="#e8e6e1" fontSize={6} fontFamily="Montserrat, sans-serif"
          letterSpacing={2} opacity={0.22} style={{ textTransform: 'uppercase' }}>
          {node.sephirah}
        </text>
      </g>
    )
  }

  if (isAux) {
    const bw = 100, bh = 52
    return (
      <g>
        <rect x={p.x - bw / 2} y={p.y - bh / 2} width={bw} height={bh}
          fill={color} fillOpacity={0.06}
          stroke={color} strokeWidth={0.75} strokeOpacity={0.22} rx={2} />
        <text x={p.x} y={p.y - 10} textAnchor="middle"
          fill="#e8e6e1" fontSize={9} fontFamily="Cormorant Garamond, serif"
          fontWeight={300} opacity={0.45}>
          {node.label}
        </text>
        {node.subItems?.map((s, i) => (
          <text key={i} x={p.x} y={p.y + 4 + i * 11} textAnchor="middle"
            fill="#bcbab5" fontSize={6} fontFamily="Montserrat, sans-serif"
            letterSpacing={0.8} opacity={0.38}>
            {s}
          </text>
        ))}
      </g>
    )
  }

  // Quebra o nome em linhas de máx ~18 chars
  const words = node.label.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const candidate = cur ? `${cur} ${w}` : w
    if (candidate.length > 18 && cur) {
      lines.push(cur)
      cur = w
    } else {
      cur = candidate
    }
  }
  if (cur) lines.push(cur)

  const lineH = 13
  const blockH = lines.length * lineH
  // tiferet e yesod ficam espremidos no pilar central — nome vai abaixo para evitar
  // colisão com daat (acima de tiferet) e tiferet (acima de yesod)
  const nameBelow = node.id === 'tiferet' || node.id === 'yesod'
  const nameBlockTop = nameBelow
    ? p.y + NODE_R + 10
    : p.y - NODE_R - 8 - blockH

  return (
    <g>
      <circle cx={p.x} cy={p.y} r={NODE_R + 10} fill={color} opacity={0.035} />
      <circle cx={p.x} cy={p.y} r={NODE_R}
        fill={color} fillOpacity={node.department === 'projetos' ? 0.82 : 0.16}
        stroke={color} strokeWidth={1} strokeOpacity={0.62} />

      {/* Nome do nó — acima ou abaixo conforme nameBelow */}
      {lines.map((line, i) => (
        <text
          key={i}
          x={p.x}
          y={nameBlockTop + i * lineH + lineH * 0.85}
          textAnchor="middle"
          fill={nameColor}
          fontSize={10.5}
          fontFamily="Cormorant Garamond, serif"
          fontWeight={300}
          letterSpacing={0.3}
        >
          {line}
        </text>
      ))}

      {/* Sephirah dentro do círculo */}
      {node.sephirah && (
        <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          fill={sephColor} fontSize={6.5} fontFamily="Montserrat, sans-serif"
          fontWeight={400} letterSpacing={2.5}
          style={{ textTransform: 'uppercase' }}>
          {node.sephirah}
        </text>
      )}

      {/* Sub-items: quando nome está abaixo, sub-items ficam após o bloco de nome */}
      {node.subItems && (
        <text
          x={p.x}
          y={nameBelow
            ? nameBlockTop + blockH + lineH * 0.85 + 4
            : p.y + NODE_R + 13}
          textAnchor="middle"
          fill={sephColor} fontSize={6.5} fontFamily="Montserrat, sans-serif"
          letterSpacing={0.8} opacity={0.72}>
          {node.subItems.join(' · ')}
        </text>
      )}
    </g>
  )
}

// ─── Legenda ──────────────────────────────────────────────────────────────────

const EDGE_LABELS: Record<EdgeType, string> = {
  valor: 'Valor',
  bloqueante: 'Bloqueante',
  retroalimentacao: 'Retroalimentação',
  informacional: 'Informacional',
}

function Legend() {
  const types: EdgeType[] = ['valor', 'bloqueante', 'retroalimentacao', 'informacional']
  const depts = [
    { color: '#8B1A1A', label: 'Tático' },
    { color: '#8B4A1A', label: 'Aquisição' },
    { color: '#1A5C2E', label: 'Controladoria' },
    { color: '#e8e6e1', label: 'Projetos' },
  ]
  const x0 = 24, y0 = 720, w = 196
  const totalH = 16 + types.length * 19 + 14 + depts.length * 17 + 18

  return (
    <g transform={`translate(${x0},${y0})`}>
      <rect x={0} y={0} width={w} height={totalH}
        fill="#0d0d0f" fillOpacity={0.94} stroke="#2e2e2e" strokeWidth={1} />
      <text x={12} y={12} fill="#484848" fontSize={6}
        fontFamily="Montserrat, sans-serif" letterSpacing={3}>LEGENDA</text>

      {types.map((t, i) => {
        const y = 26 + i * 19
        return (
          <g key={t}>
            <line x1={12} y1={y} x2={46} y2={y}
              stroke={EDGE_COLORS[t]} strokeWidth={1.5}
              strokeDasharray={EDGE_DASH[t]} opacity={0.8} />
            <text x={54} y={y + 1} fill="#d4d2cd" fontSize={7.5}
              fontFamily="Montserrat, sans-serif" dominantBaseline="middle">
              {EDGE_LABELS[t]}
            </text>
          </g>
        )
      })}

      <line x1={12} y1={26 + types.length * 19 + 4} x2={w - 12} y2={26 + types.length * 19 + 4}
        stroke="#2e2e2e" strokeWidth={1} />

      {depts.map((d, i) => {
        const y = 26 + types.length * 19 + 16 + i * 17
        return (
          <g key={d.label}>
            <circle cx={18} cy={y} r={5} fill={d.color} fillOpacity={0.75} />
            <text x={30} y={y + 1} fill="#bcbab5" fontSize={7.5}
              fontFamily="Montserrat, sans-serif" dominantBaseline="middle">
              {d.label}
            </text>
          </g>
        )
      })}

      <text x={12} y={totalH - 7} fill="#3a3a3a" fontSize={6}
        fontFamily="Montserrat, sans-serif">
        rótulo = peso · sem rótulo = óbvia
      </text>
    </g>
  )
}

// ─── Rótulos de pilar ─────────────────────────────────────────────────────────

function PillarLabels() {
  return (
    <g>
      <text x={700} y={32} textAnchor="middle" fill="#e8e6e1" fontSize={7}
        fontFamily="Montserrat, sans-serif" letterSpacing={4} opacity={0.15}>
        ESTRATÉGICO
      </text>
      <text x={700} y={990} textAnchor="middle" fill="#e8e6e1" fontSize={7}
        fontFamily="Montserrat, sans-serif" letterSpacing={4} opacity={0.15}>
        MANIFESTAÇÃO
      </text>
      <text x={470} y={54} textAnchor="middle" fill="#1A5C2E" fontSize={6.5}
        fontFamily="Montserrat, sans-serif" letterSpacing={3} opacity={0.45}>
        SEVERIDADE
      </text>
      <text x={700} y={54} textAnchor="middle" fill="#e8e6e1" fontSize={6.5}
        fontFamily="Montserrat, sans-serif" letterSpacing={3} opacity={0.28}>
        EQUILÍBRIO
      </text>
      <text x={930} y={54} textAnchor="middle" fill="#8B4A1A" fontSize={6.5}
        fontFamily="Montserrat, sans-serif" letterSpacing={3} opacity={0.45}>
        MISERICÓRDIA
      </text>
      {/* Linhas de pilar */}
      <line x1={700} y1={62} x2={700} y2={920} stroke="#2e2e2e" strokeWidth={1}
        strokeDasharray="2,7" opacity={0.18} />
      <line x1={470} y1={165} x2={470} y2={660} stroke="#1A5C2E" strokeWidth={1}
        strokeDasharray="2,8" opacity={0.09} />
      <line x1={930} y1={165} x2={930} y2={660} stroke="#8B4A1A" strokeWidth={1}
        strokeDasharray="2,8" opacity={0.09} />
    </g>
  )
}

// ─── TreeMap ──────────────────────────────────────────────────────────────────

export function TreeMap() {
  const substratoEdges = edges.filter((e) => e.from === 'substrato' || e.to === 'substrato')
  const loopEdges      = edges.filter((e) => e.type === 'retroalimentacao')
  const normalEdges    = edges.filter(
    (e) => e.type !== 'retroalimentacao' && e.from !== 'substrato' && e.to !== 'substrato'
  )

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%" height="100%"
      style={{ display: 'block' }}
      aria-label="Mapa de interdependências Orison — Árvore da Vida"
    >
      <defs>
        <radialGradient id="bgGlow" cx="52%" cy="45%" r="38%">
          <stop offset="0%" stopColor="#8B1A1A" stopOpacity="0.022" />
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="#111113" />
      <rect width={W} height={H} fill="url(#bgGlow)" />

      <PillarLabels />

      {/* Camada 1 — substrato (mais fundo, muito fraco) */}
      {substratoEdges.map((e) => <EdgePath key={e.id} edge={e} />)}

      {/* Camada 2 — arestas normais */}
      {normalEdges.map((e) => <EdgePath key={e.id} edge={e} />)}

      {/* Camada 3 — loops (arcos largos à direita) */}
      {loopEdges.map((e, i) => <EdgePath key={e.id} edge={e} loopIdx={i} />)}

      {/* Nós */}
      {nodes.map((n) => <NodeCircle key={n.id} node={n} />)}

      {/* Chips de rótulo — z acima de tudo */}
      {normalEdges.map((e) => <EdgeChip key={`c-${e.id}`} edge={e} />)}
      {loopEdges.map((e, i) => <EdgeChip key={`c-${e.id}`} edge={e} loopIdx={i} />)}

      <Legend />
    </svg>
  )
}
