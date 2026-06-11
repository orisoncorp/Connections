import { TreeMap } from './components/TreeMap'
import { IndexPanel } from './components/IndexPanel'
import './App.css'

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <span className="app-title">ORISON</span>
        <span className="app-subtitle">Connections · v0.2</span>
      </header>
      <main className="app-canvas">
        <IndexPanel />
        <div className="app-canvas-inner">
          <TreeMap />
        </div>
      </main>
    </div>
  )
}

export default App
