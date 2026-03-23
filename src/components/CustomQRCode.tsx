import { QRCodeSVG } from 'qrcode.react'
import type { QRCustomOptions } from './QRCustomizer'
import styles from './CustomQRCode.module.css'

interface CustomQRCodeProps {
  value: string
  options: QRCustomOptions
  className?: string
}

export default function CustomQRCode({ value, options, className }: CustomQRCodeProps) {
  const getFrameClass = () => {
    switch (options.frame) {
      case 'classic':
        return styles.frameClassic
      case 'modern':
        return styles.frameModern
      case 'minimal':
        return styles.frameMinimal
      default:
        return ''
    }
  }

  const getShapeClass = () => {
    switch (options.shape) {
      case 'circle':
        return styles.shapeCircle
      case 'rounded':
        return styles.shapeRounded
      default:
        return ''
    }
  }

  return (
    <div className={`${styles.qrWrapper} ${getFrameClass()} ${className || ''}`}>
      <div className={`${styles.qrInner} ${getShapeClass()}`}>
        <QRCodeSVG
          value={value}
          size={options.size}
          level={options.level}
          includeMargin={options.includeMargin}
          fgColor={options.fgColor}
          bgColor={options.bgColor}
          className={styles.qrCode}
        />
      </div>
      
      {options.frame === 'classic' && (
        <div className={styles.frameBorder}>
          <div className={styles.corner} data-position="top-left"></div>
          <div className={styles.corner} data-position="top-right"></div>
          <div className={styles.corner} data-position="bottom-left"></div>
          <div className={styles.corner} data-position="bottom-right"></div>
        </div>
      )}
      
      {options.frame === 'modern' && (
        <div className={styles.modernFrame}>
          <div className={styles.glow}></div>
        </div>
      )}
      
      {options.frame === 'minimal' && (
        <div className={styles.minimalFrame}></div>
      )}
    </div>
  )
}
