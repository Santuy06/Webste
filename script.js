// =====================================================
// Dropdown Menu – Click to Toggle & Accessibility
// =====================================================
const navItems = document.querySelectorAll('.nav-item.has-dropdown');

function closeAllDropdowns() {
  navItems.forEach(item => {
    item.classList.remove('open');
    const trigger = item.querySelector('.nav-link');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

navItems.forEach(item => {
  const trigger = item.querySelector('.nav-link');
  if (!trigger) return;
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = item.classList.contains('open');
    closeAllDropdowns();
    if (!isOpen) {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
  
  // Keyboard Accessibility
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      trigger.click();
    }
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
  searchTrigger.setAttribute('aria-expanded', 'true');
  setTimeout(() => spotlightInput.focus(), 80);
}

function closeSpotlight() {
  spotlightOverlay.classList.remove('open');
  searchTrigger.setAttribute('aria-expanded', 'false');
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
      const originalText = btnSubmit.innerHTML;
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

        btnSubmit.innerHTML = originalText;
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
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
}

// =====================================================
// I18N (Internationalization) & L10N (Localization)
// =====================================================
const i18nDict = {
  id: {
    // index.html
    search_placeholder: "Cari berita, program, PPDB…",
    search_hint: "Tekan <kbd>Enter</kbd> untuk cari · <kbd>Esc</kbd> untuk tutup",
    btn_close_search: "ESC",
    nav_profil: "Profil",
    nav_akademik: "Akademik",
    nav_informasi: "Informasi Publik",
    nav_ppdb: "PPDB",
    btn_cta_ppdb: "PPDB 2024/2025 &rsaquo;",
    hero_title: "Selamat Datang di<br>SMAN 1 Bantarbolang",
    hero_desc: "Pendaftaran online untuk wilayah Bantarbolang. Selamat Datang di portal resmi penerimaan peserta didik baru (PPDB) SMAN 1 Bantarbolang.",
    btn_learn_more: "Learn More &rsaquo;",
    ppdb_highlight: "PPDB",
    ppdb_title: "Pendaftaran Online",
    btn_portal_ppdb: "Portal PPDB Dinas Pendidikan",
    badge_new_tab: "Tab Baru",
    // external.html
    portal_title: "Portal PPDB Online Terpadu",
    portal_desc: "Silakan lengkapi formulir pendaftaran di bawah ini. Pastikan data yang diinput sesuai dengan dokumen asli.",
    step_data: "Data Diri",
    step_berkas: "Berkas",
    step_selesai: "Selesai",
    lbl_nisn: "NISN",
    ph_nisn: "Masukkan 10 digit NISN",
    err_nisn: "Format NISN tidak valid (harus 10 angka).",
    lbl_nama: "Nama Lengkap",
    ph_nama: "Sesuai Ijazah/Akte Kelahiran",
    lbl_jalur: "Jalur Pendaftaran",
    opt_jalur_pilih: "-- Pilih Jalur --",
    opt_zonasi: "Zonasi",
    opt_prestasi: "Prestasi",
    opt_afirmasi: "Afirmasi",
    opt_pindah: "Perpindahan Orang Tua",
    lbl_jk: "Jenis Kelamin",
    radio_l: "Laki-laki",
    radio_p: "Perempuan",
    lbl_kk: "Unggah Kartu Keluarga (KK)",
    btn_pilih_file: "Pilih File",
    txt_belum_pilih: "Belum ada file terpilih (PDF, JPG)",
    btn_batal: "Batal",
    btn_kirim: "Kirim Pendaftaran"
  },
  en: {
    // index.html
    search_placeholder: "Search news, programs, admissions…",
    search_hint: "Press <kbd>Enter</kbd> to search · <kbd>Esc</kbd> to close",
    btn_close_search: "ESC",
    nav_profil: "Profile",
    nav_akademik: "Academic",
    nav_informasi: "Public Info",
    nav_ppdb: "Admissions",
    btn_cta_ppdb: "Admissions 2024/2025 &rsaquo;",
    hero_title: "Welcome to<br>SMAN 1 Bantarbolang",
    hero_desc: "Online registration for Bantarbolang region. Welcome to the official portal for new student admissions at SMAN 1 Bantarbolang.",
    btn_learn_more: "Learn More &rsaquo;",
    ppdb_highlight: "Admissions",
    ppdb_title: "Online Registration",
    btn_portal_ppdb: "Education Dept Admissions Portal",
    badge_new_tab: "New Tab",
    // external.html
    portal_title: "Integrated Online Admissions Portal",
    portal_desc: "Please complete the registration form below. Ensure the inputted data matches your original documents.",
    step_data: "Personal Data",
    step_berkas: "Documents",
    step_selesai: "Complete",
    lbl_nisn: "Student ID (NISN)",
    ph_nisn: "Enter 10 digit NISN",
    err_nisn: "Invalid NISN format (must be 10 digits).",
    lbl_nama: "Full Name",
    ph_nama: "As per Birth Certificate",
    lbl_jalur: "Admission Path",
    opt_jalur_pilih: "-- Select Path --",
    opt_zonasi: "Zoning",
    opt_prestasi: "Achievement",
    opt_afirmasi: "Affirmation",
    opt_pindah: "Parental Transfer",
    lbl_jk: "Gender",
    radio_l: "Male",
    radio_p: "Female",
    lbl_kk: "Upload Family Card (KK)",
    btn_pilih_file: "Choose File",
    txt_belum_pilih: "No file chosen (PDF, JPG)",
    btn_batal: "Cancel",
    btn_kirim: "Submit Registration"
  }
};

function changeLanguage(lang) {
  document.documentElement.lang = lang;
  
  // Update button active state
  document.querySelectorAll('.btn-lang').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(lang === 'id' ? 'langID' : 'langEN');
  if (activeBtn) activeBtn.classList.add('active');

  const dict = i18nDict[lang];
  if (!dict) return;

  // Translate text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.innerHTML = dict[key]; // use innerHTML for <br> and <kbd>
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.setAttribute('placeholder', dict[key]);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const btnID = document.getElementById('langID');
  const btnEN = document.getElementById('langEN');

  if (btnID) btnID.addEventListener('click', () => changeLanguage('id'));
  if (btnEN) btnEN.addEventListener('click', () => changeLanguage('en'));
});

// =====================================================
// Accessibility Widget Logic (Slider, Themes, TTS)
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  const a11yToggle = document.getElementById('a11yToggle');
  const a11yMenu = document.getElementById('a11yMenu');
  const a11yClose = document.getElementById('a11yClose');
  const btnReadText = document.getElementById('btnReadText');
  const textSizeSlider = document.getElementById('textSizeSlider');
  const textSizeVal = document.getElementById('textSizeVal');
  const themeBtns = document.querySelectorAll('.theme-btn');

  if (!a11yToggle || !a11yMenu) return;

  // Toggle Menu
  const toggleMenu = (e) => {
    if (e) e.stopPropagation();
    const isOpen = a11yMenu.classList.contains('open');
    if (isOpen) {
      a11yMenu.classList.remove('open');
      a11yMenu.setAttribute('aria-hidden', 'true');
      a11yToggle.setAttribute('aria-expanded', 'false');
    } else {
      a11yMenu.classList.add('open');
      a11yMenu.setAttribute('aria-hidden', 'false');
      a11yToggle.setAttribute('aria-expanded', 'true');
    }
  };

  a11yToggle.addEventListener('click', toggleMenu);
  if (a11yClose) a11yClose.addEventListener('click', toggleMenu);

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!a11yToggle.contains(e.target) && !a11yMenu.contains(e.target)) {
      a11yMenu.classList.remove('open');
      a11yMenu.setAttribute('aria-hidden', 'true');
      a11yToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Text Size Slider
  if (textSizeSlider && textSizeVal) {
    textSizeSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      textSizeVal.textContent = val + '%';
      
      // Menggunakan CSS zoom agar semua elemen (px, em, dll) ikut membesar proporsional
      // dan tidak merusak layout.
      document.body.style.zoom = val + '%';
      
      // Agar popup aksesibilitas TIDAK ikut membesar (tetap ukuran normal)
      // Kita harus menetralisir efek zoom dari body dengan membaginya kembali.
      const widget = document.querySelector('.a11y-widget');
      if (widget) {
        const reverseZoom = (10000 / parseInt(val));
        widget.style.zoom = reverseZoom + '%';
      }
    });
  }

  // Theme Switcher
  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const theme = e.target.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', theme); // Set di HTML tag
      
      // Update active state
      themeBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // Text to Speech (Read Page)
  let isReading = false;
  if (btnReadText) {
    btnReadText.addEventListener('click', () => {
      if (!('speechSynthesis' in window)) {
        showToast('Browser Anda tidak mendukung fitur baca teks (TTS).', 'warning');
        return;
      }

      if (isReading) {
        window.speechSynthesis.cancel();
        isReading = false;
        btnReadText.innerHTML = '<span aria-hidden="true" class="tts-icon">🔊</span> <span class="tts-text">Bacakan Halaman</span>';
      } else {
        let textToRead = "";
        const hero = document.querySelector('.hero-content');
        const ppdb = document.querySelector('.ppdb-info');
        const portal = document.querySelector('.portal-header');
        
        if (hero) textToRead += hero.innerText + ". ";
        if (ppdb) textToRead += ppdb.innerText + ". ";
        if (portal) textToRead += portal.innerText + ". ";

        if (!textToRead.trim()) {
          textToRead = document.body.innerText;
        }

        const utterance = new SpeechSynthesisUtterance(textToRead);
        const currentLang = document.documentElement.lang === 'en' ? 'en-US' : 'id-ID';
        utterance.lang = currentLang;
        utterance.rate = 0.9;

        utterance.onend = () => {
          isReading = false;
          btnReadText.innerHTML = '<span aria-hidden="true" class="tts-icon">🔊</span> <span class="tts-text">Bacakan Halaman</span>';
        };

        window.speechSynthesis.speak(utterance);
        isReading = true;
        btnReadText.innerHTML = '<span aria-hidden="true" class="tts-icon">🔇</span> <span class="tts-text">Berhenti Membaca</span>';
      }
    });
  }
});