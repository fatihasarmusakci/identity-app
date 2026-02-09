import type { IdentityFormData, SocialKey } from '../types'
import { SOCIAL_KEYS } from '../types'

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function foldLine(line: string, maxLen = 75): string {
  if (line.length <= maxLen) return line
  const parts: string[] = []
  let rest = line
  while (rest.length > maxLen) {
    parts.push(rest.slice(0, maxLen))
    rest = ' ' + rest.slice(maxLen)
  }
  if (rest) parts.push(rest)
  return parts.join('\n')
}

export function buildVCard(data: IdentityFormData): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:4.0']

  const family = (data.lastName || '').trim()
  const given = (data.firstName || '').trim()
  if (family || given) {
    lines.push(foldLine(`N:${escapeVCard(family)};${escapeVCard(given)};;;`))
  }

  const fullName = [given, family].filter(Boolean).join(' ') || 'Unknown'
  lines.push(foldLine(`FN:${escapeVCard(fullName)}`))

  const email = (data.email || '').trim()
  if (email) lines.push(foldLine(`EMAIL:${escapeVCard(email)}`))

  const code = (data.phoneCountryCode || '+90').trim()
  let tel = (data.phone || '').trim().replace(/\s/g, '')
  if (tel) {
    const codeNum = code.replace(/\D/g, '')
    if (codeNum === '90' && tel.startsWith('0')) tel = tel.slice(1)
    const full = code.replace(/^\+/, '') + tel
    lines.push(foldLine(`TEL;TYPE=cell:${escapeVCard('+' + full)}`))
  }

  let url = (data.website || '').trim()
  if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url
  if (url) lines.push(foldLine(`URL:${escapeVCard(url)}`))

  const org = (data.company || '').trim()
  if (org) lines.push(foldLine(`ORG:${escapeVCard(org)}`))

  const title = (data.title || '').trim()
  if (title) lines.push(foldLine(`TITLE:${escapeVCard(title)}`))

  const note = (data.note || '').trim()
  if (note) lines.push(foldLine(`NOTE:${escapeVCard(note)}`))

  for (const key of SOCIAL_KEYS) {
    let socialUrl = (data.social[key] || '').trim()
    if (!socialUrl) continue
    if (!/^https?:\/\//i.test(socialUrl)) socialUrl = 'https://' + socialUrl
    lines.push(foldLine(`URL:${escapeVCard(socialUrl)}`))
  }

  lines.push('END:VCARD')
  return lines.join('\n')
}

export function downloadVCard(vcard: string, filename = 'identity.vcf'): void {
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
