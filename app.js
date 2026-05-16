// Active nav highlighting
const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
const sections = ['home','about','projects','skills','contact'].map(id => document.getElementById(id));

const setActive = (id) => {
  navLinks.forEach(a => {
    const isActive = a.getAttribute('data-nav') === id;
    if (isActive) a.classList.add('active');
    else a.classList.remove('active');
  });
};

const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  setActive(visible.target.id);
}, { threshold: [0.2,0.35,0.5,0.65] });

sections.forEach(sec => observer.observe(sec));

// Drawer menu (mobile)
const drawer = document.getElementById('drawer');
const openMenu = document.getElementById('openMenu');

const closeDrawer = () => drawer.classList.remove('show');
openMenu?.addEventListener('click', () => drawer.classList.add('show'));

drawer?.addEventListener('click', (e) => {
  if (e.target === drawer) closeDrawer();
});

document.querySelectorAll('#drawer a[data-nav]').forEach(a => {
  a.addEventListener('click', () => closeDrawer());
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});

// Contact form (simulated)
const form = document.getElementById('contactForm');
const status = document.getElementById('status');

const showStatus = (kind, text) => {
  status.classList.remove('show','good','bad');
  status.textContent = text;
  status.classList.add('show');
  status.classList.add(kind);
};

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  if (!data.name || !data.email || !data.topic || !data.message) {
    showStatus('bad', 'Lengkapi semua kolom sebelum mengirim.');
    return;
  }

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if (!emailLooksValid) {
    showStatus('bad', 'Email tidak valid. Periksa kembali email Anda.');
    return;
  }

  showStatus('good', 'Mengirim pesan...');

  try {
    const resp = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const payload = await resp.json().catch(() => ({}));

    if (!resp.ok || payload?.ok !== true) {
      showStatus('bad', payload?.error || `Gagal mengirim pesan (HTTP ${resp.status}).`);
      return;
    }

    showStatus('good', 'Pesan berhasil terkirim!');
    form.reset();
  } catch (err) {
    console.error(err);
    showStatus('bad', 'Terjadi kesalahan saat mengirim pesan. Pastikan backend berjalan dan URL /api/contact bisa diakses.');
  }
});


document.getElementById('year').textContent = new Date().getFullYear();


