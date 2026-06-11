import React, { useEffect, useRef } from 'react'
import {
  nodes,
  edges,
  DEPT_COLORS,
  EDGE_COLORS,
  EDGE_DASH,
  EDGE_WIDTH,
  type Node,
  type Edge,
} from '../data/connections'
import { useCanvas, type NodePositions } from './useCanvas'
import { EDGE_NUM } from './edgeNumbers'

// ─── Geometria inicial ────────────────────────────────────────────────────────
// Canvas de referência para a geometria canônica (independente do viewport)
const CANVAS_W = 1100
const CANVAS_H = 1020

const INITIAL_POSITIONS: NodePositions = {
  keter:    { x: 550, y: 100 },
  daat:     { x: 550, y: 265 },
  tiferet:  { x: 550, y: 480 },
  yesod:    { x: 550, y: 700 },
  malkhut:  { x: 550, y: 900 },
  hokhmah:  { x: 780, y: 185 },
  hesed:    { x: 780, y: 400 },
  netzach:  { x: 780, y: 620 },
  binah:    { x: 320, y: 185 },
  gevurah:  { x: 320, y: 400 },
  hod:      { x: 320, y: 620 },
  substrato:{ x: 90,  y: 480 },
}

const NODE_R = 36

// ─── Helpers de geometria ─────────────────────────────────────────────────────

function borderPt(
  fx: number, fy: number,
  tx: number, ty: number,
  r: number
): [number, number] {
  const dx = tx - fx, dy = ty - fy
  const d = Math.sqrt(dx * dx + dy * dy) || 1
  return [fx + dx / d * r, fy + dy / d * r]
}

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

function perpLeft(ax: number, ay: number, bx: number, by: number): [number, number] {
  const dx = bx - ax, dy = by - ay
  const d = Math.sqrt(dx * dx + dy * dy) || 1
  return [-dy / d, dx / d]
}

// ─── Roteamento de arestas ────────────────────────────────────────────────────

// Loops: todos arqueiam à direita
const LOOP_OFFSETS = [170, 270, 380, 220, 490]

// Posição t ao longo da linha para o chip de número
const CHIP_T: Record<string, number> = {
  e01: 0.28, e10: 0.72, e11: 0.35,
}

// Offset perpendicular: lado relativo ao vetor da aresta
const CHIP_SIDE: Record<string, 1 | -1> = {
  e01: -1, e02: 1,  e03: -1, e04: 1,
  e05: -1, e06: 1,  e07: 1,  e08: 1,
  e09: -1, e10: -1, e11: -1, e15: -1,
  e16: -1, e22: 1,
}

// Overrides para segmentos verticais (perpLeft ≈ [-1,0] não afasta o suficiente)
const CHIP_ABS: Record<string, [number, number]> = {
  e01: [-120, -14],
  e09: [-65, 0],
  e10: [-75, 0],
  e11: [-70, 0],
  e22: [70, 0],
}

interface PathResult {
  d: string
  numX: number
  numY: number
}

function buildPath(edge: Edge, positions: NodePositions, loopIdx: number): PathResult {
  const fp = positions[edge.from] ?? { x: 0, y: 0 }
  const tp = positions[edge.to]   ?? { x: 0, y: 0 }
  const isLoop = edge.type === 'retroalimentacao'
  const isSubstrato = edge.from === 'substrato' || edge.to === 'substrato'

  if (isLoop) {
    const offset = LOOP_OFFSETS[loopIdx % LOOP_OFFSETS.length]
    const [fx, fy] = borderPt(fp.x, fp.y, tp.x, tp.y, NODE_R)
    const [tx, ty] = borderPt(tp.x, tp.y, fp.x, fp.y, NODE_R)
    const mx = (fx + tx) / 2 + offset
    const my = (fy + ty) / 2
    const [lx, ly] = qBez(fx, fy, mx, my, tx, ty, 0.5)
    const chipYOff = (loopIdx % 3) * 14 - 14
    return {
      d: `M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`,
      numX: lx + 20,
      numY: ly + chipYOff,
    }
  }

  const [fx, fy] = borderPt(fp.x, fp.y, tp.x, tp.y, NODE_R)
  const [tx, ty] = borderPt(tp.x, tp.y, fp.x, fp.y, NODE_R)
  const t = CHIP_T[edge.id] ?? 0.5
  const lx = fx + (tx - fx) * t
  const ly = fy + (ty - fy) * t

  const abs = CHIP_ABS[edge.id]
  if (abs) {
    return { d: `M ${fx} ${fy} L ${tx} ${ty}`, numX: lx + abs[0], numY: ly + abs[1] }
  }

  const [px, py] = perpLeft(fx, fy, tx, ty)
  const side = CHIP_SIDE[edge.id] ?? 1
  return {
    d: `M ${fx} ${fy} L ${tx} ${ty}`,
    numX: lx + px * 18 * side,
    numY: ly + py * 18 * side,
  }
}

