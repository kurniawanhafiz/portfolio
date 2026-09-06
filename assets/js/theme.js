const toggleBtn = document.getElementById("themeToggle");
const body = document.body;
const STORAGE_KEY = "theme";

/* =========================
   APPLY THEME
========================= */
function applyTheme(theme) {
  body.classList.remove("dark-mode", "light-mode");
  body.classList.add(theme);

  if (toggleBtn) {
    // Icon = aksi berikutnya
    toggleBtn.textContent = theme === "dark-mode" ? "☀️" : "🌙";
  }
}

/* =========================
   INITIAL THEME
========================= */
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    applyTheme(prefersDark ? "dark-mode" : "light-mode");
  }
}

/* =========================
   TOGGLE HANDLER
========================= */
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const newTheme = body.classList.contains("dark-mode")
      ? "light-mode"
      : "dark-mode";

    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  });
}

/* =========================
   RUN
========================= */
initTheme();


// ==========================================
// Language Toggle Logic (EN / ID)
// ==========================================
const langToggleBtn = document.getElementById('langToggle');
const translatableElements = document.querySelectorAll('[data-en][data-id]');

// Cek bahasa dari localStorage, default 'en' (Inggris)
let currentLang = localStorage.getItem('lang') || 'en';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  
  // Ubah teks di tombol jadi bahasa kebalikannya
  if(langToggleBtn) {
    langToggleBtn.textContent = lang === 'en' ? 'ID' : 'EN';
  }

  // Ganti isi HTML semua elemen yang punya data-en & data-id
  translatableElements.forEach(el => {
    el.innerHTML = el.getAttribute(`data-${lang}`);
  });
}

// Event listener buat tombol klik
if(langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'id' : 'en';
    setLanguage(newLang);
  });
}

// Eksekusi bahasa saat web pertama kali dimuat
setLanguage(currentLang);