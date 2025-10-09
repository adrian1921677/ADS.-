"use client"

import Image from "next/image"
import React, { useEffect, useRef } from "react"

type Props = {
  title: string
  subtitle?: string
  padding?: number // Fahrbahn-Abstand um die Schrift
  speed?: number // px pro Sekunde entlang des Pfads
}

export default function TitleCarDrive({ title, subtitle, padding = 14, speed = 220 }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const carRef = useRef<HTMLImageElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const car = carRef.current
    if (!wrap || !car) return

    let last = performance.now()
    let progress = 0 // Strecke in px entlang des Rechteck-Pfads

    const loop = (t: number) => {
      const dt = (t - last) / 1000
      last = t

      // Sanfter Speed, beschleunigt bei Hover
      const hoverBoost = wrap.matches(":hover") ? 1.8 : 1
      progress += speed * hoverBoost * dt

      const rect = wrap.getBoundingClientRect()
      const W = rect.width + padding * 2
      const H = rect.height + padding * 2
      const L = 2 * (W + H)
      const s = progress % L

      // Pfad entlang des Rechtecks (im Viewport, absolut innerhalb Wrapper)
      let x = -padding
      let y = -padding
      let angle = 0

      if (s <= W) {
        // oben: links -> rechts
        x += s
        angle = 0
      } else if (s <= W + H) {
        // rechts: oben -> unten
        x += W
        y += s - W
        angle = 90
      } else if (s <= W + H + W) {
        // unten: rechts -> links
        x += W - (s - (W + H))
        y += H
        angle = 180
      } else {
        // links: unten -> oben
        y += H - (s - (W + H + W))
        angle = 270
      }

      // Position relativ platzieren
      const tx = x
      const ty = y
      car.style.transform = `translate(${tx}px, ${ty}px) rotate(${angle}deg)`

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [padding, speed])

  return (
    <div className="relative inline-block group select-none">
      <div ref={wrapRef} className="relative inline-block px-1">
        <div className="text-2xl md:text-3xl font-bold text-navy-600 group-hover:text-navy-700 transition-colors">
          {title}
        </div>
        {subtitle && <div className="text-body-sm text-gray-600">{subtitle}</div>}
        <Image
          ref={carRef}
          src="/car.png"
          alt="Car"
          width={24}
          height={16}
          className="pointer-events-none absolute top-0 left-0 drop-shadow-sm"
        />
      </div>
    </div>
  )
}


