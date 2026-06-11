import { edges } from '../data/connections'

// Numera apenas arestas com label (as "de peso"), em ordem de declaração
export const EDGE_NUM: Record<string, number> = {}

let counter = 1
for (const e of edges) {
  if (e.label) {
    EDGE_NUM[e.id] = counter++
  }
}
