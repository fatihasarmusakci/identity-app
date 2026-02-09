# Identity

**Your digital identity, in a single scan.**

Zorunlu alan olmadan dijital kartvizit (VCF) oluşturup QR kod ile paylaşabileceğiniz, tamamen istemci taraflı çalışan bir web uygulaması.

## Özellikler

- **Tüm alanlar isteğe bağlı** — Sadece paylaşmak istediğiniz bilgileri girin.
- **vCard 4.0** — Girilen veriler standart VCF formatında üretilir.
- **QR kod** — Kartvizit tek taramada paylaşılabilir.
- **Gizlilik** — Veriler sunucuya gönderilmez; her şey tarayıcıda işlenir.
- **Hesap yok** — Kayıt veya giriş gerekmez.

## Gereksinimler

- Node.js 18+
- npm veya yarn

## Kurulum ve çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (http://localhost:5173)
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview
```

## Proje yapısı

```
devo/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── prd.md
├── TASKS.md
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types.ts
    ├── components/
    │   └── IdentityForm.tsx
    └── lib/
        ├── validation.ts   # E-posta ve URL validasyonu
        └── vcard.ts        # vCard 4.0 üretimi ve indirme
```

## Teknolojiler

- **Vite** — Hızlı geliştirme ve build
- **React 18** + **TypeScript**
- **qrcode.react** — QR kod üretimi (client-side)
- VCF üretimi için harici kütüphane yok; vCard 4.0 metni elle oluşturulur.

## Lisans

MIT
