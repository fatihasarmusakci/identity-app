const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i

export function isValidEmail(value: string): boolean {
  if (!value.trim()) return true
  return EMAIL_REGEX.test(value.trim())
}

export function isValidUrl(value: string): boolean {
  if (!value.trim()) return true
  const v = value.trim()
  if (!/^https?:\/\//i.test(v)) return URL_REGEX.test('https://' + v)
  return URL_REGEX.test(v)
}

export function getEmailError(value: string): string | undefined {
  if (!value.trim()) return undefined
  if (!isValidEmail(value)) return 'Please enter a valid email address.'
  return undefined
}

export function getUrlError(value: string): string | undefined {
  if (!value.trim()) return undefined
  if (!isValidUrl(value)) return 'Please enter a valid URL (e.g. https://...).'
  return undefined
}
