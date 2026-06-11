import React from 'react'
import { edges, EDGE_COLORS, EDGE_DASH, type EdgeType } from '../data/connections'
import { EDGE_NUM } from './edgeNumbers'
import { type VisibleTypes } from '../App'

const TYPE_LABELS: Record<EdgeType, string> = {
  valor: 'VALOR',
  bloqueante: 'BLOQUEANTE',
  retroalimentacao: 'RETROALIMENTAÇÃO',
  informacional: 'INFORMACIONAL',
}

const NODE_SHORT: Record<string, string> = {
  keter:    'DNA Orison',
  daat:     'Elpis',
  tiferet:  'Catálogo',
  yesod:    'Cmd Center',
  malkhut:  'Entrega',
  hokhmah:  'Pred. Revenue',
  hesed:    'Calc. ROI',
  netzach:  'Fechamento',
  binah:    'Precificação',
  gevurah:  'Indicadores',
  hod:      'Base Contábil',
  substrato:'Substrato',
}

const DEPT_COLORS: Record<string, string> = {
  tatico: '#8B1A1A',
  aquisicao: '#8B4A1A',
  controladoria: '#1A5C2E',
  projetos: '#e8e6e1',
}

const EDGE_TYPES: EdgeType[] = ['valor', 'bloqueante', 'retroalimentacao', 'informacional']

interface Props {
  visibleTypes: VisibleTypes
  onToggle: (type: EdgeType) => void
}

export function IndexPanel({ visibleTypes, onToggle }: Props) {
  return (
    <div style={{
      position: 'absolute',
      top: 48,
      left: 0,
      width: 260,
      height: 'calc(100% - 48px)',
      background: 'rgba(13,13,15,0.97)',
      borderRight: '1px solid #2e2e2e',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      zIndex: 10,
      fontFamily: 'Montserrat, sans-serif',
    }}>

      {/* ── Legenda ── */}
      <section style={{ padding: '14px 16px 12px', borderBottom: '1px solid #2e2e2e', flexShrink: 0 }}>
        <div style={{ fontSize: 5.5, letterSpacing: 3, color: '#484848', marginBottom: 10, textTransform: 'uppercase' }}>
          Legenda
        </div>

        {EDGE_TYPES.map((t) => {
          const dash = EDGE_DASH[t]
          const color = EDGE_COLORS[t]
          const visible = visibleTypes[t]
          return (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <svg width={28} height={10} style={{ flexShrink: 0 }}>
                <line x1={0} y1={5} x2={28} y2={5}
                  stroke={color} strokeWidth={1.5}
                  strokeDasharray={dash ?? undefined}
                  opacity={visible ? 0.8 : 0.22} />
              </svg>
              <span style={{ fontSize: 7, color: visible ? '#d4d2cd' : '#444', letterSpacing: 0.3, flex: 1 }}>
                {TYPE_LABELS[t]}
              </span>
              <button
                onClick={() => onToggle(t)}
                title={visible ? 'Ocultar' : 'Revelar'}
                style={{
                  background: 'none',
                  border: `1px solid ${visible ? color : '#333'}`,
                  borderRadius: 2,
                  padding: '2px 5px',
                  cursor: 'pointer',
                  color: visible ? color : '#444',
                  fontSize: 6,
                  letterSpacing: 0.5,
                  fontFamily: 'Montserrat, sans-serif',
                  flexShrink: 0,
                  lineHeight: 1.4,
                  opacity: 0.85,
                  transition: 'border-color 0.15s, color 0.15s',
                }}
              >
                {visible ? 'ON' : 'OFF'}
              </button>
            </div>
          )
        })}

        <div style={{ borderTop: '1px solid #2e2e2e', margin: '9px 0 8px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
          {Object.entries(DEPT_COLORS).map(([dept, color]) => {
            const label = { tatico: 'Tático', aquisicao: 'Aquisição', controladoria: 'Controladoria', projetos: 'Projetos' }[dept]!
            return (
              <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, opacity: 0.78, flexShrink: 0 }} />
                <span style={{ fontSize: 7, color: '#bcbab5' }}>{label}</span>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 8, fontSize: 5.5, color: '#3a3a3a' }}>
          nº no canvas = aresta com peso &middot; sem nº = óbvia
        </div>
      </section>

      {/* ── Índice ── */}
      <section style={{ padding: '10px 0 20px', flex: 1 }}>
        <div style={{ padding: '0 16px 8px', fontSize: 5.5, letterSpacing: 3, color: '#484848', textTransform: 'uppercase' }}>
          Índice de Arestas
        </div>

        {EDGE_TYPES.map((type) => {
          const group = edges.filter((e) => e.type === type && e.label)
          if (group.length === 0) return null
          const color = EDGE_COLORS[type]
          return (
            <div key={type} style={{ marginBottom: 4 }}>
              {/* Cabeçalho do grupo */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '6px 16px 5px',
                borderTop: '1px solid #1e1e20',
                marginTop: 4,
              }}>
                <svg width={20} height={8} style={{ flexShrink: 0 }}>
                  <line x1={0} y1={4} x2={20} y2={4}
                    stroke={color} strokeWidth={1.5}
                    strokeDasharray={EDGE_DASH[type] ?? undefined}
                    opacity={0.65} />
                </svg>
                <span style={{ fontSize: 6, letterSpacing: 2, color, opacity: 0.75, textTransform: 'uppercase' }}>
                  {TYPE_LABELS[type]}
                </span>
              </div>

              {group.map((edge) => {
                const num = EDGE_NUM[edge.id]
                return (
                  <div key={edge.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '18px 1fr',
                    gap: '2px 6px',
                    padding: '3px 16px 4px',
                    borderBottom: '1px solid #181818',
                  }}>
                    {/* Número */}
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                      paddingTop: 2,
                    }}>
                      <span style={{
                        width: 14, height: 14,
                        borderRadius: '50%',
                        background: '#111113',
                        border: `1px solid ${color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 6.5, fontWeight: 600, color, flexShrink: 0,
                        opacity: 0.9,
                      }}>
                        {num}
                      </span>
                    </div>

                    {/* Conteúdo */}
                    <div>
                      <div style={{ fontSize: 6.5, color: '#5a5a5a', marginBottom: 1.5 }}>
                        {NODE_SHORT[edge.from]} → {NODE_SHORT[edge.to]}
                      </div>
                      <div style={{ fontSize: 7.5, color: '#d4d2cd', lineHeight: 1.45 }}>
                        {edge.label}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </section>
    </div>
  )
}
