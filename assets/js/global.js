/* ============================================================
   FGE SOLAR - GLOBAL JS
   Nav, scroll animations, FAQ, mobile menu, WhatsApp utils
   ============================================================ */

/* Run after components are injected, or immediately on DOMContentLoaded
   for pages that have components pre-rendered (no component-loader). */
var _fgeInitDone = false;
function _fgeInit() {
  if (_fgeInitDone) return;
  _fgeInitDone = true;
  _fgeMainInit();
}
document.addEventListener('components:ready', _fgeInit);
document.addEventListener('DOMContentLoaded', function () {
  // Only fall through if this page doesn't use the async component loader
  if (!document.querySelector('[data-site-component]')) _fgeInit();
});

function _fgeMainInit() {
  const iconUse = (id, className = '') =>
    `<svg${className ? ` class="${className}"` : ''} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${id}"/></svg>`;

  const leadingIconMap = [
    { prefix: '\u2713', id: 'i-check' },
    { prefix: '\u2714', id: 'i-check' },
    { prefix: '\u26a1', id: 'i-zap' },
    { prefix: '\u2668\ufe0f', id: 'i-water' },
    { prefix: '\ud83d\udca7', id: 'i-water' },
    { prefix: '\ud83c\udf3f', id: 'i-leaf' },
    { prefix: '\ud83c\udf43', id: 'i-leaf' },
    { prefix: '\ud83c\udf31', id: 'i-leaf' },
    { prefix: '\ud83c\udf3e', id: 'i-leaf' },
    { prefix: '\ud83d\udee1\ufe0f', id: 'i-shield' },
    { prefix: '\ud83c\udfaf', id: 'i-target' },
    { prefix: '\u26ea', id: 'i-building' },
    { prefix: '\ud83c\udfe2', id: 'i-building' },
    { prefix: '\ud83c\udfd9\ufe0f', id: 'i-building' },
    { prefix: '\ud83c\udfde\ufe0f', id: 'i-leaf' },
    { prefix: '\ud83c\udf0a', id: 'i-water' },
    { prefix: '\ud83c\udfad', id: 'i-building' },
    { prefix: '\ud83c\udf34', id: 'i-leaf' },
    { prefix: '\u26f0\ufe0f', id: 'i-target' }
  ];

  function extractLeadingIcon(text) {
    const value = (text || '').trim();
    return leadingIconMap.find(({ prefix }) => value.startsWith(prefix)) || null;
  }

  function removeLeadingIconText(text, prefix) {
    return text.trim().replace(prefix, '').trim();
  }

  const header = document.getElementById('site-header');
  if (header) {
    const updateHeader = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  document.querySelectorAll('.nav-links > li').forEach((item) => {
    const dropdown = Array.from(item.children).find((child) => child.classList?.contains('nav-dropdown'));
    const trigger = Array.from(item.children).find((child) => child.tagName === 'A');
    if (!dropdown || !trigger) return;

    let closeTimer;
    item.classList.add('has-dropdown');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    const openDropdown = () => {
      window.clearTimeout(closeTimer);
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    };

    const closeDropdown = () => {
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }, 120);
    };

    item.addEventListener('mouseenter', openDropdown);
    item.addEventListener('mouseleave', closeDropdown);
    item.addEventListener('focusin', openDropdown);
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget)) closeDropdown();
    });
  });

  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.querySelector('.nav-mobile');

  if (navToggle && navMobile) {
    let mobileNavHistoryActive = false;
    let mobileNavHistoryClosing = false;

    const closeMobileSubmenus = () => {
      navMobile.querySelectorAll('.nav-mobile-sub.open').forEach((sub) => {
        sub.classList.remove('open');
      });
      navMobile.querySelectorAll('.mobile-sub-icon[aria-expanded="true"]').forEach((button) => {
        button.setAttribute('aria-expanded', 'false');
        button.querySelector('.chevron')?.classList.remove('rotated');
      });
    };

    const setMobileNavOpen = (isOpen) => {
      navToggle.classList.toggle('open', isOpen);
      navMobile.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (!isOpen) closeMobileSubmenus();
    };

    const openMobileNav = () => {
      setMobileNavOpen(true);
      if (!mobileNavHistoryActive && window.history?.pushState) {
        window.history.pushState({ fgeMobileNavOpen: true }, '', window.location.href);
        mobileNavHistoryActive = true;
      }
    };

    const closeMobileNav = ({ syncHistory = false } = {}) => {
      setMobileNavOpen(false);
      if (syncHistory && mobileNavHistoryActive && window.history?.back && !mobileNavHistoryClosing) {
        mobileNavHistoryClosing = true;
        window.history.back();
        return;
      }
      mobileNavHistoryActive = false;
      mobileNavHistoryClosing = false;
    };

    navToggle.addEventListener('click', () => {
      if (navMobile.classList.contains('open')) {
        closeMobileNav({ syncHistory: true });
      } else {
        openMobileNav();
      }
    });

    navMobile.addEventListener('click', (e) => {
      if (e.target === navMobile) {
        closeMobileNav({ syncHistory: true });
      }
    });

    navMobile.querySelectorAll('.mobile-sub-toggle').forEach((link) => {
      const sub = link.nextElementSibling;
      if (!sub || !sub.classList.contains('nav-mobile-sub')) return;

      const label = (link.textContent || 'submenu').trim().replace(/\s+/g, ' ');
      const chevron = link.querySelector('.chevron');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mobile-sub-icon';
      button.setAttribute('aria-label', `Open ${label} submenu`);
      button.setAttribute('aria-expanded', 'false');

      if (chevron) {
        chevron.remove();
        button.appendChild(chevron);
      } else {
        button.innerHTML = '<svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" focusable="false"><polyline points="6 9 12 15 18 9" /></svg>';
      }

      link.classList.add('mobile-parent-link');
      link.removeAttribute('aria-expanded');
      link.parentElement?.classList.add('mobile-nav-parent');
      link.insertAdjacentElement('afterend', button);

      button.addEventListener('click', () => {
        if (!sub) return;

        const isOpen = sub.classList.toggle('open');
        button.setAttribute('aria-expanded', String(isOpen));
        button.querySelector('.chevron')?.classList.toggle('rotated', isOpen);
      });
    });

    navMobile.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    window.addEventListener('popstate', () => {
      if (mobileNavHistoryActive || navMobile.classList.contains('open')) {
        closeMobileNav();
      }
    });
  }

  (function setActiveNavState() {
    const path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';

    document.querySelectorAll('.nav-links > li > a, .nav-mobile-links a').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;

      const base = href.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
      const isMatch = base !== '/' ? path === base || path.startsWith(base + '/') : path === '/';
      if (!isMatch) return;

      link.setAttribute('aria-current', 'page');
      link.closest('li')?.classList.add('active');
    });
  })();

  document.querySelectorAll('.footer-cert-badge, .badge.badge-white').forEach((badge) => {
    if (badge.querySelector('svg')) return;
    const leading = extractLeadingIcon(badge.textContent);
    if (!leading) return;

    const cleaned = removeLeadingIconText(badge.textContent, leading.prefix);
    badge.innerHTML = `${iconUse(leading.id, 'badge-icon')}${cleaned}`;
  });

  document.querySelectorAll('.trust-item .check').forEach((check) => {
    if (!check.querySelector('svg')) {
      check.innerHTML = iconUse('i-check');
    }
  });

  document.querySelectorAll('.wa-float svg, .btn-wa svg, .method-icon.wa svg').forEach((svg) => {
    svg.innerHTML = '<use href="#i-whatsapp"/>';
  });

  const animatedEls = document.querySelectorAll('.fade-up, .fade-in, .stagger');

  if (animatedEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animatedEls.forEach((el) => {
      if (el.style.animationDelay) {
        el.style.transitionDelay = el.style.animationDelay;
      }
      observer.observe(el);
    });
  }

  const counters = document.querySelectorAll('[data-count]');

  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const isDecimal = String(target).includes('.');
    const decimals = isDecimal ? String(target).split('.')[1].length : 0;
    const start = Date.now();

    const update = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  function getFaqAnswerHeight(answer) {
    const inner = answer.querySelector('.faq-answer-inner');
    return inner ? inner.scrollHeight : answer.scrollHeight;
  }

  function closeFaqItem(item) {
    const answer = item?.querySelector('.faq-answer');
    const button = item?.querySelector('.faq-question');
    if (!answer || !button) return;

    item.classList.remove('open');
    button.classList.remove('active');
    button.setAttribute('aria-expanded', 'false');
    answer.classList.remove('open');
    answer.style.maxHeight = '0';
  }

  function openFaqItem(item) {
    const answer = item?.querySelector('.faq-answer');
    const button = item?.querySelector('.faq-question');
    if (!answer || !button) return;

    item.classList.add('open');
    button.classList.add('active');
    button.setAttribute('aria-expanded', 'true');
    answer.classList.add('open');
    answer.style.maxHeight = getFaqAnswerHeight(answer) + 'px';
  }

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!button || !answer) return;

    button.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
    answer.style.maxHeight = item.classList.contains('open') ? getFaqAnswerHeight(answer) + 'px' : '0';

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach((openItem) => {
        if (openItem !== item) closeFaqItem(openItem);
      });

      if (isOpen) {
        closeFaqItem(item);
      } else {
        openFaqItem(item);
      }
    });
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-item.open .faq-answer').forEach((answer) => {
      answer.style.maxHeight = getFaqAnswerHeight(answer) + 'px';
    });
  });

  const waFloat = document.querySelector('.wa-float');
  if (waFloat) {
    waFloat.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
          location: 'floating_button',
          page: window.location.pathname
        });
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  const stickyCTA = document.querySelector('.sticky-mobile-cta');
  const heroCTA = document.querySelector('.hero-ctas');

  if (stickyCTA && heroCTA) {
    const stickyObserver = new IntersectionObserver(
      ([entry]) => {
        stickyCTA.classList.toggle('visible', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    stickyObserver.observe(heroCTA);
  }

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'phone_clicked', { page: window.location.pathname });
      }
    });
  });

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', () => {
      if (form.matches('[data-lead]')) {
        return;
      }

      if (typeof gtag === 'function') {
        gtag('event', 'form_submitted', {
          form_id: form.id || 'unknown',
          page: window.location.pathname
        });
      }
    });
  });

  const blogInlineCTA = document.querySelector('.blog-inline-cta');
  if (blogInlineCTA) {
    let shown = false;
    window.addEventListener('scroll', () => {
      if (shown) return;
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.45) {
        blogInlineCTA.classList.add('visible');
        shown = true;
        if (typeof gtag === 'function') {
          gtag('event', 'blog_50_percent', { page: window.location.pathname });
        }
      }
    }, { passive: true });
  }
}

const WA_NUMBER = '918089073029';

function buildWAUrl(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function buildDistrictWA(district) {
  const msg = `Hi FGE Solar, I'm from ${district} and I'm interested in solar for my home. Can you arrange a free site visit?`;
  return buildWAUrl(msg);
}

window.buildWAUrl = buildWAUrl;
window.buildDistrictWA = buildDistrictWA;
