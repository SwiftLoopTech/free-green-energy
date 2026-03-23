/* ============================================================
   FGE SOLAR - FORMS JS
   Lead form submission via Web3Forms
   ============================================================ */

(function() {
  'use strict';

  const PLACEHOLDER_KEYS = new Set([
    '',
    'YOUR_WEB3FORMS_KEY',
    'YOUR_WEB3FORMS_ACCESS_KEY',
    'YOUR_ACCESS_KEY_HERE'
  ]);

  function setMessage(element, message) {
    if (!element) {
      return;
    }

    const shouldShow = Boolean(message);
    element.style.display = shouldShow ? (element.dataset.display || 'block') : 'none';

    const body = element.querySelector('[data-form-message-body]');
    if (body) {
      body.textContent = message || '';
      return;
    }

    element.textContent = message || '';
  }

  function getCaptchaResponse(form) {
    const field = form.querySelector('textarea[name="h-captcha-response"]');
    return field ? field.value.trim() : '';
  }

  function resetCaptcha() {
    if (window.hcaptcha && typeof window.hcaptcha.reset === 'function') {
      try {
        window.hcaptcha.reset();
      } catch (error) {
        // Ignore captcha reset failures so they do not break form UX.
      }
    }
  }

  document.querySelectorAll('form[data-lead]').forEach((form) => {
    const btn = form.querySelector('[type="submit"]');
    const successMsg = form.querySelector('.form-success, .lead-form-status.form-success');
    const errorMsg = form.querySelector('.form-error, .lead-form-status.form-error');
    const accessKeyInput = form.querySelector('input[name="access_key"]');
    const subjectInput = form.querySelector('input[name="subject"]');
    const fromNameInput = form.querySelector('input[name="from_name"]');
    const hasCaptcha = Boolean(form.querySelector('.h-captcha[data-captcha="true"]'));
    const originalButtonHtml = btn ? btn.innerHTML : '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      setMessage(successMsg, '');
      setMessage(errorMsg, '');

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const accessKey = accessKeyInput ? accessKeyInput.value.trim() : '';
      if (PLACEHOLDER_KEYS.has(accessKey)) {
        setMessage(errorMsg, 'Form setup is incomplete. Add the live Web3Forms access key before going to production.');
        return;
      }

      if (hasCaptcha && !getCaptchaResponse(form)) {
        setMessage(errorMsg, 'Please complete the CAPTCHA before sending your request.');
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
      }

      const data = new FormData(form);

      if (!subjectInput || !subjectInput.value.trim()) {
        data.set('subject', 'New lead from FGE Solar website');
      }

      if (!fromNameInput || !fromNameInput.value.trim()) {
        data.set('from_name', 'FGE Solar Website');
      }

      data.set('page', window.location.pathname);
      data.set('source', form.dataset.lead || form.id || 'website-form');

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: data,
          headers: {
            Accept: 'application/json'
          }
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Submission failed');
        }

        form.reset();
        resetCaptcha();
        setMessage(successMsg, successMsg ? successMsg.dataset.message : '');

        if (successMsg) {
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (typeof gtag === 'function') {
          gtag('event', 'form_submitted', {
            form_id: form.dataset.lead || form.id,
            page: window.location.pathname
          });
        }
      } catch (err) {
        setMessage(
          errorMsg,
          err && err.message ? err.message : 'We could not send your request. Please try again or contact us on WhatsApp.'
        );

        if (errorMsg) {
          errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalButtonHtml;
        }
      }
    });
  });
})();
