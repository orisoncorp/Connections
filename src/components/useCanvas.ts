import { useRef, useState, useCallback, useEffect } from 'react'

export interface Transform {
  x: number
  y: number
  k: number
}

export interface NodePositions {
  [id: string]: { x: number; y: number }
}

const K_MIN = 0.25
const K_MAX = 3.5

interface UseCanvasOptions {
  initialTransform: Transform
  initialPositions: NodePositions
  nodeRadius: number
}

export function useCanvas({ initialTransform, initialPositions, nodeRadius }: UseCanvasOptions) {
  const [transform, setTransform] = useState<Transform>(initialTransform)
  const [positions, setPositions] = useState<NodePositions>(initialPositions)

  // Refs para handler de mouse sem re-renders
  const transformRef = useRef(transform)
  const positionsRef = useRef(positions)
  transformRef.current = transform
  positionsRef.current = positions

  const dragState = useRef<{
    type: 'pan' | 'node'
    nodeId?: string
    startX: number
    startY: number
    originX: number
    originY: number
  } | null>(null)

  const svgRef = useRef<SVGSVGElement>(null)

  // Converte coordenadas de screen para canvas
  const screenToCanvas = useCallback((sx: number, sy: number, t: Transform) => {
    return {
      x: (sx - t.x) / t.k,
      y: (sy - t.y) / t.k,
    }
  }, [])

  // Zoom centrado no cursor
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const t = transformRef.current
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newK = Math.min(K_MAX, Math.max(K_MIN, t.k * delta))
    const ratio = newK / t.k
    setTransform({
      k: newK,
      x: mx - ratio * (mx - t.x),
      y: my - ratio * (my - t.y),
    })
  }, [])

  // Hit-test: retorna nodeId se o ponto canvas cai dentro de algum nó
  const hitNode = useCallback((cx: number, cy: number): string | null => {
    const pos = positionsRef.current
    for (const [id, p] of Object.entries(pos)) {
      const dx = cx - p.x, dy = cy - p.y
      if (dx * dx + dy * dy <= (nodeRadius + 4) ** 2) return id
    }
    return null
  }, [nodeRadius])

  const onMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const sx = e.clientX - rect.left
    const sy = e.clientY - rect.top
    const t = transformRef.current
    const { x: cx, y: cy } = screenToCanvas(sx, sy, t)
    const nodeId = hitNode(cx, cy)

    dragState.current = {
      type: nodeId ? 'node' : 'pan',
      nodeId: nodeId ?? undefined,
      startX: sx,
      startY: sy,
      originX: nodeId ? positionsRef.current[nodeId].x : t.x,
      originY: nodeId ? positionsRef.current[nodeId].y : t.y,
    }
    e.preventDefault()
  }, [hitNode, screenToCanvas])

  const onMouseMove = useCallback((e: MouseEvent) => {
    const ds = dragState.current
    if (!ds) return
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const sx = e.clientX - rect.left
    const sy = e.clientY - rect.top
    const dx = sx - ds.startX
    const dy = sy - ds.startY

    if (ds.type === 'pan') {
      setTransform((t) => ({ ...t, x: ds.originX + dx, y: ds.originY + dy }))
    } else if (ds.type === 'node' && ds.nodeId) {
      const k = transformRef.current.k
      setPositions((prev) => ({
        ...prev,
        [ds.nodeId!]: {
          x: ds.originX + dx / k,
          y: ds.originY + dy / k,
        },
      }))
    }
  }, [])

  const onMouseUp = useCallback(() => {
    dragState.current = null
  }, [])

  // Cursor style
  const [isDraggingNode, setIsDraggingNode] = useState(false)

  const getCursor = useCallback(() => {
    if (!dragState.current) return 'grab'
    return dragState.current.type === 'node' ? 'grabbing' : 'grabbing'
  }, [])

  // Fit-to-view: reseta posições para o inicial e enquadra tudo
  const fitView = useCallback((svgW: number, svgH: number, padding = 80) => {
    // Sempre volta às posições originais
    setPositions(initialPositions)
    // Calcula transform sobre as posições originais (não as arrastadas)
    const pos = initialPositions
    const xs = Object.values(pos).map((p) => p.x)
    const ys = Object.values(pos).map((p) => p.y)
    const minX = Math.min(...xs) - padding
    const maxX = Math.max(...xs) + padding
    const minY = Math.min(...ys) - padding
    const maxY = Math.max(...ys) + padding
    const contentW = maxX - minX
    const contentH = maxY - minY
    const k = Math.min(K_MAX, Math.max(K_MIN, Math.min(svgW / contentW, svgH / contentH) * 0.9))
    const x = (svgW - contentW * k) / 2 - minX * k
    const y = (svgH - contentH * k) / 2 - minY * k
    setTransform({ x, y, k })
  }, [initialPositions])

  // Attach wheel listener (passive: false)
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [onWheel])

  // Global mouse move / up
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  return {
    svgRef,
    transform,
    positions,
    onMouseDown,
    fitView,
    getCursor,
    zoomIn: () => setTransform((t) => {
      const k = Math.min(K_MAX, t.k * 1.2)
      return { x: t.x, y: t.y, k }
    }),
    zoomOut: () => setTransform((t) => {
      const k = Math.max(K_MIN, t.k / 1.2)
      return { x: t.x, y: t.y, k }
    }),
  }
}
