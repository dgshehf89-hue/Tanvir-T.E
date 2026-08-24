/**
 * TANVIR GPT — CORE JAVASCRIPT ENGINE
 * Fast, Vanilla, Responsive Interactions & Canvas Particles
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavigation();
  initScrollSpy();
  initScrollReveal();
  initBackToTop();
});

/* ---------------- OPEN LINK FUNCTION (SAME TAB) ---------------- */
function openLink(url) {
  if (!url) return;
  // If running inside Android WebView or browser, redirect directly
  window.location.href = url;
}

/* ---------------- BACKGROUND PARTICLE CANVAS ---------------- */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const particleCount = window.innerWidth < 768 ? 28 : 55;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.8,
      color: Math.random() > 0.3 ? 'rgba(0, 210, 255, ' : 'rgba(255, 122, 0, ',
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 210, 255, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw and update particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* ---------------- NAVIGATION & MOBILE MENU ---------------- */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('open');
      mobileDrawer.classList.toggle('open');
    });

    // Close on mobile link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        mobileDrawer.classList.remove('open');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        menuToggle.classList.remove('open');
        mobileDrawer.classList.remove('open');
      }
    });
  }

  // Smooth scroll for all internal hash links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ---------------- SCROLL SPY ACTIVE STATE ---------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    desktopLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-nav') === current) {
        link.classList.add('active');
      }
    });

    mobileLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-nav') === current) {
        link.classList.add('active');
      }
    });
  });
}

/* ---------------- SCROLL REVEAL ANIMATION ---------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ---------------- BACK TO TOP ---------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* ---------------- MODAL SYSTEM ---------------- */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(event, modalId) {
  if (event.target.id === modalId) {
    closeModal(modalId);
  }
}

function showInfoModal(title, message, icon = '⚡') {
  const modal = document.getElementById('infoModal');
  const titleEl = document.getElementById('infoModalTitle');
  const bodyEl = document.getElementById('infoModalBody');
  const iconEl = document.getElementById('infoModalIcon');

  if (titleEl) titleEl.innerText = title;
  if (bodyEl) bodyEl.innerText = message;
  if (iconEl) iconEl.innerText = icon;

  openModal('infoModal');
}

function showSocialModal(platform) {
  showInfoModal(platform, 'Social link will be available soon.', '🌐');
}

// Close modals on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(modal => {
      closeModal(modal.id);
    });
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    if (menuToggle && mobileDrawer) {
      menuToggle.classList.remove('open');
      mobileDrawer.classList.remove('open');
    }
  }
});

/* ---------------- CONTACT FORM & TOASTS ---------------- */
function handleContactSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('contactName')?.value.trim();
  const email = document.getElementById('contactEmail')?.value.trim();
  const message = document.getElementById('contactMessage')?.value.trim();

  if (!name || !email || !message) {
    showToast('⚠️ Please fill out all fields.');
    return;
  }

  // Clear form
  const form = document.getElementById('contactForm');
  if (form) form.reset();

  // Show required success notification
  showToast('Message received! Thanks for contacting TANVIR GPT.', '✨');
}

function showToast(message, icon = '✨') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

/* ---------------- SIMULATED APK DOWNLOAD ---------------- */
let isDownloadingApk = false;

function startApkDownload() {
  if (isDownloadingApk) return;
  isDownloadingApk = true;

  const btn = document.getElementById('btnDownloadApk');
  const btnText = document.getElementById('downloadBtnText');

  if (btn) {
    btn.classList.add('downloading');
  }

  showToast('Starting download: TANVIR_GPT_v1.0.apk...', '📥');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 18;
    if (progress > 100) progress = 100;

    if (btnText) {
      btnText.innerText = `Downloading ${progress}%`;
    }

    if (progress >= 100) {
      clearInterval(interval);

      // Trigger simulated file download
      try {
        const dummyContent = "TANVIR GPT Android Application Package (v1.0)\nAI × Gaming × Tools for you.";
        const blob = new Blob([dummyContent], { type: "application/vnd.android.package-archive" });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = "TANVIR_GPT_v1.0.apk";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      } catch (e) {
        console.log("Download simulated trigger:", e);
      }

      setTimeout(() => {
        if (btn) {
          btn.classList.remove('downloading');
        }
        if (btnText) {
          btnText.innerText = 'Download APK';
        }
        isDownloadingApk = false;

        // Success Toast Notification
        showToast('Download Complete! TANVIR_GPT_v1.0.apk is ready.', '✅');
      }, 500);
    }
  }, 280);
}
