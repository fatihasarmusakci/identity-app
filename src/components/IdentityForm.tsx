import { useState, useCallback } from 'react'
import type { IdentityFormData, FieldErrors, SocialKey } from '../types'
import { SOCIAL_KEYS, SOCIAL_LABELS, COUNTRY_PHONE_CODES } from '../types'
import { getEmailError, getUrlError } from '../lib/validation'
import { buildVCard, downloadVCard, copyToClipboard } from '../lib/vcard'
import CustomQRCode from './CustomQRCode'
import QRCustomizer, { type QRCustomOptions } from './QRCustomizer'
import {
  User,
  Mail,
  Phone,
  Globe,
  Building2,
  Briefcase,
  FileText,
  Linkedin,
  Instagram,
  Twitter,
  Github,
  Youtube,
  Facebook,
  Music2,
  ExternalLink,
} from 'lucide-react'
import styles from './IdentityForm.module.css'

const SOCIAL_ICONS: Record<SocialKey, React.ComponentType<any>> = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  github: Github,
  youtube: Youtube,
  facebook: Facebook,
  tiktok: Music2,
}

const initialForm: IdentityFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneCountryCode: '+90',
  phone: '',
  website: '',
  company: '',
  title: '',
  note: '',
  social: {
    linkedin: '',
    instagram: '',
    twitter: '',
    github: '',
    youtube: '',
    facebook: '',
    tiktok: '',
  },
}

function fullPhoneNumber(form: IdentityFormData): string {
  const code = (form.phoneCountryCode || '+90').trim().replace(/\s/g, '')
  let num = (form.phone || '').trim().replace(/\s/g, '')
  if (!num) return ''
  const codeNum = code.replace(/\D/g, '')
  if (codeNum === '90' && num.startsWith('0')) num = num.slice(1)
  return code.replace(/^\+/, '') + num
}

function ensureHttps(url: string): string {
  const u = url.trim()
  if (!u) return ''
  return /^https?:\/\//i.test(u) ? u : 'https://' + u
}

