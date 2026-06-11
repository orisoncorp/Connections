import { TreeMap } from './components/TreeMap'
import './App.css'

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <span className="app-title">ORISON</span>
        <span className="app-subtitle">Connections · v0</span>
      </header>
      <main className="app-canvas">
        <TreeMap />
      </main>
    </div>
  )
}

export default App
