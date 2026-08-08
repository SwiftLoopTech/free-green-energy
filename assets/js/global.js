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

  // ── Analytics helpers ───────────────────────────────────────────────────
  // Single wrapper that fires GA4 + Clarity from one call.
  // Clarity project: xna10prts7
  function fgeEvent(ga4Name, ga4Params, clarityTag) {
    if (typeof gtag === 'function') {
      gtag('event', ga4Name, Object.assign({ page: window.location.pathname }, ga4Params));
    }
    if (clarityTag && typeof window.clarity === 'function') {
      window.clarity('event', clarityTag);
    }
  }

  function fgeSet(key, value) {
    if (typeof window.clarity === 'function') {
      window.clarity('set', key, value);
    }
  }

  // ── Label each session by page type so Clarity filters work ────────────
  (function() {
    const p = window.location.pathname;
    const type = p.startsWith('/blog/') ? 'blog'
      : p.startsWith('/solar-in/') ? 'location_page'
      : p.startsWith('/services/') ? 'service_page'
      : p.startsWith('/subsidy/') ? 'subsidy_page'
      : p === '/calculator' ? 'calculator'
      : p === '/contact' ? 'contact'
      : (p === '/' || p === '/index.html') ? 'homepage'
      : 'other';
    fgeSet('page_type', type);
  })();

  // ── WhatsApp floating button ────────────────────────────────────────────
  const waFloat = document.querySelector('.wa-float');
  if (waFloat) {
    waFloat.addEventListener('click', () => {
      fgeEvent('whatsapp_click', { location: 'floating_button' }, 'whatsapp_float_btn');
    });
  }

  // ── WhatsApp all other links — context-aware ────────────────────────────
  document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
    if (link.classList.contains('wa-float')) return; // already handled above
    link.addEventListener('click', () => {
      let location = 'inline';
      let clarityTag = 'whatsapp_inline_cta';
      if (link.closest('.sticky-mobile-cta')) {
        location = 'sticky_bar';
        clarityTag = 'whatsapp_sticky_cta';
      } else if (link.closest('.hero') || link.closest('.hero-ctas')) {
        location = 'hero';
        clarityTag = 'whatsapp_hero_cta';
      } else if (link.closest('.blog-inline-cta') || link.closest('article')) {
        location = 'blog_cta';
        clarityTag = 'whatsapp_blog_cta';
      } else if (link.closest('footer')) {
        location = 'footer';
        clarityTag = 'whatsapp_footer';
      }
      fgeEvent('whatsapp_click', { location }, clarityTag);
    });
  });

  // ── Smooth scroll for anchor links ─────────────────────────────────────
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

  // ── Sticky CTA visibility ───────────────────────────────────────────────
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

  // ── Phone click — with section context ─────────────────────────────────
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener('click', () => {
      const section = link.closest('header, nav') ? 'nav'
        : link.closest('footer') ? 'footer'
        : 'body';
      fgeEvent('phone_click', { section }, 'phone_click_' + section);
    });
  });

  // ── FAQ interaction tracking ────────────────────────────────────────────
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!item.classList.contains('open')) { // about to open
        const qText = (btn.textContent || '').trim().substring(0, 60);
        fgeEvent('faq_opened', { question: qText }, 'faq_interaction');
      }
    });
  });

  // ── Blog scroll depth tracking ──────────────────────────────────────────
  const blogInlineCTA = document.querySelector('.blog-inline-cta');
  if (blogInlineCTA) {
    let reached50 = false;
    let reached100 = false;
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      if (!reached50 && scrolled > 0.50) {
        reached50 = true;
        blogInlineCTA.classList.add('visible');
        fgeEvent('blog_scroll_depth', { depth: '50pct' }, 'blog_read_50pct');
        fgeSet('blog_engaged', 'true');
      }
      if (!reached100 && scrolled > 0.95) {
        reached100 = true;
        fgeEvent('blog_scroll_depth', { depth: '100pct' }, 'blog_read_complete');
      }
    }, { passive: true });
  }
} // end _fgeMainInit

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


