"use client"

import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

type WarpEventDetail = { href?: string; x: number; y: number; duration?: number }

/**
 * Fullscreen canvas warp transition. Listens to window event 'warp-go'.
 * Usage: window.dispatchEvent(new CustomEvent('warp-go', { detail: { href, x, y } }))
 */
export default function MagicWarp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const [active, setActive] = useState(false)
  const [mounted, setMounted] = useState(false)
  const originRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    const onWarp = (e: Event) => {
      const detail = (e as CustomEvent<WarpEventDetail>).detail
      const duration = Math.min(Math.max(detail?.duration ?? 1100, 600), 2000)
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d", { alpha: true })
      if (!ctx) return

      resizeCanvas(canvas)
      setActive(true)
      originRef.current = { x: detail?.x ?? canvas.width / 2, y: detail?.y ?? canvas.height / 2 }

      const start = performance.now()
      const particles = spawnParticles(canvas, 420)

      const animate = (t: number) => {
        const elapsed = t - start
        const p = Math.min(elapsed / duration, 1)

        // fade previous frame for motion trails
        ctx.globalCompositeOperation = "source-over"
        ctx.fillStyle = `rgba(12, 42, 58, ${0.14})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // warp gradient burst
        const { x, y } = originRef.current
        const maxR = Math.hypot(canvas.width, canvas.height)
        const r = easeOutExpo(p) * maxR
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(r, 1))
        gradient.addColorStop(0, "rgba(226,61,61,0.35)")
        gradient.addColorStop(0.35, "rgba(226,61,61,0.20)")
        gradient.addColorStop(0.75, "rgba(16,37,56,0.15)")
        gradient.addColorStop(1, "rgba(16,37,56,0.0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()

        // star streaks
        ctx.globalCompositeOperation = "lighter"
        particles.forEach((pt) => {
          const life = Math.min(pt.life + pt.speed * 0.016, 1)
          pt.life = life
          const len = 40 + 260 * easeOutExpo(life)
          const dx = Math.cos(pt.angle) * len
          const dy = Math.sin(pt.angle) * len
          const ox = x + pt.radius * Math.cos(pt.angle)
          const oy = y + pt.radius * Math.sin(pt.angle)

          const hue = 350 + (pt.seed * 20) % 20 // red tint variations
          const alpha = 0.35 * (1 - life)
          const lineWidth = 1 + 2 * (1 - life)

          const grad = ctx.createLinearGradient(ox, oy, ox + dx, oy + dy)
          grad.addColorStop(0, `hsla(${hue}, 85%, 60%, ${alpha})`)
          grad.addColorStop(1, `hsla(${hue}, 85%, 60%, 0)`)
          ctx.strokeStyle = grad
          ctx.lineWidth = lineWidth
          ctx.beginPath()
          ctx.moveTo(ox, oy)
          ctx.lineTo(ox + dx, oy + dy)
          ctx.stroke()
        })

        if (p < 1) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          // finish
          setActive(false)
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }

      cancelAnimationFrameSafe(rafRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("warp-go", onWarp as EventListener)
    const onResize = () => {
      if (canvasRef.current) resizeCanvas(canvasRef.current)
    }
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("warp-go", onWarp as EventListener)
      window.removeEventListener("resize", onResize)
      cancelAnimationFrameSafe(rafRef.current)
    }
  }, [])

  // Warten bis nach der Hydration, um Mismatches zu vermeiden
  if (typeof document === "undefined" || !mounted) return null
  return createPortal(
    <div
      aria-hidden
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        opacity: active ? 1 : 0,
        transition: "opacity 220ms ease",
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>,
    document.body
  )
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const { innerWidth: w, innerHeight: h } = window
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  const ctx = canvas.getContext("2d")
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function spawnParticles(canvas: HTMLCanvasElement, count: number) {
  const parts: Array<{ angle: number; radius: number; speed: number; life: number; seed: number }> = []
  const maxR = Math.hypot(canvas.width, canvas.height)
  for (let i = 0; i < count; i++) {
    parts.push({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * (maxR * 0.05),
      speed: 0.6 + Math.random() * 1.4,
      life: 0,
      seed: Math.random(),
    })
  }
  return parts
}

function easeOutExpo(x: number) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}

function cancelAnimationFrameSafe(id: number | null) {
  if (id != null) cancelAnimationFrame(id)
}

export function triggerWarp(href: string, x?: number, y?: number, duration?: number) {
  if (typeof window === "undefined") return
  const cx = x ?? window.innerWidth / 2
  const cy = y ?? window.innerHeight / 2
  window.dispatchEvent(new CustomEvent<WarpEventDetail>("warp-go", { detail: { href, x: cx, y: cy, duration } }))
}


