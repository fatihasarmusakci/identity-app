import { QRCodeSVG } from 'qrcode.react'
import type { QRCustomOptions } from './QRCustomizer'
import styles from './CustomQRCode.module.css'

interface CustomQRCodeProps {
  value: string
  options: QRCustomOptions
  className?: string
}

export default function CustomQRCode({ value, options, className }: CustomQRCodeProps) {
  const downloadQRCode = () => {
    const svg = document.querySelector(`.${className || ''} .${styles.qrCode}`) as SVGElement
    if (!svg) return
    
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = options.size
      canvas.height = options.size
      ctx?.drawImage(img, 0, 0)
      
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = 'qrcode.png'
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }
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
    // Only square shape is available now
    return ''
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
      
      <button 
        onClick={downloadQRCode}
        className={styles.downloadBtn}
        title="QR Kodu İndir"
      >
        ⬇
      </button>
    </div>
  )
}
