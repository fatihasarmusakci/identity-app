export interface IdentityFormData {
  firstName: string
  lastName: string
  email: string
  phoneCountryCode: string
  phone: string
  website: string
  company: string
  title: string
  note: string
  social: Record<SocialKey, string>
}

/** Country phone code: [code, country name] */
export const COUNTRY_PHONE_CODES: [string, string][] = [
  ['+1', 'USA / Canada'],
  ['+44', 'United Kingdom'],
  ['+90', 'Turkey'],
  ['+49', 'Germany'],
  ['+33', 'France'],
  ['+31', 'Netherlands'],
  ['+32', 'Belgium'],
  ['+41', 'Switzerland'],
  ['+43', 'Austria'],
  ['+34', 'Spain'],
  ['+39', 'Italy'],
  ['+46', 'Sweden'],
  ['+47', 'Norway'],
  ['+45', 'Denmark'],
  ['+358', 'Finland'],
  ['+48', 'Poland'],
  ['+7', 'Russia'],
  ['+971', 'UAE'],
  ['+966', 'Saudi Arabia'],
  ['+994', 'Azerbaijan'],
  ['+998', 'Uzbekistan'],
  ['+993', 'Turkmenistan'],
  ['+996', 'Kyrgyzstan'],
  ['+992', 'Tajikistan'],
  ['+374', 'Armenia'],
  ['+995', 'Georgia'],
  ['+98', 'Iran'],
  ['+964', 'Iraq'],
  ['+963', 'Syria'],
  ['+961', 'Lebanon'],
  ['+962', 'Jordan'],
  ['+972', 'Israel'],
  ['+20', 'Egypt'],
  ['+212', 'Morocco'],
  ['+213', 'Algeria'],
]

export type SocialKey =
  | 'linkedin'
  | 'instagram'
  | 'twitter'
  | 'github'
  | 'youtube'
  | 'facebook'
  | 'tiktok'

export const SOCIAL_KEYS: SocialKey[] = [
  'linkedin',
  'instagram',
  'twitter',
  'github',
  'youtube',
  'facebook',
  'tiktok',
]

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  twitter: 'X (Twitter)',
  github: 'GitHub',
  youtube: 'YouTube',
  facebook: 'Facebook',
  tiktok: 'TikTok',
}

export interface FieldErrors {
  email?: string
  website?: string
  [key: string]: string | undefined
}