export default function IdentityForm() {
  const [form, setForm] = useState<IdentityFormData>(initialForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showQR, setShowQR] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrOptions, setQrOptions] = useState<QRCustomOptions>({
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    size: 220,
    level: 'M',
    includeMargin: true,
    shape: 'square',
    frame: 'none'
  })

  const update = useCallback((field: keyof IdentityFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    
    // Real-time validation for email and website
    if (field === 'email') {
      const error = getEmailError(value)
      setErrors((e) => ({ ...e, email: error }))
    } else if (field === 'website') {
      const error = getUrlError(value)
      setErrors((e) => ({ ...e, website: error }))
    } else if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: undefined }))
    }
  }, [errors])

  const updateSocial = useCallback((key: SocialKey, value: string) => {
    setForm((prev) => ({
      ...prev,
      social: { ...prev.social, [key]: value },
    }))
    
    // Real-time validation for social URLs
    const error = getUrlError(value)
    setErrors((e) => ({ ...e, [`social_${key}`]: error }))
  }, [])

  const validate = useCallback((): boolean => {
    const e: FieldErrors = {}
    const emailErr = getEmailError(form.email)
    if (emailErr) e.email = emailErr
    const urlErr = getUrlError(form.website)
    if (urlErr) e.website = urlErr
    SOCIAL_KEYS.forEach((key) => {
      const v = form.social[key]
      if (v) {
        const err = getUrlError(v)
        if (err) e[`social_${key}`] = err
      }
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }, [form])

  const hasAnyData = () => {
    if (form.firstName || form.lastName || form.email || form.phone || form.website || form.company || form.title || form.note) return true
    return Object.values(form.social).some(Boolean)
  }


  const handleCopyVCard = async () => {
    const success = await copyToClipboard(vcard)
    if (success) {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const handleShowQR = async () => {
    setIsGenerating(true)
    setErrors({})
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!hasAnyData()) {
      setErrors({ form: 'Lütfen QR kod oluşturmak için en az bir alanı doldurun.' })
      setIsGenerating(false)
      return
    }
    
    if (!validate()) {
      setErrors({ form: 'Lütfen formdaki hataları düzeltin.' })
      setIsGenerating(false)
      return
    }
    
    setShowQR(true)
    setIsGenerating(false)
  }

  const vcard = showQR && hasAnyData() ? buildVCard(form) : ''
  const filename = [form.firstName, form.lastName].filter(Boolean).join('_') || 'identity'
  const safeFilename = (filename.replace(/\s+/g, '_') || 'identity') + '.vcf'

  const phoneForLink = fullPhoneNumber(form)
  const websiteUrl = form.website?.trim() ? ensureHttps(form.website) : ''
  const hasLinks = showQR && (websiteUrl || form.email || phoneForLink || Object.values(form.social).some(Boolean))

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Identity</h1>
        <p className={styles.tagline}>Dijital kimliğiniz, tek bir taramada.</p>
        <p className={styles.hint}>Tüm alanlar isteğe bağlıdır — yalnızca paylaşmak istediklerinizi ekleyin.</p>
      </header>

      <main className={styles.main}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Kişisel Bilgiler</h2>

          <div className={styles.grid}>
            <label className={styles.label}>
              <span className={styles.labelRow}><User className={styles.icon} size={16} /> Ad</span>
              <input
                type="text"
                placeholder="İsteğe bağlı"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              <span className={styles.labelRow}><User className={styles.icon} size={16} /> Soyad</span>
              <input
                type="text"
                placeholder="İsteğe bağlı"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                className={styles.input}
              />
            </label>
          </div>

          <label className={styles.label}>
            <span className={styles.labelRow}><Mail className={styles.icon} size={16} /> E-posta</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={errors.email ? styles.inputError : styles.input}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </label>

          <label className={styles.label}>
            <span className={styles.labelRow}><Phone className={styles.icon} size={16} /> Telefon</span>
            <div className={styles.phoneRow}>
              <select
                aria-label="Country code"
                value={form.phoneCountryCode}
                onChange={(e) => update('phoneCountryCode', e.target.value)}
                className={styles.phoneCode}
              >
                {COUNTRY_PHONE_CODES.map(([code, name]) => (
                  <option key={code + name} value={code}>{code} {name}</option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="555 123 45 67"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={styles.phoneInput}
              />
            </div>
          </label>

          <label className={styles.label}>
            <span className={styles.labelRow}><Globe className={styles.icon} size={16} /> Web Sitesi</span>
            <input
              type="url"
              placeholder="https://..."
              value={form.website}
              onChange={(e) => update('website', e.target.value)}
              className={errors.website ? styles.inputError : styles.input}
            />
            {errors.website && <span className={styles.errorText}>{errors.website}</span>}
          </label>

          <div className={styles.grid}>
            <label className={styles.label}>
              <span className={styles.labelRow}><Building2 className={styles.icon} size={16} /> Şirket</span>
              <input
                type="text"
                placeholder="İsteğe bağlı"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              <span className={styles.labelRow}><Briefcase className={styles.icon} size={16} /> İş Unvanı</span>
              <input
                type="text"
                placeholder="İsteğe bağlı"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className={styles.input}
              />
            </label>
          </div>

          <label className={styles.label}>
            <span className={styles.labelRow}><FileText className={styles.icon} size={16} /> Not</span>
            <textarea
              placeholder="Kısa bir not (isteğe bağlı)"
              value={form.note}
              onChange={(e) => update('note', e.target.value)}
              className={styles.textarea}
              rows={2}
            />
          </label>

          <div className={styles.socialSection}>
            <h3 className={styles.socialTitle}>Sosyal Medya Linkleri</h3>
            <p className={styles.socialDesc}>Profil URL'lerinizi ekleyin; tıklanabilir linkler olarak paylaşılacaklar.</p>
            <div className={styles.socialList}>
              {SOCIAL_KEYS.map((key) => {
                const Icon = SOCIAL_ICONS[key]
                return (
                  <label key={key} className={styles.socialRow}>
                    <Icon className={styles.socialIcon} size={18} aria-hidden />
                    <span className={styles.socialName}>{SOCIAL_LABELS[key]}</span>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.social[key]}
                      onChange={(e) => updateSocial(key, e.target.value)}
                      className={errors[`social_${key}`] ? styles.socialInputError : styles.socialInput}
                    />
                    {errors[`social_${key}`] && (
                      <span className={styles.errorText}>{errors[`social_${key}`]}</span>
                    )}
                  </label>
                )
              })}
            </div>
          </div>

          {errors.form && <p className={styles.formError}>{errors.form}</p>}

          <div className={styles.actions}>
            <button 
              type="button" 
              onClick={handleShowQR} 
              className={styles.primaryBtn}
              disabled={isGenerating}
            >
              {isGenerating ? 'Oluşturuluyor...' : 'QR Kod Oluştur'}
            </button>
          </div>
        </section>

        {showQR && vcard && (
          <section className={styles.qrCard} aria-label="QR code and download">
            <h2 className={styles.cardTitle}>Paylaş</h2>
            <p className={styles.qrHint}>Diğerleri bu QR kodu tarayarak kişinizi cihazlarına ekleyebilir.</p>
            <div className={styles.qrWrap}>
              <CustomQRCode value={vcard} options={qrOptions} className={styles.qr} />
            </div>

            <QRCustomizer onCustomize={setQrOptions} />

            {hasLinks && (
              <div className={styles.linksBlock}>
                <h3 className={styles.linksTitle}>Linkler</h3>
                <p className={styles.linksDesc}>Site veya uygulamayı açmak için tıklayın.</p>
                <ul className={styles.linkList}>
                  {websiteUrl && (
                    <li>
                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className={styles.linkItem}>
                        <Globe size={16} /> Web Sitesi <ExternalLink size={14} />
                      </a>
                    </li>
                  )}
                  {form.email && (
                    <li>
                      <a href={`mailto:${form.email.trim()}`} className={styles.linkItem}>
                        <Mail size={16} /> E-posta <ExternalLink size={14} />
                      </a>
                    </li>
                  )}
                  {phoneForLink && (
                    <li>
                      <a href={`tel:+${phoneForLink}`} className={styles.linkItem}>
                        <Phone size={16} /> Telefon
                      </a>
                    </li>
                  )}
                  {SOCIAL_KEYS.map((key) => {
                    const url = form.social[key]?.trim()
                    if (!url) return null
                    const href = ensureHttps(url)
                    const Icon = SOCIAL_ICONS[key]
                    return (
                      <li key={key}>
                        <a href={href} target="_blank" rel="noopener noreferrer" className={styles.linkItem}>
                          <Icon size={16} /> {SOCIAL_LABELS[key]} <ExternalLink size={14} />
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            <div className={styles.qrActions}>
              <button
                type="button"
                onClick={() => downloadVCard(vcard, safeFilename)}
                className={styles.secondaryBtn}
              >
                VCF İndir
              </button>
              <button
                type="button"
                onClick={handleCopyVCard}
                className={`${styles.secondaryBtn} ${copySuccess ? styles.success : ''}`}
              >
                {copySuccess ? '✓ Kopyalandı' : 'VCF Kopyala'}
              </button>
              <button type="button" onClick={() => setShowQR(false)} className={styles.ghostBtn}>
                Düzenlemeye Geri Dön
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Verileriniz sadece cihazınızda işlenir ve hiçbir sunucuya gönderilmez.</p>
      </footer>
    </div>
  )
}
