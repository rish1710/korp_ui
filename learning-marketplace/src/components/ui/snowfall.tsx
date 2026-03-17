"use client"

import React, { useEffect, useState } from 'react'

interface Snowflake {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speedX: number
  speedY: number
}

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  useEffect(() => {
    // Generate initial snowflakes
    const flakes: Snowflake[] = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 4 + 2, // px
      opacity: Math.random() * 0.5 + 0.1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: Math.random() * 0.5 + 0.5,
    }))
    setSnowflakes(flakes)

    let animationFrameId: number

    const updateSnowflakes = () => {
      setSnowflakes(currentFlakes =>
        currentFlakes.map(flake => {
          let newY = flake.y + flake.speedY * 0.1
          let newX = flake.x + flake.speedX * 0.1

          if (newY > 100) {
            newY = -5
            newX = Math.random() * 100
          }

          if (newX > 100) newX = 0
          if (newX < 0) newX = 100

          return { ...flake, x: newX, y: newY }
        })
      )
      animationFrameId = requestAnimationFrame(updateSnowflakes)
    }

    animationFrameId = requestAnimationFrame(updateSnowflakes)

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-slate-400"
          style={{
            left: `${flake.x}%`,
            top: `${flake.y}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
          }}
        />
      ))}
    </div>
  )
}
