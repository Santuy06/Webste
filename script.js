// =====================================================
// Dropdown Menu – Click to Toggle
// =====================================================
const navItems = document.querySelectorAll('.nav-item.has-dropdown');

function closeAllDropdowns() {
  navItems.forEach(item => item.classList.remove('open'));
}

navItems.forEach(item => {
  const trigger = item.querySelector('.nav-link');
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = item.classList.contains('open');
    closeAllDropdowns();
    if (!isOpen) item.classList.add('open');
  });
});

// Klik di luar navbar → tutup semua dropdown
document.addEventListener('click', () => closeAllDropdowns());

// Scroll → tutup semua dropdown
window.addEventListener('scroll', () => closeAllDropdowns(), { passive: true });

// =====================================================
// Data dummy untuk Spotlight Search
// =====================================================
const searchData = [
  { title: 'Pendaftaran Online PPDB 2024/2025', url: '#ppdb-section' },
  { title: 'Jadwal Penerimaan Peserta Didik Baru', url: '#' },
  { title: 'Pengumuman Kelulusan Administrasi PPDB', url: '#' },
  { title: 'Kurikulum Merdeka Belajar', url: '#' },
  { title: 'Tenaga Pendidik dan Kependidikan', url: '#' },
  { title: 'Sarana Prasarana Sekolah', url: '#' },
  { title: 'Visi dan Misi SMAN 1 Bantarbolang', url: '#' },
  { title: 'Sejarah Sekolah', url: '#' },
  { title: 'Struktur Organisasi', url: '#' },
  { title: 'Berita Terkini Sekolah', url: '#' },
  { title: 'Agenda dan Kegiatan Sekolah', url: '#' },
  { title: 'Galeri Foto Kegiatan', url: '#' },
  { title: 'Ekstrakurikuler SMAN 1 Bantarbolang', url: '#' },
  { title: 'Prestasi Akademik Siswa', url: '#' },
  { title: 'Kontak dan Lokasi Sekolah', url: '#' },
];

// =====================================================
// Spotlight Search
// =====================================================
const spotlightOverlay = document.getElementById('spotlightOverlay');
const spotlightInput   = document.getElementById('spotlightInput');
const spotlightResults = document.getElementById('spotlightResults');
const spotlightClose   = document.getElementById('spotlightClose');
const searchTrigger    = document.getElementById('searchTrigger');

const searchIcon = `<svg class="sr-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
</svg>`;

function openSpotlight() {
  spotlightOverlay.classList.add('open');
  setTimeout(() => spotlightInput.focus(), 80);
}

function closeSpotlight() {
  spotlightOverlay.classList.remove('open');
  spotlightInput.value = '';
  spotlightResults.innerHTML = '';
}

function renderSpotlightResults(query) {
  spotlightResults.innerHTML = '';
  if (!query.trim()) return;

  const q = query.toLowerCase();
  const filtered = searchData.filter(item => item.title.toLowerCase().includes(q));

  if (filtered.length === 0) {
    spotlightResults.innerHTML = `<div class="spotlight-empty">Tidak ada hasil untuk "<em>${query}</em>"</div>`;
    return;
  }

  filtered.slice(0, 7).forEach(item => {
    const div = document.createElement('div');
    div.className = 'spotlight-result-item';
    const highlighted = item.title.replace(
      new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
      match => `<mark>${match}</mark>`
    );
    div.innerHTML = `${searchIcon}<span>${highlighted}</span>`;
    div.addEventListener('click', () => {
      window.location.href = item.url;
      closeSpotlight();
    });
    spotlightResults.appendChild(div);
  });
}

// Buka spotlight dengan klik tombol search
searchTrigger.addEventListener('click', openSpotlight);

// Tutup dengan tombol ESC label
spotlightClose.addEventListener('click', closeSpotlight);

