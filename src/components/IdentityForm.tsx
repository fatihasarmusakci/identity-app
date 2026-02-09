import { useState, useCallback } from 'react'
import type { IdentityFormData, FieldErrors, SocialKey } from '../types'
import { SOCIAL_KEYS, SOCIAL_LABELS, COUNTRY_PHONE_CODES } from '../types'
import { getEmailError, getUrlError } from '../lib/validation'
import { buildVCard, downloadVCard } from '../lib/vcard'
import { QRCodeSVG } from 'qrcode.react'
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

const SOCIAL_ICONS: Record<SocialKey, React.ComponentType<{ size?: number; className?: string }>> = {
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
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const update = useCallback((field: keyof IdentityFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }, [errors])

  const updateSocial = useCallback((key: SocialKey, value: string) => {
    setForm((prev) => ({
      ...prev,
      social: { ...prev.social, [key]: value },
    }))
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

  const handleBlur = (field: string) => () => setTouched((t) => ({ ...t, [field]: true }))

  const handleShowQR = () => {
    if (!validate()) return
    if (!hasAnyData()) {
      setErrors({ form: 'Please fill in at least one field to create your QR code.' })
      return
    }
    setErrors({})
    setShowQR(true)
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
        <p className={styles.tagline}>Your digital identity, in a single scan.</p>
        <p className={styles.hint}>All fields are optional — add only what you want to share.</p>
      </header>

      <main className={styles.main}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Personal info</h2>

          <div className={styles.grid}>
            <label className={styles.label}>
              <span className={styles.labelRow}><User className={styles.icon} size={16} /> First name</span>
              <input
                type="text"
                placeholder="Optional"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                onBlur={handleBlur('firstName')}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              <span className={styles.labelRow}><User className={styles.icon} size={16} /> Last name</span>
              <input
                type="text"
                placeholder="Optional"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                onBlur={handleBlur('lastName')}
                className={styles.input}
              />
            </label>
          </div>

          <label className={styles.label}>
            <span className={styles.labelRow}><Mail className={styles.icon} size={16} /> Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              onBlur={handleBlur('email')}
              className={errors.email ? styles.inputError : styles.input}
            />
            {touched.email && errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </label>

          <label className={styles.label}>
            <span className={styles.labelRow}><Phone className={styles.icon} size={16} /> Phone</span>
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
            <span className={styles.labelRow}><Globe className={styles.icon} size={16} /> Website</span>
            <input
              type="url"
              placeholder="https://..."
              value={form.website}
              onChange={(e) => update('website', e.target.value)}
              onBlur={handleBlur('website')}
              className={errors.website ? styles.inputError : styles.input}
            />
            {touched.website && errors.website && <span className={styles.errorText}>{errors.website}</span>}
          </label>

          <div className={styles.grid}>
            <label className={styles.label}>
              <span className={styles.labelRow}><Building2 className={styles.icon} size={16} /> Company</span>
              <input
                type="text"
                placeholder="Optional"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              <span className={styles.labelRow}><Briefcase className={styles.icon} size={16} /> Job title</span>
              <input
                type="text"
                placeholder="Optional"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className={styles.input}
              />
            </label>
          </div>

          <label className={styles.label}>
            <span className={styles.labelRow}><FileText className={styles.icon} size={16} /> Note</span>
            <textarea
              placeholder="A short note (optional)"
              value={form.note}
              onChange={(e) => update('note', e.target.value)}
              className={styles.textarea}
              rows={2}
            />
          </label>

          <div className={styles.socialSection}>
            <h3 className={styles.socialTitle}>Social links</h3>
            <p className={styles.socialDesc}>Add your profile URLs; they’ll be shared as clickable links.</p>
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
                      onBlur={handleBlur(`social_${key}`)}
                      className={errors[`social_${key}`] ? styles.socialInputError : styles.socialInput}
                    />
                    {touched[`social_${key}`] && errors[`social_${key}`] && (
                      <span className={styles.errorText}>{errors[`social_${key}`]}</span>
                    )}
                  </label>
                )
              })}
            </div>
          </div>

          {errors.form && <p className={styles.formError}>{errors.form}</p>}

          <div className={styles.actions}>
            <button type="button" onClick={handleShowQR} className={styles.primaryBtn}>
              Create QR code
            </button>
          </div>
        </section>

        {showQR && vcard && (
          <section className={styles.qrCard} aria-label="QR code and download">
            <h2 className={styles.cardTitle}>Share</h2>
            <p className={styles.qrHint}>Others can scan this QR code to add your contact to their device.</p>
            <div className={styles.qrWrap}>
              <QRCodeSVG value={vcard} size={220} level="M" includeMargin className={styles.qr} />
            </div>

            {hasLinks && (
              <div className={styles.linksBlock}>
                <h3 className={styles.linksTitle}>Links</h3>
                <p className={styles.linksDesc}>Click to open the site or app.</p>
                <ul className={styles.linkList}>
                  {websiteUrl && (
                    <li>
                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className={styles.linkItem}>
                        <Globe size={16} /> Website <ExternalLink size={14} />
                      </a>
                    </li>
                  )}
                  {form.email && (
                    <li>
                      <a href={`mailto:${form.email.trim()}`} className={styles.linkItem}>
                        <Mail size={16} /> Email <ExternalLink size={14} />
                      </a>
                    </li>
                  )}
                  {phoneForLink && (
                    <li>
                      <a href={`tel:+${phoneForLink}`} className={styles.linkItem}>
                        <Phone size={16} /> Phone
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
                Download VCF
              </button>
              <button type="button" onClick={() => setShowQR(false)} className={styles.ghostBtn}>
                Back to edit
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Your data is processed only on your device and is never sent to any server.</p>
      </footer>
    </div>
  )
}