// ─── Componentes SVG ──────────────────────────────────────────────────────────

function EdgeLayer({ positions, loopEdges, normalEdges, substratoEdges }: {
  positions: NodePositions
  loopEdges: Edge[]
  normalEdges: Edge[]
  substratoEdges: Edge[]
}) {
  const renderEdge = (edge: Edge, loopIdx = 0) => {
    const color = EDGE_COLORS[edge.type]
    const dash = EDGE_DASH[edge.type]
    const isSubstrato = edge.from === 'substrato' || edge.to === 'substrato'
    const opacity = isSubstrato ? 0.22 : 0.60
    const width = isSubstrato ? 0.75 : (edge.label ? EDGE_WIDTH[edge.type] : 0.9)
    const { d } = buildPath(edge, positions, loopIdx)
    const arrowId = `arr-${edge.id}`
    return (
      <g key={edge.id}>
        <defs>
          <marker id={arrowId} markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L7,2.5 z" fill={color} opacity={isSubstrato ? 0.25 : 0.65} />
          </marker>
        </defs>
        <path d={d} fill="none" stroke={color} strokeWidth={width}
          strokeDasharray={dash} strokeOpacity={opacity}
          markerEnd={`url(#${arrowId})`} />
      </g>
    )
  }

  return (
    <g>
      {substratoEdges.map((e) => renderEdge(e))}
      {normalEdges.map((e) => renderEdge(e))}
      {loopEdges.map((e, i) => renderEdge(e, i))}
    </g>
  )
}

function NumChipLayer({ positions, loopEdges, normalEdges }: {
  positions: NodePositions
  loopEdges: Edge[]
  normalEdges: Edge[]
}) {
  const renderChip = (edge: Edge, loopIdx = 0) => {
    const num = EDGE_NUM[edge.id]
    if (!num) return null
    const color = EDGE_COLORS[edge.type]
    const { numX, numY } = buildPath(edge, positions, loopIdx)
    const R = 8
    return (
      <g key={`num-${edge.id}`}>
        <circle cx={numX} cy={numY} r={R} fill="#111113" stroke={color}
          strokeWidth={1} strokeOpacity={0.6} />
        <text x={numX} y={numY} textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize={7} fontFamily="Montserrat, sans-serif"
          fontWeight={600} opacity={0.9}>
          {num}
        </text>
      </g>
    )
  }

  return (
    <g>
      {normalEdges.map((e) => renderChip(e))}
      {loopEdges.map((e, i) => renderChip(e, i))}
    </g>
  )
}

function NodeLayer({ positions, onMouseDown }: {
  positions: NodePositions
  onMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void
}) {
  return (
    <g>
      {nodes.map((node) => (
        <NodeCircle key={node.id} node={node} positions={positions} />
      ))}
    </g>
  )
}

