/* =========================================================
   PIXO PATH — MAIN JAVASCRIPT
   Clean, single version — no duplicates
   ========================================================= */

// ===== SWAP PRELOADED FONT AWESOME CSS TO AN ACTIVE STYLESHEET =====
// Done here (instead of an inline onload="" attribute on the <link>) so the
// page's Content-Security-Policy doesn't need 'unsafe-inline' for scripts.
(function () {
  const faLink = document.getElementById('faStylesheet');
  if (faLink) faLink.rel = 'stylesheet';
})();

// ===== SCROLL REVEAL SETUP (runs AFTER loader hides, so hero
//        animation is actually visible instead of finishing
//        underneath the loader overlay) =====
function initScrollReveal() {
  const revealSelectors = [
    '.hero-text',
    '.hero-image',
    '.social-links',
    '.about-image',
    '.about-text',
    '.services > .eyebrow',
    '.services > .section-title',
    '.services-box > div',
    '.projects > .eyebrow',
    '.projects > .section-title',
    '.project-card',
    '.resume-header',
    '.resume-tabs',
    '.contact-heading',
    '.contact-info',
    '.contact-form'
  ];

  const elements = document.querySelectorAll(revealSelectors.join(','));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elements.forEach((el) => revealObserver.observe(el));
}


// ===== LOADER =====
window.addEventListener('load', function () {
  setTimeout(function () {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');

    // start reveal animations right as the loader fades out,
    // so the hero section animates into view instead of
    // popping in already-finished behind the loader
    initScrollReveal();
  }, 400);
});


// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');

if (hamburger && navbar) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navbar.classList.toggle('show');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navbar.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // close menu when a nav link is clicked
  navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navbar.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}


// ===== CUSTOM CURSOR =====
// requestAnimationFrame-throttled so mousemove never fires layout work
// more than once per frame (smoother + cheaper than the raw listener).
const cursor = document.querySelector('.cursor');

if (cursor) {
  let pendingX = 0, pendingY = 0, rafScheduled = false;

  document.addEventListener('mousemove', function (e) {
    pendingX = e.clientX;
    pendingY = e.clientY;
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(() => {
        cursor.style.left = pendingX + 'px';
        cursor.style.top = pendingY + 'px';
        rafScheduled = false;
      });
    }
  }, { passive: true });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursor.style.background = 'rgba(37,99,235,0.25)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = 'transparent';
    });
  });
}
// Note: the old left/top-based cursor + a disabled right-click handler have
// been removed. Blocking the context menu doesn't add real security (it's
// trivially bypassed via devtools) and only annoys visitors trying to copy
// your phone number or email — it was cut to improve UX and accessibility.


// ===== COUNTER ANIMATION =====
// Replaced the old `scroll` listener with an IntersectionObserver: this
// fires once when the counters enter view instead of running a callback
// on every scroll event, which is both faster and more reliable.
const counterSection = document.querySelector('.counter-container');
const counters = document.querySelectorAll('.number');

if (counterSection && counters.length > 0) {
  const runCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      let count = 0;
      const duration = 1200;
      const steps = target > 0 ? target : 1;
      const interval = Math.max(10, Math.floor(duration / steps));

      const timer = setInterval(() => {
        count++;
        counter.innerText = count;
        if (count >= target) clearInterval(timer);
      }, interval);
    });
  };

  const counterObserver = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      runCounters();
      obs.disconnect();
    }
  }, { threshold: 0.3 });

  counterObserver.observe(counterSection);
}


// ===== RESUME TABS =====
(function () {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabBtns.length === 0) return;

  function animateTab(tabEl) {
    tabEl.querySelectorAll('.timeline-item').forEach((item, i) => {
      item.classList.remove('show');
      setTimeout(() => item.classList.add('show'), i * 80);
    });
    tabEl.querySelectorAll('.skill-item').forEach((item, i) => {
      item.classList.remove('show');
      const fill = item.querySelector('.skill-fill');
      if (fill) fill.style.width = '0%';
      setTimeout(() => {
        item.classList.add('show');
        if (fill) fill.style.width = fill.dataset.width + '%';
      }, i * 70);
    });
  }

  function activateTab(tabId) {
    tabBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    const btnEl = document.querySelector(`[data-tab="${tabId}"]`);
    if (btnEl) {
      btnEl.classList.add('active');
      btnEl.setAttribute('aria-selected', 'true');
    }

    tabContents.forEach(c => c.classList.remove('active'));
    const active = document.getElementById(tabId);
    if (active) {
      active.classList.add('active');
      setTimeout(() => animateTab(active), 50);
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  const resumeSection = document.querySelector('.resume');
  if (resumeSection) {
    const resumeObserver = new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) animateTab(activeTab);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    resumeObserver.observe(resumeSection);
  }
})();


// ===== CV DOWNLOAD =====
const downloadCV = document.getElementById('downloadCV');

if (downloadCV) {
  downloadCV.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href');

    fetch(href)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Hafiz-Qitmeer-Raza-CV.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        // fallback: agar fetch fail ho to normal download try karo
        window.open(href, '_blank');
      });
  });
}


// ===== CONTACT FORM — Web3Forms (email aapko milti hai) =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // simple client-side honeypot check as a second line of defence
    // (Web3Forms already checks this server-side too)
    const honeypot = contactForm.querySelector('input[name="botcheck"]');
    if (honeypot && honeypot.checked) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.className = 'form-status';
    formStatus.style.color = '#94A3B8';
    formStatus.textContent = 'Please wait...';

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });

      const result = await response.json();

      if (result.success) {
        formStatus.classList.add('success');
        formStatus.textContent = 'Message sent successfully!';
        submitBtn.textContent = 'Sent';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-arrow-right"></i>';
          formStatus.textContent = '';
        }, 4000);

      } else {
        formStatus.classList.add('error');
        formStatus.textContent = 'Failed! Please try again.';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-arrow-right"></i>';
      }

    } catch (error) {
      formStatus.classList.add('error');
      formStatus.textContent = 'Network error. Please try again.';
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-arrow-right"></i>';
    }
  });
}


// ===== FOOTER YEAR =====
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();