# MyPorto Contact Email (Real)

Form kontak di `index.html` sekarang mengirim pesan **beneran** ke email menggunakan backend Node.js.

## 1) Konfigurasi
1. Buat file `.env` dari `.env.example`
2. Isi nilai berikut:
   - `SMTP_USER` = email Gmail Anda (mis: fmardio8@gmail.com)
   - `SMTP_PASS` = **Gmail App Password**
   - `MAIL_TO` = email tujuan (mis: fmardio8@gmail.com)

> Catatan penting: untuk Gmail, password biasanya harus **App Password** (bukan password akun biasa).

## 2) Jalankan backend
```bash
npm start
```
Default server jalan di: `http://localhost:3000`

## 3) Test
1. Jalankan server
2. Buka `index.html` di browser (pastikan request form ke `/api/contact` mengarah ke backend yang sama domain/port)
3. Isi form kontak → harus muncul status “Pesan berhasil terkirim!”

## Troubleshooting (umum)
- Jika email tidak terkirim, cek log terminal dari `server.js`.
- Pastikan App Password Gmail aktif dan SMTP settings benar.

