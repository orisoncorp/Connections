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

// ─── Viewport ────────────────────────────────────────────────────────────────
const W = 1200
const H = 900
const NODE_R = 38
const DAAT_R = 38

// ─── Helpers ─────────────────────────────────────────────────────────────────

function nodeById(id: string): Node {
  return nodes.find((n) => n.id === id)!
}

// Calcula ponto na borda do círculo na direção de outro nó
function edgePoint(from: Node, to: Node, r: number): [number, number] {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  return [from.x + (dx / dist) * r, from.y + (dy / dist) * r]
}

// Offset lateral para loops de retroalimentação evitarem sobreposição
function loopOffset(from: Node, to: Node, idx: number): string {
  // Usa curva bezier com ponto de controle deslocado lateralmente
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const dx = to.x - from.x
  const dy = to.y - from.y
  const perp = Math.sqrt(dx * dx + dy * dy)
  // Alterna lado com base no idx para múltiplos loops
  const side = idx % 2 === 0 ? 1 : -1
  const cx = mx + ((-dy / perp) * 120 * side)
  const cy = my + ((dx / perp) * 120 * side)
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

interface EdgePathProps {
  edge: Edge
  loopIdx?: number
}

function EdgePath({ edge, loopIdx = 0 }: EdgePathProps) {
  const from = nodeById(edge.from)
  const to = nodeById(edge.to)
  const color = EDGE_COLORS[edge.type]
  const dash = EDGE_DASH[edge.type]
  const width = edge.label ? EDGE_WIDTH[edge.type] : 1

  const isLoop = edge.type === 'retroalimentacao'
  const fromR = from.hidden ? DAAT_R : NODE_R
  const toR = to.hidden ? DAAT_R : NODE_R

  const [fx, fy] = edgePoint(from, to, fromR)
  const [tx, ty] = edgePoint(to, from, toR)

  let d: string
  let labelX: number
  let labelY: number

  if (isLoop) {
    d = loopOffset(
      { ...from, x: fx, y: fy },
      { ...to, x: tx, y: ty },
      loopIdx
    )
    // Ponto médio da curva
    const mx = (fx + tx) / 2
    const my = (fy + ty) / 2
    const dxn = tx - fx
    const dyn = ty - fy
    const perp = Math.sqrt(dxn * dxn + dyn * dyn)
    const side = loopIdx % 2 === 0 ? 1 : -1
    labelX = mx + ((-dyn / perp) * 60 * side)
    labelY = my + ((dxn / perp) * 60 * side)
  } else {
    d = `M ${fx} ${fy} L ${tx} ${ty}`
    labelX = (fx + tx) / 2
    labelY = (fy + ty) / 2
  }

  const arrowId = `arrow-${edge.id}`

  return (
    <g>
      <defs>
        <marker
          id={arrowId}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill={color} opacity={0.8} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dash}
        strokeOpacity={0.7}
        markerEnd={`url(#${arrowId})`}
      />
      {edge.label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={7}
          fontFamily="Montserrat, sans-serif"
          fontWeight={400}
          letterSpacing={1}
          opacity={0.85}
        >
          {edge.label}
        </text>
      )}
    </g>
  )
}

interface NodeCircleProps {
  node: Node
}