function NodeCircle({ node, positions }: { node: Node; positions: NodePositions }) {
  const p = positions[node.id] ?? { x: 0, y: 0 }
  const color = DEPT_COLORS[node.department]
  const isHidden = node.hidden
  const isAux = node.department === 'auxiliar'
  const nameColor = node.department === 'projetos' ? '#1a1a1c' : '#edeae4'
  const sephColor = node.department === 'projetos' ? '#555' : '#bcbab5'

  // Da'at — liminar mas presente (22% fill, borda tracejada legível)
  if (isHidden) {
    return (
      <g style={{ cursor: 'grab' }}>
        <circle cx={p.x} cy={p.y} r={NODE_R}
          fill={color} fillOpacity={0.22}
          stroke={color} strokeWidth={1.5}
          strokeDasharray="6,4" strokeOpacity={0.55} />
        {/* Nome acima */}
        <text x={p.x} y={p.y - NODE_R - 8} textAnchor="middle"
          fill="#e8e6e1" fontSize={10.5}
          fontFamily="Cormorant Garamond, serif" fontWeight={300} opacity={0.65}>
          {node.label}
        </text>
        {/* Sephirah dentro */}
        <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          fill="#e8e6e1" fontSize={6.5} fontFamily="Montserrat, sans-serif"
          letterSpacing={2} opacity={0.45} style={{ textTransform: 'uppercase' }}>
          {node.sephirah}
        </text>
      </g>
    )
  }

  if (isAux) {
    const bw = 100, bh = 52
    return (
      <g style={{ cursor: 'grab' }}>
        <rect x={p.x - bw / 2} y={p.y - bh / 2} width={bw} height={bh}
          fill={color} fillOpacity={0.07}
          stroke={color} strokeWidth={0.75} strokeOpacity={0.25} rx={2} />
        <text x={p.x} y={p.y - 10} textAnchor="middle"
          fill="#e8e6e1" fontSize={9} fontFamily="Cormorant Garamond, serif"
          fontWeight={300} opacity={0.48}>
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

  // Nome sempre acima: quebrar em linhas de máx 18 chars
  const words = node.label.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const cand = cur ? `${cur} ${w}` : w
    if (cand.length > 18 && cur) { lines.push(cur); cur = w }
    else cur = cand
  }
  if (cur) lines.push(cur)

  const lineH = 13
  const blockH = lines.length * lineH
  // Bloco sempre acima do círculo; gap = 8px
  const nameBlockTop = p.y - NODE_R - 8 - blockH

  return (
    <g style={{ cursor: 'grab' }}>
      <circle cx={p.x} cy={p.y} r={NODE_R + 10} fill={color} opacity={0.032} />
      <circle cx={p.x} cy={p.y} r={NODE_R}
        fill={color} fillOpacity={node.department === 'projetos' ? 0.82 : 0.16}
        stroke={color} strokeWidth={1} strokeOpacity={0.62} />

      {/* Nome acima — sempre */}
      {lines.map((line, i) => (
        <text key={i}
          x={p.x} y={nameBlockTop + i * lineH + lineH * 0.85}
          textAnchor="middle"
          fill={nameColor} fontSize={10.5}
          fontFamily="Cormorant Garamond, serif" fontWeight={300} letterSpacing={0.3}>
          {line}
        </text>
      ))}

      {/* Sephirah dentro */}
      {node.sephirah && (
        <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          fill={sephColor} fontSize={6.5} fontFamily="Montserrat, sans-serif"
          fontWeight={400} letterSpacing={2.5}
          style={{ textTransform: 'uppercase' }}>
          {node.sephirah}
        </text>
      )}

      {/* Sub-items abaixo do círculo */}
      {node.subItems && (
        <text x={p.x} y={p.y + NODE_R + 13} textAnchor="middle"
          fill={sephColor} fontSize={6.5} fontFamily="Montserrat, sans-serif"
          letterSpacing={0.8} opacity={0.72}>
          {node.subItems.join(' · ')}
        </text>
      )}
    </g>
  )
}

function PillarLabels({ positions }: { positions: NodePositions }) {
  // Âncoras fixas baseadas nas posições canônicas (não se movem com drag individual)
  const cx = positions['keter']?.x ?? 550
  return (
    <g>
      <text x={cx} y={30} textAnchor="middle" fill="#e8e6e1" fontSize={7}
        fontFamily="Montserrat, sans-serif" letterSpacing={4} opacity={0.14}>
        ESTRATÉGICO
      </text>
      <text x={cx} y={CANVAS_H - 20} textAnchor="middle" fill="#e8e6e1" fontSize={7}
        fontFamily="Montserrat, sans-serif" letterSpacing={4} opacity={0.14}>
        MANIFESTAÇÃO
      </text>
      <text x={positions['binah']?.x ?? 320} y={54} textAnchor="middle"
        fill="#1A5C2E" fontSize={6.5} fontFamily="Montserrat, sans-serif"
        letterSpacing={3} opacity={0.4}>SEVERIDADE</text>
      <text x={cx} y={54} textAnchor="middle"
        fill="#e8e6e1" fontSize={6.5} fontFamily="Montserrat, sans-serif"
        letterSpacing={3} opacity={0.25}>EQUILÍBRIO</text>
      <text x={positions['hokhmah']?.x ?? 780} y={54} textAnchor="middle"
        fill="#8B4A1A" fontSize={6.5} fontFamily="Montserrat, sans-serif"
        letterSpacing={3} opacity={0.4}>MISERICÓRDIA</text>
      {/* Linhas de pilar — fixas nas posições iniciais para não mover com drag */}
      <line x1={cx} y1={62} x2={cx} y2={920}
        stroke="#2e2e2e" strokeWidth={1} strokeDasharray="2,7" opacity={0.16} />
      <line x1={positions['binah']?.x ?? 320} y1={165}
            x2={positions['hod']?.x ?? 320}   y2={660}
        stroke="#1A5C2E" strokeWidth={1} strokeDasharray="2,8" opacity={0.08} />
      <line x1={positions['hokhmah']?.x ?? 780} y1={165}
            x2={positions['netzach']?.x ?? 780} y2={660}
        stroke="#8B4A1A" strokeWidth={1} strokeDasharray="2,8" opacity={0.08} />
    </g>
  )
}

// ─── Controles de zoom (HTML, fora do SVG) ────────────────────────────────────

function ZoomControls({ onZoomIn, onZoomOut, onFit }: {
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
}) {
  const btn: React.CSSProperties = {
    width: 28, height: 28,
    background: '#0d0d0f',
    border: '1px solid #2e2e2e',
    color: '#bcbab5',
    fontSize: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
    userSelect: 'none',
    flexShrink: 0,
    transition: 'background 0.15s',
  }
  return (
    <div style={{
      position: 'absolute', bottom: 20, right: 20,
      display: 'flex', flexDirection: 'column', gap: 2,
      zIndex: 10,
    }}>
      <button style={btn} onClick={onZoomIn} title="Zoom in">+</button>
      <button style={btn} onClick={onZoomOut} title="Zoom out">−</button>
      <button style={{ ...btn, fontSize: 9, letterSpacing: 0.5 }} onClick={onFit} title="Fit view">FIT</button>
    </div>
  )
}

// ─── TreeMap principal ────────────────────────────────────────────────────────

export function TreeMap() {
  const substratoEdges = edges.filter((e) => e.from === 'substrato' || e.to === 'substrato')
  const loopEdges      = edges.filter((e) => e.type === 'retroalimentacao')
  const normalEdges    = edges.filter(
    (e) => e.type !== 'retroalimentacao' && e.from !== 'substrato' && e.to !== 'substrato'
  )

  const containerRef = useRef<HTMLDivElement>(null)

  const { svgRef, transform, positions, onMouseDown, fitView, zoomIn, zoomOut } = useCanvas({
    initialTransform: { x: 0, y: 0, k: 1 },
    initialPositions: INITIAL_POSITIONS,
    nodeRadius: NODE_R,
  })

  // Fit ao montar
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    fitView(width, height, 80)
  }, [fitView])

  const handleFit = () => {
    const el = containerRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    fitView(width, height, 80)
  }

  const isDragging = useRef(false)

  return (
    <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <svg
        ref={svgRef}
        width="100%" height="100%"
        style={{ display: 'block', cursor: 'grab' }}
        onMouseDown={onMouseDown}
        aria-label="Mapa de interdependências Orison"
      >
        <defs>
          <radialGradient id="bgGlow" cx="52%" cy="45%" r="38%">
            <stop offset="0%" stopColor="#8B1A1A" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Fundo fixo — fora do grupo de transform */}
        <rect width="100%" height="100%" fill="#111113" />
        <rect width="100%" height="100%" fill="url(#bgGlow)" />

        {/* Grupo de zoom/pan — tudo aqui dentro transforma */}
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
          <PillarLabels positions={positions} />

          <EdgeLayer
            positions={positions}
            substratoEdges={substratoEdges}
            normalEdges={normalEdges}
            loopEdges={loopEdges}
          />

          <NodeLayer positions={positions} onMouseDown={onMouseDown} />

          {/* Chips numéricos — z acima dos nós */}
          <NumChipLayer
            positions={positions}
            normalEdges={normalEdges}
            loopEdges={loopEdges}
          />
        </g>
      </svg>

      <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} onFit={handleFit} />
    </div>
  )
}