// --- Global Estimate Modal Logic ---
function initEstimateModal() {
  const STORAGE_KEY = 'fge_estimate_modal_closed';
  const COOLDOWN_DAYS = 3;
  
  const lastClosed = localStorage.getItem(STORAGE_KEY);
  if (lastClosed) {
    const daysSinceClosed = (Date.now() - parseInt(lastClosed, 10)) / (1000 * 60 * 60 * 24);
    if (daysSinceClosed < COOLDOWN_DAYS) {
      return; // Do not show modal
    }
  }

  // Inject modal HTML
  const modalHTML = `
    <div id="fge-estimate-modal" class="fge-modal-overlay">
      <div class="fge-modal-content">
        <button id="fge-modal-close" class="fge-modal-close" aria-label="Close modal">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 6L6 18M6 6l12 12"></path></svg>
        </button>
        <div class="fge-modal-body">
          <div class="fge-modal-image">
            <img src="/assets/images/hero/updated_hero-640.webp" alt="Rooftop solar in Kerala" width="640" height="306" decoding="async" />
          </div>
          <div class="fge-modal-text">
            <div class="fge-modal-badge" style="background:#fff3cd;color:#7d4700;border-radius:6px;padding:4px 10px;font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;display:inline-block;margin-bottom:0.75rem;">
              ⚡ PM Surya Ghar Subsidy — Time Running Out
            </div>
            <h3 style="font-size:clamp(1.15rem,2.8vw,1.45rem);line-height:1.2;margin:0 0 0.5rem;">
              Up to ₹78,000 Subsidy.<br>Only
              <span id="modal-sct-days" style="color:#18B85C;">—</span> Days Left to Claim.
            </h3>
            <div style="background:#1a1a2e;border-radius:10px;padding:0.65rem 0.9rem;margin:0.65rem 0;display:flex;gap:0.6rem;align-items:center;justify-content:center;">
              <div style="text-align:center;">
                <span id="modal-sct-d" style="font-size:1.3rem;font-weight:800;color:#fff;font-family:var(--font-heading,inherit);">—</span>
                <div style="font-size:0.55rem;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.06em;">Days</div>
              </div>
              <span style="color:rgba(255,255,255,0.3);font-size:1.2rem;align-self:flex-start;margin-top:4px;">:</span>
              <div style="text-align:center;">
                <span id="modal-sct-h" style="font-size:1.3rem;font-weight:800;color:#fff;font-family:var(--font-heading,inherit);">—</span>
                <div style="font-size:0.55rem;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.06em;">Hrs</div>
              </div>
              <span style="color:rgba(255,255,255,0.3);font-size:1.2rem;align-self:flex-start;margin-top:4px;">:</span>
              <div style="text-align:center;">
                <span id="modal-sct-m" style="font-size:1.3rem;font-weight:800;color:#fff;font-family:var(--font-heading,inherit);">—</span>
                <div style="font-size:0.55rem;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.06em;">Min</div>
              </div>
              <span style="color:rgba(255,255,255,0.3);font-size:1.2rem;align-self:flex-start;margin-top:4px;">:</span>
              <div style="text-align:center;">
                <span id="modal-sct-s" style="font-size:1.3rem;font-weight:800;color:#fff;font-family:var(--font-heading,inherit);">—</span>
                <div style="font-size:0.55rem;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.06em;">Sec</div>
              </div>
            </div>
            <p style="font-size:0.84rem;color:#4a5c4e;margin:0.5rem 0 0.9rem;line-height:1.5;">
              MNRE-empanelled installer. Free site visit. Your bill, your roof, your exact subsidy amount — calculated on-site.
            </p>
            <a href="/contact?ref=estimate_modal" class="btn btn-primary fge-modal-cta" id="fge-modal-cta" style="display:block;text-align:center;">
              Get My Free Estimate →
            </a>
            <div style="font-size:0.7rem;color:#9aab9c;text-align:center;margin-top:0.5rem;">No cost · No commitment · 48-hr response</div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('fge-estimate-modal');
  const closeBtn = document.getElementById('fge-modal-close');
  const ctaBtn = document.getElementById('fge-modal-cta');
  
  let modalShown = false;

  const showModal = () => {
    if (modalShown) return;
    modalShown = true;
    modal.classList.add('fge-modal-show');
    if (typeof gtag === 'function') {
      gtag('event', 'modal_view', { modal_name: 'estimate_modal', page: window.location.pathname });
    }
    if (typeof window.clarity === 'function') {
      window.clarity('event', 'estimate_modal_shown');
    }
    // Start modal countdown ticker
    const MODAL_DEADLINE = new Date('2027-03-31T23:59:59+05:30').getTime();
    const p2 = n => String(n).padStart(2,'0');
    function tickModal() {
      const diff = Math.max(0, MODAL_DEADLINE - Date.now());
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4) / 1e3);
      const $ = id => document.getElementById(id);
      if ($('modal-sct-days')) $('modal-sct-days').textContent = d;
      if ($('modal-sct-d'))    $('modal-sct-d').textContent = d;
      if ($('modal-sct-h'))    $('modal-sct-h').textContent = p2(h);
      if ($('modal-sct-m'))    $('modal-sct-m').textContent = p2(m);
      if ($('modal-sct-s'))    $('modal-sct-s').textContent = p2(s);
    }
    tickModal();
    const modalTicker = setInterval(tickModal, 1000);
    // Clear when modal removed
    setTimeout(() => clearInterval(modalTicker), 365 * 24 * 3600e3);
  };

  const closeModal = (action) => {
    modal.classList.remove('fge-modal-show');
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    if (action === 'cta') {
      if (typeof gtag === 'function') {
        gtag('event', 'modal_cta_click', { modal_name: 'estimate_modal', page: window.location.pathname });
      }
      if (typeof window.clarity === 'function') {
        window.clarity('event', 'estimate_modal_converted');
      }
    } else {
      if (typeof gtag === 'function') {
        gtag('event', 'modal_dismissed', { modal_name: 'estimate_modal', page: window.location.pathname });
      }
      if (typeof window.clarity === 'function') {
        window.clarity('event', 'estimate_modal_closed');
      }
    }
    setTimeout(() => { modal.remove(); }, 300);
  };

  closeBtn.addEventListener('click', () => closeModal('dismiss'));
  ctaBtn.addEventListener('click', () => closeModal('cta'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal('dismiss');
  });

  // Trigger after 10 seconds or 50% scroll
  setTimeout(showModal, 10000);
  
  const scrollTrigger = () => {
    if (modalShown) return;
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrolled > 0.5) {
      showModal();
      window.removeEventListener('scroll', scrollTrigger);
    }
  };
  window.addEventListener('scroll', scrollTrigger, { passive: true });
}

// Ensure the modal initializes after the main initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEstimateModal);
} else {
  initEstimateModal();
}

