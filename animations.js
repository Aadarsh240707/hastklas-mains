/**
 * HastKala — Warm Heritage Design System (Phase 3 Upgraded & Hardened)
 * GSAP Animations & ScrollTriggers (B1 - B10)
 */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined') return;

  // Phase 3 Animation Change 5: Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Phase 3 Animation Change 1: Navbar entrance on initial root load only
  const navbar = document.querySelector('.navbar-wh');
  if (navbar && !sessionStorage.getItem('hk_nav_animated')) {
    gsap.from(navbar, {
      y: -50,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'all'
    });
    sessionStorage.setItem('hk_nav_animated', 'true');
  }

  // Phase 3 Animation Change 2: Responsive MatchMedia parallax only on desktop (>=768px)
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    // B2. Hero parallax: subtle and smooth
    const homeHero = document.querySelector('.hero-wh');
    if (homeHero && typeof ScrollTrigger !== 'undefined') {
      gsap.to('.hero-wh', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-wh',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    }

    // B3. Page-hero parallax on subpages
    const pageHeroes = document.querySelectorAll('.page-hero-wh, .contact-hero, .about-hero, .artisan-hero, .ngo-hero, .product-hero');
    if (pageHeroes.length > 0 && typeof ScrollTrigger !== 'undefined') {
      pageHeroes.forEach(hero => {
        gsap.to(hero, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5
          }
        });
      });
    }
  });

  // B4. Section headers fade up smoothly (Targeting only parent headers to prevent nested opacity stacking)
  if (typeof ScrollTrigger !== 'undefined') {
    const sectionHeaders = document.querySelectorAll('.section-header, .contact-h2, .contact-h3, .feedback-h2, .auth-h2, .serve-title, .section-head-wh');
    sectionHeaders.forEach(header => {
      gsap.from(header, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: header,
          start: 'top 95%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // B5. Cards stagger: each row of .card-wh animates in with staggered delay on scroll
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.batch('.card-wh', {
      interval: 0.1,
      batchMax: 4,
      onEnter: batch => gsap.from(batch, {
        y: 25,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'all',
        overwrite: 'auto'
      }),
      start: 'top 95%'
    });
  }

  // B6. Trust bar: slides in smoothly on scroll or immediate if in view
  const trustBar = document.querySelector('.trust-bar-wh, .trust-bar');
  if (trustBar && typeof ScrollTrigger !== 'undefined') {
    gsap.from(trustBar, {
      opacity: 0,
      y: 15,
      duration: 0.6,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: trustBar,
        start: 'top 98%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Phase 3 Animation Change 3: Step circles with dignified power2.out entrance
  const stepCircles = document.querySelectorAll('.step-number-circle, .step-circle');
  if (stepCircles.length > 0 && typeof ScrollTrigger !== 'undefined') {
    const parentSection = stepCircles[0].closest('section') || stepCircles[0];
    gsap.from(stepCircles, {
      scale: 0.85,
      opacity: 0,
      stagger: 0.12,
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: parentSection,
        start: 'top 90%'
      }
    });
  }

  // B8. CTA banners: subtle reveal on scroll
  if (typeof ScrollTrigger !== 'undefined') {
    const ctaBanners = document.querySelectorAll('.cta-banner-wh');
    ctaBanners.forEach(banner => {
      gsap.from(banner, {
        scale: 0.96,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: banner,
          start: 'top 90%'
        }
      });
    });
  }

  // B9. Filter bars: slide down smoothly on page load
  const filterBars = document.querySelectorAll('.filter-bar-wh');
  if (filterBars.length > 0) {
    gsap.from(filterBars, {
      y: -15,
      opacity: 0,
      duration: 0.45,
      delay: 0.1,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }

  // Phase 3 Animation Change 4: Modals slide in quickly without cartoon bounce
  document.addEventListener('show.bs.modal', function (event) {
    const modalContent = event.target.querySelector('.modal-content') || event.target.querySelector('.modal-dialog');
    if (modalContent) {
      gsap.fromTo(modalContent,
        { y: 20, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out', clearProps: 'all' }
      );
    }
  });

  // ==========================================================================
  // COOL COOL ANIMATION UPGRADES (Scroll Progress, 3D Tilt, Counters, Toast)
  // ==========================================================================

  // 1. Reading Scroll Progress Bar
  let progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.prepend(progressBar);
  }

  window.addEventListener('scroll', function () {
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0) {
      const scrollPercent = (window.scrollY / docHeight) * 100;
      progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
    }
  }, { passive: true });

  // 2. Interactive 3D Card Tilt on Desktop (mouse move)
  if (window.matchMedia('(min-width: 992px)').matches) {
    const tiltCards = document.querySelectorAll('.card-wh, .event-card-item, .gallery-photo-item');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
        const rotateY = ((x - centerX) / centerX) * 6;  // max 6 deg

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
      });

      card.addEventListener('mouseenter', function () {
        card.style.transition = 'transform 0.1s ease-out';
      });
    });
  }

  // 3. Smooth Animated Stat Counters
  const counterElements = document.querySelectorAll('.counter-val, [data-counter]');
  if (counterElements.length > 0 && typeof ScrollTrigger !== 'undefined') {
    counterElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target') || el.innerText.replace(/[^0-9.]/g, ''));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';

      if (!isNaN(target)) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none'
          },
          onUpdate: function () {
            if (target >= 1000) {
              el.innerText = prefix + Math.floor(obj.val).toLocaleString() + suffix;
            } else {
              el.innerText = prefix + Math.floor(obj.val) + suffix;
            }
          }
        });
      }
    });
  }

  // 4. Subtle Floating Micro-Animation on Hero Badges
  const floatingBadges = document.querySelectorAll('.badge-story, .craft-provenance-pill, .tag-artisan, .tag-ngo');
  if (floatingBadges.length > 0) {
    floatingBadges.forEach((badge, idx) => {
      if (idx % 2 === 0) {
        badge.classList.add('animate-float');
      }
    });
  }

  // 5. Global Toast Feedback Notification
  window.showHastkalaToast = function (title, message, icon) {
    let toast = document.querySelector('.toast-notification-wh');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification-wh';
      toast.innerHTML = `
        <div class="toast-wh-icon">${icon || '✦'}</div>
        <div class="flex-grow-1">
          <div class="toast-wh-title">${title || 'Notification'}</div>
          <div class="toast-wh-msg">${message || ''}</div>
        </div>
      `;
      document.body.appendChild(toast);
    } else {
      toast.querySelector('.toast-wh-title').textContent = title;
      toast.querySelector('.toast-wh-msg').textContent = message;
      if (icon) toast.querySelector('.toast-wh-icon').textContent = icon;
    }

    toast.classList.add('show');
    clearTimeout(window.__hkToastTimer);
    window.__hkToastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  // Ensure all ScrollTriggers recalculate positions after DOM rendering
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});

