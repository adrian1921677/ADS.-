"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

type BurstDetail = { href: string; x: number; y: number }

export function triggerTileBurst(href: string, x: number, y: number) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent<BurstDetail>("tile-burst", { detail: { href, x, y } }))
}

export default function TileBurst() {
  const [mounted, setMounted] = useState(false)
  const [running, setRunning] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [cells, setCells] = useState<Array<{ i: number; j: number; delay: number }>>([])
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const grid = useMemo(() => ({ cols: 14, rows: 9 }), [])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onBurst = (e: Event) => {
      const { href, x, y } = (e as CustomEvent<BurstDetail>).detail
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setOrigin({ x: x - rect.left, y: y - rect.top })

      const cellW = rect.width / grid.cols
      const cellH = rect.height / grid.rows
      const arr: Array<{ i: number; j: number; delay: number }> = []
      for (let j = 0; j < grid.rows; j++) {
        for (let i = 0; i < grid.cols; i++) {
          const cx = i * cellW + cellW / 2
          const cy = j * cellH + cellH / 2
          const d = Math.hypot(cx - (x - rect.left), cy - (y - rect.top))
          const delay = d / 900 // ms base
          arr.push({ i, j, delay })
        }
      }
      setCells(arr)
      setRunning(true)

      // navigate slightly after start for perceived snappiness
      setTimeout(() => {
        window.location.href = href
      }, 160)
    }

    window.addEventListener("tile-burst", onBurst as EventListener)
    return () => window.removeEventListener("tile-burst", onBurst as EventListener)
  }, [grid.cols, grid.rows])

  if (!mounted) return null
  return createPortal(
    <div ref={containerRef} className="tileburst-layer" aria-hidden>
      {running && (
        <div className="tileburst-grid" style={{
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        }}>
          {cells.map(({ i, j, delay }, idx) => (
            <span
              key={`${i}-${j}-${idx}`}
              className="tileburst-cell"
              style={{
                animationDelay: `${delay}s`,
                transformOrigin: `${origin.x}px ${origin.y}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}


