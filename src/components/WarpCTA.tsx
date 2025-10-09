"use client"

import Link from "next/link"
import React from "react"
import TileBurst, { triggerTileBurst } from "./TileBurst"

type Props = { label: string; href: string; className?: string }

export default function WarpCTA({ label, href, className }: Props) {
  return (
    <>
      <TileBurst />
      <button
        className={className}
        onClick={(e) => {
          const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
          const x = rect.left + rect.width / 2
          const y = rect.top + rect.height / 2
          triggerTileBurst(href, x, y)
          // slight delay to let the burst kick in
          setTimeout(() => {
            window.location.href = href
          }, 180)
        }}
      >
        {label}
      </button>
    </>
  )
}


