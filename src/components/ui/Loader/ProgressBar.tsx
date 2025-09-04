"use client"

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

export const ProgressBar = () => {
  const [progress, setProgress] = useState(13)

  useEffect(() => {
    // First quick jump to 66%
    const first = setTimeout(() => setProgress(66), 500)

    // Slowly increment to 100%
    const second = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 1
        })
      }, 100)
    }, 1000)

    return () => {
      clearTimeout(first)
      clearTimeout(second)
    }
  }, [])

  return <Progress value={progress} className="w-[60%] max-w-[400px]" />
}
