import { useState, useCallback } from 'react'
import { TreeMap } from './components/TreeMap'
import { IndexPanel } from './components/IndexPanel'
import { type EdgeType } from './data/connections'
import './App.css'

export type VisibleTypes = Record<EdgeType, boolean>

export const DEFAULT_VISIBLE: VisibleTypes = {
  valor: true,
  bloqueante: false,
  retroalimentacao: false,
  informacional: false,
}

function App() {
  const [visibleTypes, setVisibleTypes] = useState<VisibleTypes>({ ...DEFAULT_VISIBLE })

  const toggle = useCallback((type: EdgeType) => {
    setVisibleTypes((prev) => ({ ...prev, [type]: !prev[type] }))
  }, [])

  const resetVisibility = useCallback(() => {
    setVisibleTypes({ ...DEFAULT_VISIBLE })
  }, [])

  return (
    <div className="app-root">
      <header className="app-header">
        <span className="app-title">ORISON</span>
        <span className="app-subtitle">Connections · v0.3</span>
      </header>
      <main className="app-canvas">
        <IndexPanel visibleTypes={visibleTypes} onToggle={toggle} />
        <div className="app-canvas-inner">
          <TreeMap visibleTypes={visibleTypes} onResetVisibility={resetVisibility} />
        </div>
      </main>
    </div>
  )
}

export default App
