const path = require('path');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, topic, message } = req.body || {};

    // Validasi minimal
    if (!name || !email || !topic || !message) {
      return res.status(400).json({ ok: false, error: 'Missing required fields.' });
    }

    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailLooksValid) {
      return res.status(400).json({ ok: false, error: 'Invalid email.' });
    }

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      SMTP_SECURE,
      MAIL_TO
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_TO) {
      return res.status(500).json({ ok: false, error: 'Server email not configured. Check .env.' });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: String(SMTP_SECURE).toLowerCase() === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const subject = `[Contact] ${topic} — ${name}`;
    const text = [
      `Nama: ${name}`,
      `Email: ${email}`,
      `Topik: ${topic}`,
      '',
      'Pesan:',
      message
    ].join('\n');

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.4;">
        <h3 style="margin:0 0 12px;">${subject}</h3>
        <p><b>Nama:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Topik:</b> ${escapeHtml(topic)}</p>
        <hr />
        <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: SMTP_USER,
      to: MAIL_TO,
      replyTo: email,
      subject,
      text,
      html
    });

    return res.json({ ok: true, id: info.messageId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Failed to send email.' });
  }
});

// Serve file statis (opsional kalau ingin buka via backend)
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
}

