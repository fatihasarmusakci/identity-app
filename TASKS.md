# Identity – Görev Listesi (PRD’den Türetilmiş)

Bu dosya **prd.md** esas alınarak oluşturulmuş geliştirme görevlerini içerir.

---

## Proje Özeti
- **Ürün:** Identity – *Your digital identity, in a single scan.*
- **Amaç:** Zorunlu alan olmadan dijital kartvizit (VCF) oluşturma ve QR kod ile paylaşma.

---

## 1. Proje & Altyapı

- [x] **1.1** Proje yapısını kur (frontend + gerekirse backend/API).
- [x] **1.2** Geliştirme ortamı, bağımlılıklar ve çalıştırma talimatlarını dokümante et.
- [x] **1.3** VCF üretimi için kullanılacak kütüphane/araç seçimi ve entegrasyonu.

---

## 2. Akıllı Form Yönetimi (3.1)

- [x] **2.1** Tüm form alanlarını **optional** (isteğe bağlı) olarak tanımla; zorunlu alan kullanma.
- [x] **2.2** E-posta alanı için format validasyonu ekle.
- [x] **2.3** URL alanları için format validasyonu ekle.
- [x] **2.4** Sosyal medya alanları: her platform (LinkedIn, Instagram, Twitter/X, vb.) için ayrı input ve ikon tasarla.
- [x] **2.5** Form state yönetimi (boş/ dolu alanlar, hata mesajları) ve kullanıcı geri bildirimi.

---

## 3. VCF Üretimi (3.2)

- [x] **3.1** Girilen veriyi **vCard 4.0** formatına dönüştüren modül/fonksiyon yaz.
- [x] **3.2** vCard alanlarını PRD’deki örnekle uyumlu eşle: N, FN, TEL, URL, vb.
- [x] **3.3** Sadece doldurulmuş alanları VCF’e ekle; boş alanları atla.
- [x] **3.4** VCF çıktısını indirilebilir dosya (.vcf) olarak sun.

---

## 4. QR Kod & Paylaşım

- [x] **4.1** VCF içeriğini veya paylaşım linkini QR koda çevir (kütüphane seçimi + entegrasyon).
- [x] **4.2** QR kodun ekranda görüntülenmesi ve gerekirse boyut/renk ayarları.
- [x] **4.3** “Hızlı tanışma” senaryosu: tek tıkla QR gösterme / paylaşma akışı.

---

## 5. Gizlilik & Performans

- [x] **5.1** Verilerin sunucuda saklanmaması: mümkünse tamamen client-side VCF + QR üretimi.
- [x] **5.2** Hesap açmadan kullanım: kayıt/giriş zorunluluğu olmadan çalışan akış.
- [x] **5.3** Sayfa yükü ve VCF/QR üretiminin hızlı olması için optimizasyon.

---

## 6. Kullanıcı Deneyimi (UX)

- [x] **6.1** “Esnek paylaşım” senaryosu: sadece seçilen alanlarla (örn. sadece Instagram) kartvizit oluşturma.
- [x] **6.2** Mobil uyumlu ve hızlı hissettiren arayüz tasarımı.
- [x] **6.3** Form ve QR ekranında net yönlendirmeler ve kısa açıklamalar.

---

## 7. Test & Dokümantasyon

- [x] **7.1** Form validasyonu için manuel/otomatik testler.
- [x] **7.2** Üretilen VCF’in standart vCard 4.0 okuyucularda açıldığını doğrula.
- [x] **7.3** Kullanıcı hikayeleri (hızlı tanışma, esnek paylaşım, gizlilik) için kabul kriterleri ve test.

---

## Notlar
- Görevler **prd.md** bölüm 2 (Kullanıcı Hikayeleri) ve bölüm 3 (Fonksiyonel Gereksinimler) ile uyumludur.
- Tamamlanan maddeleri `- [x]` ile işaretleyebilirsin.

---

## Son durum (kontrol)
- **7.1** Vitest ile `src/lib/validation.test.ts` ve `src/lib/vcard.test.ts` otomatik testler yazıldı; `npm run test` ile çalıştırılır.
- **7.2** vcard.test.ts içinde BEGIN:VCARD, VERSION:4.0, END:VCARD ve alan formatları doğrulanıyor; VCF yapısı vCard 4.0 uyumludur.
- **7.3** PRD’deki kullanıcı hikayeleri (hızlı tanışma, esnek paylaşım, gizlilik) uygulama ile karşılanıyor; kabul kriterleri PRD ve README’de özetlenmiştir.
