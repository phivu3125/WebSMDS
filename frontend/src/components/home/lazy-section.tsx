"use client"

import { ReactNode, useEffect, useRef, useState } from "react"

type LazySectionProps = {
  id?: string
  className?: string
  eager?: boolean
  children: ReactNode
}

export default function LazySection({ id, className, eager = false, children }: LazySectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(eager)

  useEffect(() => {
    if (isVisible || eager) return

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true)
      return
    }

    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: "200px 0px" }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [eager, isVisible])

  return (
    <div id={id} className={className} ref={containerRef}>
      {isVisible ? children : null}
    </div>
  )
}
