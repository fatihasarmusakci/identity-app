import { useState } from 'react'
import { Sun, Moon, Sparkles } from 'lucide-react'
import styles from './ThemeSwitcher.module.css'

interface Theme {
  name: string
  icon: React.ComponentType<any>
  colors: {
    bgDeep: string
    bgCard: string
    bgInput: string
    border: string
    text: string
    textMuted: string
    accent: string
    accentDim: string
    accentGlow: string
  }
}

const themes: Theme[] = [
  {
    name: 'Galaksi',
    icon: Sparkles,
    colors: {
      bgDeep: '#0a0812',
      bgCard: 'rgba(22, 20, 32, 0.85)',
      bgInput: 'rgba(30, 28, 42, 0.9)',
      border: 'rgba(148, 163, 255, 0.15)',
      text: '#f1f0f4',
      textMuted: '#9ca3af',
      accent: '#a78bfa',
      accentDim: '#7c3aed',
      accentGlow: 'rgba(167, 139, 250, 0.25)'
    }
  },
  {
    name: 'Alev',
    icon: Sun,
    colors: {
      bgDeep: '#1a0f0a',
      bgCard: 'rgba(32, 20, 12, 0.85)',
      bgInput: 'rgba(42, 28, 18, 0.9)',
      border: 'rgba(255, 107, 53, 0.15)',
      text: '#fef7ed',
      textMuted: '#d97706',
      accent: '#f97316',
      accentDim: '#ea580c',
      accentGlow: 'rgba(249, 115, 22, 0.25)'
    }
  },
  {
    name: 'Buz',
    icon: Moon,
    colors: {
      bgDeep: '#0f172a',
      bgCard: 'rgba(30, 41, 59, 0.85)',
      bgInput: 'rgba(51, 65, 85, 0.9)',
      border: 'rgba(56, 189, 248, 0.15)',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      accent: '#0ea5e9',
      accentDim: '#0284c7',
      accentGlow: 'rgba(14, 165, 233, 0.25)'
    }
  }
]

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState(0)

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      root.style.setProperty(cssVar, value)
    })
  }

  const switchTheme = (index: number) => {
    setCurrentTheme(index)
    applyTheme(themes[index])
  }

  return (
    <div className={styles.themeSwitcher}>
      <div className={styles.themes}>
        {themes.map((theme, index) => {
          const Icon = theme.icon
          return (
            <button
              key={theme.name}
              className={`${styles.themeBtn} ${currentTheme === index ? styles.active : ''}`}
              onClick={() => switchTheme(index)}
              title={`${theme.name} teması`}
            >
              <Icon size={16} />
              <span>{theme.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
