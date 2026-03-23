import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { buildVCard, downloadVCard } from './vcard'
import type { IdentityFormData } from '../types'
import { SOCIAL_KEYS } from '../types'

// jsdom'da URL.createObjectURL/revokeObjectURL bazen yok veya farklı davranır
const createObjectURL = vi.fn(() => 'blob:mock')
const revokeObjectURL = vi.fn()

function emptyForm(): IdentityFormData {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phoneCountryCode: '+90',
    phone: '',
    website: '',
    company: '',
    title: '',
    note: '',
    social: Object.fromEntries(SOCIAL_KEYS.map((k) => [k, ''])) as IdentityFormData['social'],
  }
}

describe('buildVCard', () => {
  it('her zaman BEGIN:VCARD, VERSION:4.0 ve END:VCARD içerir', () => {
    const vcard = buildVCard(emptyForm())
    expect(vcard).toContain('BEGIN:VCARD')
    expect(vcard).toContain('VERSION:4.0')
    expect(vcard).toContain('END:VCARD')
    expect(vcard.trim()).toMatch(/^BEGIN:VCARD[\s\S]+END:VCARD$/)
  })

  it('hiç alan dolu değilse FN:Unknown içerir', () => {
    const vcard = buildVCard(emptyForm())
    expect(vcard).toContain('FN;CHARSET=UTF-8:Unknown')
  })

  it('ad ve soyad ile N ve FN alanlarını doğru üretir', () => {
    const form = emptyForm()
    form.firstName = 'Ali'
    form.lastName = 'Yılmaz'
    const vcard = buildVCard(form)
    expect(vcard).toContain('N;CHARSET=UTF-8:Yılmaz;Ali;;;')
    expect(vcard).toContain('FN;CHARSET=UTF-8:Ali Yılmaz')
  })

  it('sadece ad verildiğinde N ve FN doğrudur', () => {
    const form = emptyForm()
    form.firstName = 'Ayşe'
    const vcard = buildVCard(form)
    expect(vcard).toContain('FN;CHARSET=UTF-8:Ayşe')
    expect(vcard).toMatch(/N;CHARSET=UTF-8:;Ayşe;;;/)
  })

  it('e-posta, telefon, web sitesi ekler', () => {
    const form = emptyForm()
    form.firstName = 'Test'
    form.email = 'test@example.com'
    form.phoneCountryCode = '+90'
    form.phone = '0555 123 45 67'
    form.website = 'https://example.com'
    const vcard = buildVCard(form)
    expect(vcard).toContain('EMAIL;CHARSET=UTF-8:test@example.com')
    expect(vcard).toContain('TEL;TYPE=cell;CHARSET=UTF-8:+905551234567')
    expect(vcard).toContain('URL;CHARSET=UTF-8:https://example.com')
  })

  it('web sitesine https ekler (yoksa)', () => {
    const form = emptyForm()
    form.firstName = 'X'
    form.website = 'example.com'
    const vcard = buildVCard(form)
    expect(vcard).toContain('URL;CHARSET=UTF-8:https://example.com')
  })

  it('şirket ve ünvan ekler', () => {
    const form = emptyForm()
    form.firstName = 'A'
    form.company = 'Acme'
    form.title = 'Developer'
    const vcard = buildVCard(form)
    expect(vcard).toContain('ORG;CHARSET=UTF-8:Acme')
    expect(vcard).toContain('TITLE;CHARSET=UTF-8:Developer')
  })

  it('not alanını ekler', () => {
    const form = emptyForm()
    form.firstName = 'A'
    form.note = 'Merhaba dünya'
    const vcard = buildVCard(form)
    expect(vcard).toContain('NOTE;CHARSET=UTF-8:Merhaba dünya')
  })

  it('doldurulmuş sosyal medya URL’lerini ekler', () => {
    const form = emptyForm()
    form.firstName = 'A'
    form.social.linkedin = 'https://linkedin.com/in/user'
    form.social.instagram = 'instagram.com/account'
    const vcard = buildVCard(form)
    expect(vcard).toContain('URL;CHARSET=UTF-8:https://linkedin.com/in/user')
    expect(vcard).toContain('URL;CHARSET=UTF-8:https://instagram.com/account')
  })

  it('boş alanları VCF’e eklemez', () => {
    const form = emptyForm()
    form.firstName = 'Only'
    const vcard = buildVCard(form)
    expect(vcard).not.toMatch(/EMAIL:/)
    expect(vcard).not.toMatch(/TEL;/)
    expect(vcard).not.toMatch(/^ORG:/m)
    expect(vcard).not.toMatch(/^TITLE:/m)
  })

  it('özel karakterleri vCard kurallarına göre escape eder', () => {
    const form = emptyForm()
    form.firstName = 'Ad;Virgül'
    form.lastName = 'Soyad,Test'
    const vcard = buildVCard(form)
    expect(vcard).toContain('\\;')
    expect(vcard).toContain('\\,')
  })

  it('Türkçe karakterleri doğru işler', () => {
    const form = emptyForm()
    form.firstName = 'Çişğ'
    form.lastName = 'ÖÜışİğ'
    const vcard = buildVCard(form)
    expect(vcard).toContain('CHARSET=UTF-8')
    expect(vcard).toContain('FN;CHARSET=UTF-8:Çişğ ÖÜışİğ')
    expect(vcard).toContain('N;CHARSET=UTF-8:ÖÜışİğ;Çişğ;;;')
  })
})

describe('downloadVCard', () => {
  const OriginalURL = globalThis.URL
  beforeEach(() => {
    createObjectURL.mockClear()
    revokeObjectURL.mockClear()
    ;(globalThis as any).URL = class URL {
      static createObjectURL = createObjectURL
      static revokeObjectURL = revokeObjectURL
    }
  })
  afterEach(() => {
    ;(globalThis as any).URL = OriginalURL
  })

  it('Blob oluşturup createObjectURL ve revokeObjectURL çağırır', () => {
    const vcard = 'BEGIN:VCARD\nVERSION:4.0\nFN:Test\nEND:VCARD'
    downloadVCard(vcard, 'test.vcf')
    expect(createObjectURL).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })
})
