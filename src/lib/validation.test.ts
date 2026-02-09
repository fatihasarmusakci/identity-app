import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isValidUrl,
  getEmailError,
  getUrlError,
} from './validation'

describe('validation', () => {
  describe('isValidEmail', () => {
    it('boş veya sadece boşluk için true döner (optional alan)', () => {
      expect(isValidEmail('')).toBe(true)
      expect(isValidEmail('   ')).toBe(true)
    })
    it('geçerli e-posta adresleri için true döner', () => {
      expect(isValidEmail('a@b.co')).toBe(true)
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('first.last@domain.org')).toBe(true)
      expect(isValidEmail('  user@test.tr  ')).toBe(true)
    })
    it('geçersiz e-posta adresleri için false döner', () => {
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('user')).toBe(false)
      expect(isValidEmail('user@domain')).toBe(false)
      expect(isValidEmail('user domain@x.com')).toBe(false)
    })
  })

  describe('getEmailError', () => {
    it('boş değer için undefined döner', () => {
      expect(getEmailError('')).toBeUndefined()
      expect(getEmailError('   ')).toBeUndefined()
    })
    it('geçerli e-posta için undefined döner', () => {
      expect(getEmailError('ok@test.com')).toBeUndefined()
    })
    it('geçersiz e-posta için Türkçe hata mesajı döner', () => {
      expect(getEmailError('invalid')).toBe('Please enter a valid email address.')
    })
  })

  describe('isValidUrl', () => {
    it('boş veya sadece boşluk için true döner (optional alan)', () => {
      expect(isValidUrl('')).toBe(true)
      expect(isValidUrl('   ')).toBe(true)
    })
    it('geçerli URL’ler için true döner', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://sub.domain.org/path')).toBe(true)
      expect(isValidUrl('https://linkedin.com/in/user')).toBe(true)
      expect(isValidUrl('example.com')).toBe(true)
      expect(isValidUrl('  https://x.com  ')).toBe(true)
    })
    it('geçersiz URL’ler için false döner', () => {
      expect(isValidUrl('not a url')).toBe(false)
      expect(isValidUrl('htp://wrong.com')).toBe(false)
    })
  })

  describe('getUrlError', () => {
    it('boş değer için undefined döner', () => {
      expect(getUrlError('')).toBeUndefined()
      expect(getUrlError('   ')).toBeUndefined()
    })
    it('geçerli URL için undefined döner', () => {
      expect(getUrlError('https://example.com')).toBeUndefined()
      expect(getUrlError('linkedin.com/in/me')).toBeUndefined()
    })
    it('geçersiz URL için Türkçe hata mesajı döner', () => {
      expect(getUrlError('not a url')).toBe('Please enter a valid URL (e.g. https://...).')
    })
  })
})