// Input event
spotlightInput.addEventListener('input', () => {
  renderSpotlightResults(spotlightInput.value);
});

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
  // Ctrl + K / Cmd + K = buka spotlight (shortcut modern)
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    if (spotlightOverlay.classList.contains('open')) {
      closeSpotlight();
    } else {
      openSpotlight();
    }
  }
  // ESC = tutup spotlight
  if (e.key === 'Escape') {
    if (spotlightOverlay.classList.contains('open')) closeSpotlight();
    else closeModal();
  }
});

// Klik backdrop di luar spotlight-inner = tutup
spotlightOverlay.addEventListener('click', (e) => {
  if (e.target === spotlightOverlay) closeSpotlight();
});

// =====================================================
// Modal Popup
// =====================================================
const modalBackdrop  = document.getElementById('modalBackdrop');
const modalCloseBtn  = document.getElementById('modalCloseBtn');
const btnCekStatus   = document.getElementById('btnCekStatus');
const btnUnduhDaftar = document.getElementById('btnUnduhDaftar');

function closeModal() {
  modalBackdrop.classList.add('hidden');
}

modalCloseBtn.addEventListener('click', closeModal);

btnCekStatus.addEventListener('click', () => {
  closeModal();
  document.getElementById('ppdb-section').scrollIntoView({ behavior: 'smooth' });
});

btnUnduhDaftar.addEventListener('click', () => {
  closeModal();
  showToast('File daftar lulus sedang dipersiapkan. Silakan cek kembali nanti.', 'warning');
});

// =====================================================
// Toast Notification System (Custom Output UI Control)
// =====================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return; // Berlaku jika berada di halaman yang tidak memiliki container (index.html bisa ditambahkan)

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      ${type === 'success' ? '✓' : type === 'warning' ? '!' : 'i'}
    </div>
    <div class="toast-msg">${message}</div>
    <button class="toast-close">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger animasi masuk
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove setelah 4 detik
  const timer = setTimeout(() => hideToast(toast), 4000);

  // Close button
  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(timer);
    hideToast(toast);
  });
}

function hideToast(toast) {
  toast.classList.remove('show');
  setTimeout(() => toast.remove(), 300);
}

// =====================================================
// Form PPDB Interaction (Simulasi external.html)
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileKK');
  const fileNameDisp = document.getElementById('fileNameDisp');
  const ppdbForm = document.getElementById('ppdbForm');

  // Custom File Upload Visual Feedback
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      if (this.files && this.files.length > 0) {
        fileNameDisp.textContent = this.files[0].name;
        fileNameDisp.style.color = '#0b2346';
        fileNameDisp.style.fontWeight = '600';
      } else {
        fileNameDisp.textContent = 'Belum ada file terpilih (PDF, JPG)';
        fileNameDisp.style.color = '#8090a8';
        fileNameDisp.style.fontWeight = '400';
      }
    });
  }

  // Validasi Form dan Submit Feedback
  if (ppdbForm) {
    ppdbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btnSubmit = document.getElementById('btnSubmitForm');
      btnSubmit.innerHTML = '<span class="loading-spinner"></span> Memproses...';
      btnSubmit.disabled = true;

      // Simulasi proses network
      setTimeout(() => {
        showToast('Pendaftaran berhasil dikirim! Silakan cek email secara berkala.', 'success');
        ppdbForm.reset();
        
        if (fileNameDisp) {
          fileNameDisp.textContent = 'Belum ada file terpilih (PDF, JPG)';
          fileNameDisp.style.color = '#8090a8';
          fileNameDisp.style.fontWeight = '400';
        }

        btnSubmit.innerHTML = 'Kirim Pendaftaran';
        btnSubmit.disabled = false;

        // Ubah state stepper ke selesai
        const steps = document.querySelectorAll('.stepper-ui .step');
        if(steps.length > 0) {
          steps.forEach(s => s.classList.add('active'));
        }
      }, 1500);
    });
  }
});

// Klik backdrop modal = tutup
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});