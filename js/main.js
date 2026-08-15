/* =========================================================================
   MOJALEFA L. LETSOARA — Cybersecurity Portfolio
   Nav, mobile menu, side rail, reveal, ticker, FAQ, counters,
   theme toggle, back-to-top, sticky CTA, 3D scroll motion.
   ========================================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav scrolled state ---------- */
  var nav = document.querySelector('.top-nav');

  /* ---------- Mobile menu ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');

  function closeMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('menu-open', isOpen);
    });
    mobileMenu.querySelectorAll('.mobile-menu-link, .mobile-menu-footer a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Theme toggle ---------- */
  var themeToggles = document.querySelectorAll('[data-theme-toggle]');
  var storedTheme = null;
  try { storedTheme = window.localStorage.getItem('mll-theme'); } catch (e) { /* storage blocked */ }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    themeToggles.forEach(function (btn) {
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    });
  }
  applyTheme(storedTheme === 'light' ? 'light' : 'dark');

  themeToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { window.localStorage.setItem('mll-theme', next); } catch (e) { /* storage blocked */ }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  var counterEls = document.querySelectorAll('[data-count-to]');

  function renderCount(el, value) {
    el.textContent = value + (el.getAttribute('data-count-suffix') || '');
  }

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10);
    if (isNaN(target)) return;
    if (reduceMotion) { renderCount(el, target); return; }
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      renderCount(el, Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  if (counterEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counterEls.forEach(function (el) { renderCount(el, parseInt(el.getAttribute('data-count-to'), 10)); });
    } else {
      counterEls.forEach(function (el) { renderCount(el, 0); });
      var counterObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counterEls.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  /* ---------- Ticker: duplicate items for a seamless loop ---------- */
  var ticker = document.querySelector('[data-ticker]');
  if (ticker) {
    ticker.innerHTML += ticker.innerHTML;
  }

  /* ---------- Project tiles: click for details ---------- */
  document.querySelectorAll('[data-tile-toggle]').forEach(function (btn) {
    var tile = btn.closest('.tile');
    var label = btn.querySelector('span');
    if (!tile) return;
    btn.addEventListener('click', function () {
      var open = tile.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.textContent = open ? 'Close details' : 'Click for details';
    });
  });

  /* ---------- Contact form (Formspree over AJAX) ---------- */
  var contactForm = document.querySelector('[data-contact-form]');
  var formStatus = document.querySelector('[data-form-status]');

  function setStatus(message, kind) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  function clearFieldErrors() {
    if (!contactForm) return;
    contactForm.querySelectorAll('[data-field-error]').forEach(function (el) { el.textContent = ''; });
    contactForm.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
  }

  function showFieldErrors(errors) {
    var unattached = [];
    errors.forEach(function (err) {
      var field = err.field || (err.details && err.details.field);
      var slot = field && contactForm.querySelector('[data-field-error="' + field + '"]');
      if (slot) {
        slot.textContent = err.message;
        var input = contactForm.querySelector('[name="' + field + '"]');
        if (input) input.setAttribute('aria-invalid', 'true');
      } else {
        unattached.push(err.message);
      }
    });
    return unattached;
  }

  if (contactForm) {
    var action = contactForm.getAttribute('action') || '';

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFieldErrors();

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var original = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
      setStatus('Sending your message...', '');

      fetch(action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          contactForm.reset();
          setStatus('Thanks, your message is on its way. I will reply within 48 hours.', 'ok');
          return;
        }
        return res.json().then(function (data) {
          var errors = (data && data.errors) || [];
          if (!errors.length) {
            setStatus('Something went wrong. Please try again, or reach me on LinkedIn.', 'err');
            return;
          }
          var leftover = showFieldErrors(errors);
          setStatus(
            leftover.length ? leftover.join(' ') : 'Please check the highlighted fields and try again.',
            'err'
          );
        }).catch(function () {
          setStatus('Something went wrong. Please try again, or reach me on LinkedIn.', 'err');
        });
      }).catch(function () {
        setStatus('Network error. Please try again, or reach me on LinkedIn.', 'err');
      }).then(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = original; }
      });
    });

    // Clear a field's error as soon as the visitor starts fixing it
    contactForm.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var slot = contactForm.querySelector('[data-field-error="' + input.name + '"]');
        if (slot) slot.textContent = '';
        input.removeAttribute('aria-invalid');
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq-question');
    if (!q) return;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  var faqToggleAll = document.querySelector('[data-faq-toggle-all]');
  if (faqToggleAll && faqItems.length) {
    faqToggleAll.addEventListener('click', function () {
      var anyClosed = faqItems.some(function (i) { return !i.classList.contains('open'); });
      faqItems.forEach(function (i) {
        i.classList.toggle('open', anyClosed);
        var q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', anyClosed ? 'true' : 'false');
      });
      faqToggleAll.textContent = anyClosed ? 'Collapse All' : 'Expand All';
    });
  }

  /* ---------- Hero grid: pointer-follow mask ---------- */
  var heroGrid = document.querySelector('[data-hero-grid]');
  if (heroGrid && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var hero = heroGrid.parentElement;
    hero.addEventListener('mousemove', function (e) {
      var rect = heroGrid.getBoundingClientRect();
      heroGrid.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      heroGrid.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  }

  /* ---------- Section tracking: nav links, side dots, progress rail ---------- */
  var trackedSections = Array.prototype.slice.call(
    document.querySelectorAll('.section[id], .footer-cta')
  );
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sideDots = document.querySelectorAll('[data-section-dot]');
  var readout = document.querySelector('[data-readout]');
  var trackFill = document.querySelector('[data-track-fill]');

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function onScroll() {
    var y = window.scrollY;

    if (nav) nav.classList.toggle('scrolled', y > 24);

    // Progress rail
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (trackFill) {
      var pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
      trackFill.style.height = pct + '%';
    }

    // Floating controls — hidden near the very bottom so they never sit on the footer
    var showFloating = y > window.innerHeight * 0.6 && (max - y) > 180;
    if (backToTop) backToTop.classList.toggle('visible', showFloating);
    if (stickyCta) stickyCta.classList.toggle('visible', showFloating);

    // Active section
    var activeIndex = -1;
    trackedSections.forEach(function (section, i) {
      var rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
        activeIndex = i;
      }
    });

    if (activeIndex >= 0) {
      var activeId = trackedSections[activeIndex].id;
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
      });
      sideDots.forEach(function (dot, i) { dot.classList.toggle('active', i === activeIndex); });
      if (readout) readout.textContent = pad2(activeIndex + 1);
    }
  }

  /* ---------- Back to top + sticky CTA ---------- */
  var backToTop = document.querySelector('[data-back-to-top]');
  var stickyCta = document.querySelector('[data-sticky-cta]');

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 3D scroll motion ---------- */
  var motionLayers = Array.prototype.slice.call(
    document.querySelectorAll('.section > .main, .logo-ticker > .main')
  );

  function apply3D() {
    var vh = window.innerHeight;
    motionLayers.forEach(function (layer) {
      var rect = layer.getBoundingClientRect();
      if (rect.bottom < -vh * 0.4 || rect.top > vh * 1.4) return;

      // -1 = content centre well below the viewport, 0 = centred, 1 = well above
      var centre = rect.top + rect.height / 2;
      var progress = Math.max(-1, Math.min(1, (vh / 2 - centre) / vh));

      var rotate = (-progress * 6).toFixed(2);
      var depth = (-Math.abs(progress) * 80).toFixed(1);

      layer.style.transform = 'rotateX(' + rotate + 'deg) translateZ(' + depth + 'px)';
    });
  }

  /* ---------- Single rAF-throttled scroll loop ---------- */
  var ticking = false;
  function onFrame() {
    onScroll();
    if (!reduceMotion) apply3D();
    ticking = false;
  }
  function requestFrame() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onFrame);
    }
  }

  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame);
  onFrame();

  /* ---------- Current year ---------- */
  var yearEl = document.querySelector('[data-current-year]');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
