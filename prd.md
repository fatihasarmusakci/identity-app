# 🆔 PROJECT IDENTITY: Documentation & PRD

Bu belge, **Identity** uygulamasının geliştirme sürecindeki ana rehberdir. Bir senior developer perspektifiyle, ürünün vizyonundan teknik detaylarına kadar her şeyi kapsar.

---

## 1. ÜRÜN TANIMI
**Ürün Adı:** Identity  
**Slogan:** *Your digital identity, in a single scan.* **Konsept:** Kullanıcıların hiçbir zorunlu alan olmadan kendi dijital kartvizitlerini (VCF) oluşturup, QR kod ile anlık paylaşabildiği yüksek hızlı web uygulaması.

---

## 2. KULLANICI HİKAYELERİ (User Stories)
- **Hızlı Tanışma:** "Bir etkinlikteyim, telefon numaramı ve LinkedIn hesabımı hızlıca karşımdakine vermek istiyorum."
- **Esnek Paylaşım:** "Sadece Instagram hesabımı içeren bir QR oluşturup profilime koymak istiyorum."
- **Gizlilik Odaklı:** "Hesap açmakla uğraşmadan, verilerimin sunucuda saklanmadığına emin olarak kartvizit oluşturmak istiyorum."

---

## 3. FONKSİYONEL GEREKSİNİMLER

### 3.1. Akıllı Form Yönetimi
- **Zorunluluk Yok:** Formdaki tüm alanlar `optional` (isteğe bağlı) olarak tanımlanacaktır.
- **Validasyon:** E-posta ve URL alanları için basit format kontrolü yapılacaktır.
- **Sosyal Medya Inputları:** Her sosyal medya ikonu için ilgili profil linkini alan özel inputlar bulunacaktır.

### 3.2. VCF Üretimi (Backend/Logic)
- Sistem, girilen verileri **vCard 4.0** formatına dönüştürecektir.
- **Örnek Yapı:**
  ```text
  BEGIN:VCARD
  VERSION:4.0
  N:Soyad;Ad;;;
  FN:Ad Soyad
  TEL;TYPE=cell:0555...
  URL:[https://linkedin.com/in/kullanici](https://linkedin.com/in/kullanici)
  END:VCARD
  
  #