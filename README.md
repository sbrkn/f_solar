# Next.js + Firebase + Google Drive PWA Starter

Bu repo, AppFlowy benzeri bir collaboration workspace için hızlı başlangıç şablonudur.

## Dahil Olan Yapı

- Next.js App Router (TypeScript strict)
- Tailwind CSS + Shadcn tarzı temel UI bileşenleri
- Firebase istemci kurulumu (Auth, Firestore, Storage)
- Google Drive OAuth başlangıç servisi
- Doküman CRUD API iskeleti
- PWA manifest + service worker

## Klasör Yapısı

```text
src/
  app/
    (auth)/login
    (auth)/signup
    (dashboard)/dashboard
    api/documents
    api/sync
  components/
    ui/
    workspace/
  lib/
    firebase/
    google-drive/
    hooks/
  services/
public/
```

## Başlatma

```bash
npm install
npm run dev
```

## Environment

`.env.example` dosyasını `.env.local` olarak kopyalayın ve Firebase + Google Drive değerlerini ekleyin.

## Yol Haritası (Önerilen)

1. Firestore security rules
2. Role-based workspace permissions
3. Rich text editor + cross-linking
4. Background sync queue (IndexedDB)
5. Web Push notifications
