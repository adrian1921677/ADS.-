"use client"

import Image from "next/image"
import React, { useEffect, useRef } from "react"

type Props = { title: string; subtitle?: string }

export default function LogoOrbit({ title, subtitle }: Props) {
  const orbitRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = orbitRef.current
    if (!el) return
    el.style.setProperty("--orbit-size", "64px")
  }, [])

  return (
    <div className="flex items-center space-x-4 group">
      <div className="relative">
        <div ref={orbitRef} className="orbit-ring">
          <Image src="/car.png" alt="Car" width={28} height={20} className="orbit-car" />
        </div>
      </div>
      <div className="leading-tight">
        <div className="text-2xl md:text-3xl font-bold text-navy-600 group-hover:text-navy-700 transition-colors">
          {title}
        </div>
        {subtitle && <div className="text-body-sm text-gray-600">{subtitle}</div>}
      </div>
    </div>
  )
}


