// Árvore da Vida — nós e arestas da Orison
// Coordenadas normalizadas para canvas 1200×900
// Geometria canônica: pilar central x=600, direito x=820, esquerdo x=380

export type Department = 'tatico' | 'aquisicao' | 'projetos' | 'controladoria' | 'auxiliar'

export type EdgeType = 'valor' | 'bloqueante' | 'retroalimentacao' | 'informacional'

export interface Node {
  id: string
  label: string
  sephirah: string
  department: Department
  x: number
  y: number
  hidden?: boolean // Da'at — oculto/tracejado
  subItems?: string[]
}

export interface Edge {
  id: string
  from: string
  to: string
  type: EdgeType
  label?: string // ausente = óbvia (sem rótulo, traço fino)
}

// ─── NÓS ────────────────────────────────────────────────────────────────────

export const nodes: Node[] = [
  // PILAR DO MEIO
  {
    id: 'keter',
    label: 'DNA Orison',
    sephirah: 'Keter',
    department: 'tatico',
    x: 600,
    y: 80,
  },
  {
    id: 'daat',
    label: 'Elpis',
    sephirah: "Da'at",
    department: 'projetos',
    x: 600,
    y: 240,
    hidden: true,
  },
  {
    id: 'tiferet',
    label: 'Catálogo de Verticais',
    sephirah: 'Tiferet',
    department: 'tatico',
    x: 600,
    y: 440,
  },
  {
    id: 'yesod',
    label: 'Command Center',
    sephirah: 'Yesod',
    department: 'projetos',
    x: 600,
    y: 640,
  },
  {
    id: 'malkhut',
    label: 'Entrega · Verticais Cliente',
    sephirah: 'Malkhut',
    department: 'projetos',
    x: 600,
    y: 820,
  },

  // PILAR DIREITO — Aquisição (Amber)
  {
    id: 'hokhmah',
    label: 'Predictable Revenue',
    sephirah: 'Hokhmah',
    department: 'aquisicao',
    x: 820,
    y: 160,
  },
  {
    id: 'hesed',
    label: 'Calculadora de ROI',
    sephirah: 'Hesed',
    department: 'aquisicao',
    x: 820,
    y: 360,
  },
  {
    id: 'netzach',
    label: 'Fechamento',
    sephirah: 'Netzach',
    department: 'aquisicao',
    x: 820,
    y: 560,
    subItems: ['Scripts', 'Slides', 'Closing'],
  },

  // PILAR ESQUERDO — Controladoria (Forest)
  {
    id: 'binah',
    label: 'Modelo de Precificação',
    sephirah: 'Binah',
    department: 'controladoria',
    x: 380,
    y: 160,
  },
  {
    id: 'gevurah',
    label: 'Indicadores',
    sephirah: 'Gevurah',
    department: 'controladoria',
    x: 380,
    y: 360,
  },
  {
    id: 'hod',
    label: 'Base Contábil',
    sephirah: 'Hod',
    department: 'controladoria',
    x: 380,
    y: 560,
    subItems: ['Planilhamento Financeiro', 'KB Contabilidade'],
  },

  // NÓ AUXILIAR
  {
    id: 'substrato',
    label: 'Substrato Visual',
    sephirah: '',
    department: 'auxiliar',
    x: 140,
    y: 440,
    subItems: ['Design System', 'Motion'],
  },
]

// ─── ARESTAS ─────────────────────────────────────────────────────────────────

export const edges: Edge[] = [
  // VALOR
  { id: 'e01', from: 'keter', to: 'tiferet', type: 'valor', label: 'Offers estrutura a oferta' },
  { id: 'e02', from: 'keter', to: 'netzach', type: 'valor', label: 'oferta molda o pitch' },
  { id: 'e03', from: 'keter', to: 'binah', type: 'valor', label: 'Money Models' },
  { id: 'e04', from: 'keter', to: 'hokhmah', type: 'valor', label: '100M Leads → motor' },
  { id: 'e05', from: 'binah', to: 'tiferet', type: 'valor', label: 'preço por vertical' },
  { id: 'e06', from: 'tiferet', to: 'hesed', type: 'valor', label: 'impacto da vertical' },
  { id: 'e07', from: 'hesed', to: 'netzach', type: 'valor', label: 'clímax quantitativo' },
  { id: 'e08', from: 'hokhmah', to: 'daat', type: 'valor', label: 'papéis → agentes' },
  { id: 'e09', from: 'gevurah', to: 'yesod', type: 'valor', label: 'fonte de dado' },
  { id: 'e10', from: 'tiferet', to: 'malkhut', type: 'valor', label: 'o que se entrega' },
  { id: 'e11', from: 'daat', to: 'malkhut', type: 'valor', label: 'peças aceleram entrega' },
  { id: 'e12', from: 'substrato', to: 'netzach', type: 'valor' }, // óbvia, sem rótulo
  { id: 'e13', from: 'substrato', to: 'yesod', type: 'valor' },   // óbvia, sem rótulo
  { id: 'e14', from: 'substrato', to: 'hesed', type: 'valor' },   // óbvia, sem rótulo

  // BLOQUEANTE
  { id: 'e15', from: 'hod', to: 'gevurah', type: 'bloqueante', label: 'sem dado, sem indicador' },
  { id: 'e16', from: 'binah', to: 'netzach', type: 'bloqueante', label: 'preço entra no fechamento' },

  // RETROALIMENTAÇÃO (loops)
  { id: 'e17', from: 'malkhut', to: 'hesed', type: 'retroalimentacao', label: 'L1 · resultado calibra projeção' },
  { id: 'e18', from: 'malkhut', to: 'netzach', type: 'retroalimentacao', label: 'L1 · prova fecha mais' },
  { id: 'e19', from: 'malkhut', to: 'gevurah', type: 'retroalimentacao', label: 'L2 · resultado vira métrica' },
  { id: 'e20', from: 'gevurah', to: 'tiferet', type: 'retroalimentacao', label: 'L2 · margem reprioriza' },
  { id: 'e21', from: 'malkhut', to: 'daat', type: 'retroalimentacao', label: 'L3 · entrega cria peça' },

  // INFORMACIONAL
  { id: 'e22', from: 'yesod', to: 'daat', type: 'informacional', label: 'provou a metodologia de peças' },
]

// ─── TOKENS DE COR ───────────────────────────────────────────────────────────

export const DEPT_COLORS: Record<Department, string> = {
  tatico: '#8B1A1A',       // crimson
  aquisicao: '#8B4A1A',    // cat-amber
  controladoria: '#1A5C2E', // positive-hi (Forest)
  projetos: '#e8e6e1',     // off-white
  auxiliar: '#8B1A1A',     // crimson (discreto)
}

// Cores de aresta — recursos visuais sem colidir com cores de departamento
// Usamos cat-teal, cat-steel, neutral e cat-plum
export const EDGE_COLORS: Record<EdgeType, string> = {
  valor: '#4A6A8B',         // cat-steel — sólido
  bloqueante: '#8B1A1A',    // crimson — tracejado
  retroalimentacao: '#1A6B6B', // cat-teal — pontilhado
  informacional: '#6B6B6B', // neutral-scale-7 — sólido fino
}

export const EDGE_DASH: Record<EdgeType, string | undefined> = {
  valor: undefined,           // sólido
  bloqueante: '8,4',          // tracejado
  retroalimentacao: '3,5',    // pontilhado
  informacional: '12,4',      // traço longo espaçado
}

export const EDGE_WIDTH: Record<EdgeType, number> = {
  valor: 1.5,
  bloqueante: 1.5,
  retroalimentacao: 1.5,
  informacional: 1,
}
