import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

import { getTheme, setTheme, type Theme } from '@/lib/theme'

export function ThemeToggle() {
  // Starts null: the server has no idea which theme the head script chose, so
  // rendering an icon before hydration would risk showing the wrong one.
  const [theme, setThemeState] = useState<Theme | null>(null)

  useEffect(() => {
    setThemeState(getTheme())
  }, [])

  const toggle = () => {
    const next: Theme = getTheme() === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      }
      title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
      className="shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    >
      {/* Both icons are always rendered and cross-faded, so the button never
          pops in after hydration and occupies stable layout space. */}
      <span className="relative w-[18px] h-[18px]">
        <Sun
          size={18}
          className={`absolute inset-0 transition-all duration-300 ${
            theme === 'dark'
              ? 'opacity-0 -rotate-90 scale-50'
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon
          size={18}
          className={`absolute inset-0 transition-all duration-300 ${
            theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-50'
          }`}
        />
      </span>
    </button>
  )
}