function NodeCircle({ node }: NodeCircleProps) {
  const color = DEPT_COLORS[node.department]
  const isHidden = node.hidden
  const isAux = node.department === 'auxiliar'
  const r = NODE_R

  // Cor de texto: projetos (off-white fill) usa midnight; outros usam off-white
  const textColor =
    node.department === 'projetos' ? '#111113' : '#e8e6e1'
  const labelColor =
    node.department === 'projetos' ? '#3a3a3a' : '#bcbab5'

  if (isHidden) {
    // Da'at — círculo tracejado translúcido
    return (
      <g>
        <circle
          cx={node.x}
          cy={node.y}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="6,4"
          opacity={0.4}
        />
        <circle
          cx={node.x}
          cy={node.y}
          r={r}
          fill={color}
          opacity={0.06}
        />
        <text
          x={node.x}
          y={node.y - 5}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#e8e6e1"
          fontSize={10}
          fontFamily="Cormorant Garamond, serif"
          fontWeight={300}
          opacity={0.4}
        >
          {node.label}
        </text>
        <text
          x={node.x}
          y={node.y + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#e8e6e1"
          fontSize={6}
          fontFamily="Montserrat, sans-serif"
          fontWeight={400}
          letterSpacing={2}
          opacity={0.3}
          style={{ textTransform: 'uppercase' }}
        >
          {node.sephirah}
        </text>
      </g>
    )
  }

  if (isAux) {
    // Substrato Visual — discreto, menor, retangular arredondado
    return (
      <g>
        <rect
          x={node.x - 52}
          y={node.y - 28}
          width={104}
          height={56}
          fill={color}
          fillOpacity={0.08}
          stroke={color}
          strokeWidth={1}
          strokeOpacity={0.3}
          rx={2}
        />
        <text
          x={node.x}
          y={node.y - 7}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#e8e6e1"
          fontSize={9}
          fontFamily="Cormorant Garamond, serif"
          fontWeight={300}
          opacity={0.6}
        >
          {node.label}
        </text>
        {node.subItems?.map((sub, i) => (
          <text
            key={i}
            x={node.x}
            y={node.y + 7 + i * 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#bcbab5"
            fontSize={6}
            fontFamily="Montserrat, sans-serif"
            fontWeight={400}
            letterSpacing={1}
            opacity={0.5}
          >
            {sub}
          </text>
        ))}
      </g>
    )
  }

  return (
    <g>
      {/* Glow sutil */}
      <circle
        cx={node.x}
        cy={node.y}
        r={r + 8}
        fill={color}
        opacity={0.04}
      />
      {/* Círculo principal */}
      <circle
        cx={node.x}
        cy={node.y}
        r={r}
        fill={color}
        fillOpacity={node.department === 'projetos' ? 0.85 : 0.18}
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.7}
      />
      {/* Label principal */}
      <text
        x={node.x}
        y={node.y - 7}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize={9.5}
        fontFamily="Cormorant Garamond, serif"
        fontWeight={300}
        letterSpacing={0.5}
      >
        {node.label}
      </text>
      {/* Sephirah secundário */}
      {node.sephirah && (
        <text
          x={node.x}
          y={node.y + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={labelColor}
          fontSize={6}
          fontFamily="Montserrat, sans-serif"
          fontWeight={400}
          letterSpacing={2}
          style={{ textTransform: 'uppercase' }}
        >
          {node.sephirah}
        </text>
      )}
      {/* Sub-items */}
      {node.subItems && (
        <text
          x={node.x}
          y={node.y + 54}
          textAnchor="middle"
          fill={labelColor}
          fontSize={6}
          fontFamily="Montserrat, sans-serif"
          fontWeight={400}
          letterSpacing={1}
          opacity={0.7}
        >
          {node.subItems.join(' · ')}
        </text>
      )}
    </g>
  )
}

// ─── Legenda ──────────────────────────────────────────────────────────────────

const EDGE_TYPE_LABELS: Record<EdgeType, string> = {
  valor: 'Valor',
  bloqueante: 'Bloqueante',
  retroalimentacao: 'Retroalimentação',
  informacional: 'Informacional',
}

function Legend() {
  const edgeTypes: EdgeType[] = ['valor', 'bloqueante', 'retroalimentacao', 'informacional']
  const depts: Array<{ dept: string; color: string; label: string }> = [
    { dept: 'tatico', color: '#8B1A1A', label: 'Tático' },
    { dept: 'aquisicao', color: '#8B4A1A', label: 'Aquisição' },
    { dept: 'controladoria', color: '#1A5C2E', label: 'Controladoria' },
    { dept: 'projetos', color: '#e8e6e1', label: 'Projetos' },
  ]

  return (
    <g transform="translate(16, 760)">
      {/* Fundo */}
      <rect
        x={0}
        y={-8}
        width={220}
        height={136}
        fill="#0d0d0f"
        fillOpacity={0.9}
        stroke="#2e2e2e"
        strokeWidth={1}
      />

      {/* Título */}
      <text
        x={12}
        y={10}
        fill="#bcbab5"
        fontSize={6}
        fontFamily="Montserrat, sans-serif"
        fontWeight={400}
        letterSpacing={3}
        style={{ textTransform: 'uppercase' }}
      >
        LEGENDA
      </text>

      {/* Tipos de aresta */}
      {edgeTypes.map((type, i) => {
        const color = EDGE_COLORS[type]
        const dash = EDGE_DASH[type]
        const y = 26 + i * 16
        return (
          <g key={type}>
            <line
              x1={12}
              y1={y}
              x2={44}
              y2={y}
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray={dash}
              opacity={0.8}
            />
            <text
              x={52}
              y={y + 1}
              fill="#d4d2cd"
              fontSize={7}
              fontFamily="Montserrat, sans-serif"
              dominantBaseline="middle"
            >
              {EDGE_TYPE_LABELS[type]}
            </text>
          </g>
        )
      })}

      {/* Divisor */}
      <line x1={12} y1={94} x2={208} y2={94} stroke="#2e2e2e" strokeWidth={1} />

      {/* Departamentos */}
      {depts.map((d, i) => {
        const y = 106 + i * 0 // horizontal
        return (
          <g key={d.dept} transform={`translate(${12 + i * 52}, ${y})`}>
            <circle cx={6} cy={6} r={6} fill={d.color} fillOpacity={0.7} />
            <text
              x={15}
              y={7}
              fill="#bcbab5"
              fontSize={6}
              fontFamily="Montserrat, sans-serif"
              dominantBaseline="middle"
              letterSpacing={0.5}
            >
              {d.label}
            </text>
          </g>
        )
      })}

      {/* Nota */}
      <text
        x={12}
        y={124}
        fill="#5a5a5a"
        fontSize={6}
        fontFamily="Montserrat, sans-serif"
      >
        rótulo = sustenta peso · sem rótulo = óbvia
      </text>
    </g>
  )
}

// ─── Pilar labels ─────────────────────────────────────────────────────────────

function PillarLabels() {
  return (
    <g opacity={0.2}>
      <text x={600} y={30} textAnchor="middle" fill="#e8e6e1" fontSize={7} fontFamily="Montserrat, sans-serif" letterSpacing={4} style={{ textTransform: 'uppercase' }}>
        ESTRATÉGICO
      </text>
      <text x={600} y={870} textAnchor="middle" fill="#e8e6e1" fontSize={7} fontFamily="Montserrat, sans-serif" letterSpacing={4} style={{ textTransform: 'uppercase' }}>
        MANIFESTAÇÃO
      </text>
      <text x={50} y={450} textAnchor="middle" fill="#1A5C2E" fontSize={7} fontFamily="Montserrat, sans-serif" letterSpacing={3} transform="rotate(-90,50,450)" style={{ textTransform: 'uppercase' }}>
        CONTROLADORIA
      </text>
      <text x={1150} y={450} textAnchor="middle" fill="#8B4A1A" fontSize={7} fontFamily="Montserrat, sans-serif" letterSpacing={3} transform="rotate(90,1150,450)" style={{ textTransform: 'uppercase' }}>
        AQUISIÇÃO
      </text>
    </g>
  )
}

// ─── TreeMap principal ────────────────────────────────────────────────────────

export function TreeMap() {
  // Índice de loops por par de nós para offset
  const loopCounters: Record<string, number> = {}

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      style={{ display: 'block' }}
      aria-label="Mapa de interdependências Orison — Árvore da Vida"
    >
      <defs>
        {/* Fundo radial sutil */}
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B1A1A" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
        </radialGradient>
        {/* Linha central do pilar */}
        <line id="pillarCenter" x1="600" y1="80" x2="600" y2="820" stroke="#2e2e2e" strokeWidth={1} strokeDasharray="2,6" opacity={0.3} />
      </defs>

      {/* Fundo */}
      <rect width={W} height={H} fill="#111113" />
      <rect width={W} height={H} fill="url(#bgGlow)" />

      {/* Linhas de pilar */}
      <line x1={600} y1={80} x2={600} y2={820} stroke="#2e2e2e" strokeWidth={1} strokeDasharray="2,6" opacity={0.25} />
      <line x1={380} y1={160} x2={380} y2={560} stroke="#1A5C2E" strokeWidth={1} strokeDasharray="2,8" opacity={0.12} />
      <line x1={820} y1={160} x2={820} y2={560} stroke="#8B4A1A" strokeWidth={1} strokeDasharray="2,8" opacity={0.12} />

      <PillarLabels />

      {/* Arestas — abaixo dos nós */}
      {edges.map((edge) => {
        let loopIdx = 0
        if (edge.type === 'retroalimentacao') {
          const key = `${edge.from}-${edge.to}`
          loopCounters[key] = (loopCounters[key] ?? 0) + 1
          loopIdx = loopCounters[key] - 1
        }
        return <EdgePath key={edge.id} edge={edge} loopIdx={loopIdx} />
      })}

      {/* Nós — acima das arestas */}
      {nodes.map((node) => (
        <NodeCircle key={node.id} node={node} />
      ))}

      <Legend />
    </svg>
  )
}
