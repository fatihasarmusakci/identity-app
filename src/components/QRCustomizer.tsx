import { useState } from 'react'
import { Palette, Shapes, Image } from 'lucide-react'
import styles from './QRCustomizer.module.css'

interface QRCustomizerProps {
  onCustomize: (options: QRCustomOptions) => void
}

export interface QRCustomOptions {
  fgColor: string
  bgColor: string
  size: number
  level: 'L' | 'M' | 'Q' | 'H'
  includeMargin: boolean
  shape: 'square'
  frame: 'none' | 'classic' | 'modern' | 'minimal'
}

const defaultOptions: QRCustomOptions = {
  fgColor: '#000000',
  bgColor: '#FFFFFF',
  size: 220,
  level: 'M',
  includeMargin: true,
  shape: 'square',
  frame: 'none'
}

const colorPresets = [
  { name: 'Klasik', fg: '#000000', bg: '#FFFFFF' },
  { name: 'Neon Mavi', fg: '#00D9FF', bg: '#0A0812' },
  { name: 'Galaksi', fg: '#A78BFA', bg: '#1E1B2E' },
  { name: 'Matrix', fg: '#00FF41', bg: '#0A0A0A' },
  { name: 'Güneş', fg: '#FFB800', bg: '#2C1810' },
  { name: 'Alev', fg: '#FF6B35', bg: '#2D1B00' }
]

export default function QRCustomizer({ onCustomize }: QRCustomizerProps) {
  const [options, setOptions] = useState<QRCustomOptions>(defaultOptions)
  const [activeTab, setActiveTab] = useState<'colors' | 'shape' | 'frame'>('colors')

  const updateOptions = (newOptions: Partial<QRCustomOptions>) => {
    const updated = { ...options, ...newOptions }
    setOptions(updated)
    onCustomize(updated)
  }

  return (
    <div className={styles.customizer}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'colors' ? styles.active : ''}`}
          onClick={() => setActiveTab('colors')}
        >
          <Palette size={16} />
          Renkler
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'shape' ? styles.active : ''}`}
          onClick={() => setActiveTab('shape')}
        >
          <Shapes size={16} />
          Şekil
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'frame' ? styles.active : ''}`}
          onClick={() => setActiveTab('frame')}
        >
          <Image size={16} />
          Çerçeve
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'colors' && (
          <div className={styles.colorSection}>
            <h4>Renk Paletleri</h4>
            <div className={styles.presets}>
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  className={styles.preset}
                  onClick={() => updateOptions({ fgColor: preset.fg, bgColor: preset.bg })}
                >
                  <div className={styles.preview}>
                    <div style={{ backgroundColor: preset.bg, padding: '2px' }}>
                      <div style={{ backgroundColor: preset.fg, width: '20px', height: '20px' }}></div>
                    </div>
                  </div>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>

            <div className={styles.customColors}>
              <div className={styles.colorInput}>
                <label>Ön Renk</label>
                <input
                  type="color"
                  value={options.fgColor}
                  onChange={(e) => updateOptions({ fgColor: e.target.value })}
                />
              </div>
              <div className={styles.colorInput}>
                <label>Arka Renk</label>
                <input
                  type="color"
                  value={options.bgColor}
                  onChange={(e) => updateOptions({ bgColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shape' && (
          <div className={styles.shapeSection}>
            <h4>QR Kod Şekli</h4>
            <div className={styles.shapeOptions}>
              {[
                { value: 'square', label: 'Kare', icon: '■' }
              ].map((shape) => (
                <button
                  key={shape.value}
                  className={`${styles.shapeOption} ${options.shape === shape.value ? styles.active : ''}`}
                  onClick={() => updateOptions({ shape: shape.value as any })}
                >
                  <span className={styles.shapeIcon}>{shape.icon}</span>
                  <span>{shape.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'frame' && (
          <div className={styles.frameSection}>
            <h4>Çerçeve Stili</h4>
            <div className={styles.frameOptions}>
              {[
                { value: 'none', label: 'Yok' },
                { value: 'classic', label: 'Klasik' },
                { value: 'modern', label: 'Modern' },
                { value: 'minimal', label: 'Minimal' }
              ].map((frame) => (
                <button
                  key={frame.value}
                  className={`${styles.frameOption} ${options.frame === frame.value ? styles.active : ''}`}
                  onClick={() => updateOptions({ frame: frame.value as any })}
                >
                  {frame.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
