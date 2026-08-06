/**
 * AuthShield v2 - Premium Interactive Logic
 * Handles validation, password strength, particles, tab slider,
 * localStorage auth engine, theme, and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ───── DOM References ─────
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabSlider = document.getElementById('tabSlider');
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  const regPassword = document.getElementById('regPassword');
  const regPassword2 = document.getElementById('regPassword2');
  const regUsername = document.getElementById('regUsername');
  const regEmail = document.getElementById('regEmail');
  const strengthLabel = document.getElementById('strengthLabel');
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');
  const bar3 = document.getElementById('bar3');
  const modeText = document.getElementById('modeText');
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  const githubAuthBtn = document.getElementById('githubAuthBtn');
  const googleAuthBtn = document.getElementById('googleAuthBtn');

  // Password requirement items
  const reqLen = document.getElementById('reqLen');
  const reqUpper = document.getElementById('reqUpper');
  const reqNum = document.getElementById('reqNum');
  const reqSpec = document.getElementById('reqSpec');

  // Validation icons
  const usernameValidIcon = document.getElementById('usernameValidIcon');
  const emailValidIcon = document.getElementById('emailValidIcon');
  const confirmValidIcon = document.getElementById('confirmValidIcon');

  let isPhpAvailable = false;

  // ───── URL Message Handling ─────
  const urlParams = new URLSearchParams(window.location.search);
  const msgParam = urlParams.get('msg');
  if (msgParam) showToast(msgParam, 'success');

  // ───── PHP Backend Detection ─────
  checkBackendAvailability();

  async function checkBackendAvailability() {
    try {
      if (window.location.protocol === 'file:') {
        isPhpAvailable = false;
      } else {
        const response = await fetch('db.php');
        if (response.ok) {
          const text = await response.text();
          isPhpAvailable = !text.includes('<?php');
        } else {
          isPhpAvailable = false;
        }
      }
    } catch (e) {
      isPhpAvailable = false;
    }
    modeText.textContent = isPhpAvailable ? 'PHP & MySQL Server' : 'Client Storage Demo';
  }

  // ───── Floating Particles Generator ─────
  function generateParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (8 + Math.random() * 12) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
      p.style.opacity = 0.15 + Math.random() * 0.35;
      container.appendChild(p);
    }
  }
  generateParticles();

  // ───── Tab Switching with Slider ─────
  loginTab.addEventListener('click', () => switchTab('login'));
  registerTab.addEventListener('click', () => switchTab('register'));

  function switchTab(tabName) {
    const isLogin = tabName === 'login';

    loginTab.classList.toggle('active', isLogin);
    registerTab.classList.toggle('active', !isLogin);
    loginTab.setAttribute('aria-selected', isLogin);
    registerTab.setAttribute('aria-selected', !isLogin);

    // Slide indicator
    tabSlider.classList.toggle('right', !isLogin);

    // Animate form transition
    const showForm = isLogin ? loginForm : registerForm;
    const hideForm = isLogin ? registerForm : loginForm;

    hideForm.style.display = 'none';
    showForm.style.display = 'block';
    showForm.style.animation = 'none';
    showForm.offsetHeight; // Force reflow
    showForm.style.animation = 'formSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both';

    // Auto focus first input
    const firstInput = showForm.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  // ───── Password Visibility Toggle ─────
  document.querySelectorAll('.password-toggle').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      button.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" style="width:18px;"></i>`;
      lucide.createIcons();
    });
  });

  // ───── Live Password Strength Checker ─────
  if (regPassword) {
    regPassword.addEventListener('input', () => {
      const val = regPassword.value;
      const score = calculatePasswordStrength(val);
      updateStrengthUI(score);
      updateRequirements(val);
      validateConfirmPassword();
    });
  }

  function calculatePasswordStrength(pw) {
    if (!pw || pw.length < 2) return 0;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 3);
  }

  function updateStrengthUI(score) {
    const bars = [bar1, bar2, bar3];
    bars.forEach(b => b.className = 'strength-bar');

    const levels = [
      { label: '—', color: 'var(--text-subtle)' },
      { label: 'Weak', color: 'var(--accent-danger)', cls: 'weak' },
      { label: 'Medium', color: 'var(--accent-warning)', cls: 'medium' },
      { label: 'Strong', color: 'var(--accent-success)', cls: 'strong' }
    ];

    const level = levels[score];
    strengthLabel.textContent = level.label;
    strengthLabel.style.color = level.color;

    for (let i = 0; i < score; i++) {
      bars[i].classList.add(level.cls, 'active');
    }
  }

  function updateRequirements(pw) {
    toggleReq(reqLen, pw.length >= 6);
    toggleReq(reqUpper, /[A-Z]/.test(pw));
    toggleReq(reqNum, /[0-9]/.test(pw));
    toggleReq(reqSpec, /[^A-Za-z0-9]/.test(pw));
  }

  function toggleReq(el, met) {
    if (el) el.classList.toggle('met', met);
  }

  // ───── Live Input Validation ─────
  if (regUsername) {
    regUsername.addEventListener('input', () => {
      const val = regUsername.value.trim();
      const valid = /^[a-zA-Z0-9_]{3,30}$/.test(val);
      setValidation(regUsername, usernameValidIcon, val.length > 0 ? valid : null);
    });
  }

  if (regEmail) {
    regEmail.addEventListener('input', () => {
      const val = regEmail.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      setValidation(regEmail, emailValidIcon, val.length > 0 ? valid : null);
    });
  }

  if (regPassword2) {
    regPassword2.addEventListener('input', validateConfirmPassword);
  }

  function validateConfirmPassword() {
    if (!regPassword2 || !regPassword) return;
    const val = regPassword2.value;
    if (val.length === 0) {
      setValidation(regPassword2, confirmValidIcon, null);
      return;
    }
    setValidation(regPassword2, confirmValidIcon, val === regPassword.value);
  }

  function setValidation(input, icon, isValid) {
    input.classList.remove('valid', 'invalid');
    if (icon) {
      icon.classList.remove('show', 'success', 'error');
      icon.innerHTML = '';
    }

    if (isValid === null) return;

    if (isValid) {
      input.classList.add('valid');
      if (icon) {
        icon.innerHTML = '<i data-lucide="check" style="width:16px;"></i>';
        icon.classList.add('show', 'success');
      }
    } else {
      input.classList.add('invalid');
      if (icon) {
        icon.innerHTML = '<i data-lucide="x" style="width:16px;"></i>';
        icon.classList.add('show', 'error');
      }
    }
    lucide.createIcons();
  }

  // ───── Local Storage Database ─────
  function getStoredUsers() {
    return JSON.parse(localStorage.getItem('auth_users') || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem('auth_users', JSON.stringify(users));
  }

  // Seed demo account
  if (getStoredUsers().length === 0) {
    saveUsers([{
      username: 'demo',
      email: 'demo@example.com',
      password: 'password123',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }]);
  }

  // ───── Register Handler ─────
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = regUsername.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value;
    const password2 = regPassword2.value;

    if (!username || !email || !password || !password2) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      showToast('Username: 3-30 characters (letters, numbers, _)', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (password !== password2) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const btn = document.getElementById('registerSubmitBtn');
    btn.classList.add('loading');

    // Simulate loading delay for UX polish
    await sleep(800);

    if (isPhpAvailable) {
      try {
        const formData = new FormData(registerForm);
        const res = await fetch('register.php', { method: 'POST', body: formData });
        const data = await res.json();
        btn.classList.remove('loading');
        showToast(data.message, data.success ? 'success' : 'error');
        if (data.success) { switchTab('login'); registerForm.reset(); updateStrengthUI(0); }
      } catch (err) {
        btn.classList.remove('loading');
        showToast('Server error. Using client mode.', 'warning');
      }
      return;
    }

    // Client mode
    const users = getStoredUsers();
    const exists = users.some(u =>
      u.username.toLowerCase() === username.toLowerCase() ||
      u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      btn.classList.remove('loading');
      showToast('Username or email already taken', 'error');
      return;
    }

    users.push({
      username, email, password,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    saveUsers(users);

    btn.classList.remove('loading');
    showToast('Account created! Sign in now.', 'success');
    registerForm.reset();
    updateStrengthUI(0);
    updateRequirements('');
    switchTab('login');
    document.getElementById('loginIdentifier').value = username;
  });

  // ───── Login Handler ─────
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!identifier || !password) {
      showToast('Please enter your credentials', 'error');
      return;
    }

    const btn = document.getElementById('loginSubmitBtn');
    btn.classList.add('loading');

    await sleep(800);

    if (isPhpAvailable) {
      try {
        const formData = new FormData(loginForm);
        const res = await fetch('login.php', {
          method: 'POST', body: formData,
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        if (data.success) {
          btn.classList.remove('loading');
          showToast('Welcome back! Redirecting...', 'success');
          setTimeout(() => { window.location.href = data.redirect || 'dashboard.php'; }, 1200);
        } else {
          btn.classList.remove('loading');
          showToast(data.message, 'error');
        }
      } catch (err) {
        btn.classList.remove('loading');
        showToast('Server error. Using client mode.', 'warning');
      }
      return;
    }

    // Client mode
    const users = getStoredUsers();
    const user = users.find(u =>
      (u.username.toLowerCase() === identifier.toLowerCase() ||
       u.email.toLowerCase() === identifier.toLowerCase()) &&
      u.password === password
    );

    if (!user) {
      btn.classList.remove('loading');
      showToast('Invalid username/email or password', 'error');
      return;
    }

    btn.classList.remove('loading');
    showToast('Welcome back! Redirecting...', 'success');

    const session = { username: user.username, email: user.email, joined: user.joined || 'Recently' };
    if (rememberMe) {
      localStorage.setItem('auth_current_user', JSON.stringify(session));
    } else {
      sessionStorage.setItem('auth_current_user', JSON.stringify(session));
    }

    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
  });

  // ───── Social Login Demo ─────
  if (githubAuthBtn) githubAuthBtn.addEventListener('click', () => showToast('GitHub OAuth integration coming soon!', 'info'));
  if (googleAuthBtn) googleAuthBtn.addEventListener('click', () => showToast('Google OAuth integration coming soon!', 'info'));
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Password reset link sent (demo)', 'info');
    });
  }

  // ───── Theme Toggle ─────
  applyTheme(localStorage.getItem('auth_theme') || 'dark');

  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('auth_theme', newTheme);
  });

  function applyTheme(theme) {
    const isLight = theme === 'light';
    if (isLight) {
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.body.removeAttribute('data-theme');
    }
    sunIcon.style.display = isLight ? 'none' : 'block';
    moonIcon.style.display = isLight ? 'block' : 'none';
    lucide.createIcons();
  }

  // ───── Toast Notification System ─────
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = { success: 'check-circle', error: 'alert-triangle', warning: 'bell', info: 'info' };

    toast.innerHTML = `
      <i data-lucide="${icons[type] || 'info'}" style="width:20px;flex-shrink:0;"></i>
      <span>${message}</span>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.4s cubic-bezier(0.4, 0, 1, 1) forwards';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // ───── Utility ─────
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
});
