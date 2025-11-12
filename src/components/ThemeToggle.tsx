"use client"

import { useTheme } from "next-themes"
import { Sun, Moon, Laptop } from "lucide-react"

export default function ThemeToggle() {
  const { theme = "system", setTheme } = useTheme()

  // cycles system -> dark -> light -> system
  const handleToggle = () => {
    const next = theme === "system" ? "dark" : theme === "dark" ? "light" : "system"
    setTheme(next)
  }

  const icon =
    theme === "dark" ? (
      <Moon className="size-4" />
    ) : theme === "light" ? (
      <Sun className="size-4" />
    ) : (
      <Laptop className="size-4" />
    )

  return (
    <button
      aria-label={`Toggle theme (current: ${theme})`}
      title={`Theme: ${theme} - click to cycle`}
      onClick={handleToggle}
      className="inline-flex items-center justify-center p-2 rounded-md border border-solid border-black/10 bg-white text-sm text-gray-800 shadow-sm hover:shadow-md transition-colors dark:border-white/10 dark:bg-input/30 dark:text-white cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
    >
      {icon}
    </button>
  )
}
