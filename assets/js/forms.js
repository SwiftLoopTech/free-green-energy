/* ============================================================
   FGE SOLAR - FORMS JS
   Lead form submission via Google Forms
   ============================================================ */

(function() {
  'use strict';

  const GOOGLE_FORMS = {
    contact: {
      endpoint: 'https://docs.google.com/forms/d/e/1FAIpQLSfW4FuP6obBtvlDD0Jd6T8Qp3FXknxCwm_1gGAm0FFzGB_LAg/formResponse',
      entry: 'entry.372346092',
      label: 'Contact & site visit request'
    },
    calculator: {
      endpoint: 'https://docs.google.com/forms/d/e/1FAIpQLSfVYY6MSyinyQhNoOqahp7LPaK3eRZ379UCw-GYEZ-78TdiiQ/formResponse',
      entry: 'entry.2115047199',
      label: 'Solar calculator quote request'
    },
    home_energy_check: {
      endpoint: 'https://docs.google.com/forms/d/e/1FAIpQLSeBHVzkyMB86UiJEJbofORpck0Zgs2IK6Tk-5NEXycUhSrWJQ/formResponse',
      entry: 'entry.2013841671',
      label: 'Home Energy Check request'
    },
    'pm-surya-ghar-checklist': {
      endpoint: 'https://docs.google.com/forms/d/e/1FAIpQLScgm6aFfbtuNZgLnmgXupsAyTiep357dWg3QxjNjrpn-kcIag/formResponse',
      entry: 'entry.372346092',
      label: 'PM Surya Ghar checklist request'
    }
  };

  const EXCLUDED_FIELDS = new Set([
    'access_key',
    'subject',
    'from_name',
    'botcheck',
    'captcha_answer',
    'h-captcha-response',
    'g-recaptcha-response'
  ]);

  const FIELD_LABELS = {
    name: 'Name',
    mobile: 'Mobile / WhatsApp',
    phone: 'Mobile / WhatsApp',
    email: 'Email',
    district: 'District',
    monthly_bill: 'Monthly electricity bill',
    property_type: 'Property type',
    lead_source: 'Lead source',
    recommended_system_size: 'Recommended system size',
    estimated_system_cost: 'Estimated system cost',
    subsidy_estimate: 'Estimated subsidy',
    net_investment: 'Estimated cost after subsidy',
    monthly_savings_estimate: 'Estimated monthly savings',
    payback_estimate: 'Estimated payback period',
    message: 'Message / notes',
    interest: 'Interest',
    audit_score: 'Energy Check score',
    audit_readiness: 'Solar readiness',
    audit_recommendation: 'Energy Check recommendation',
    roof_profile: 'Roof profile',
    ac_profile: 'Air-conditioner profile',
    water_heating: 'Water-heating profile',
    utm_source: 'UTM source',
    utm_medium: 'UTM medium',
    utm_campaign: 'UTM campaign',
    utm_content: 'UTM content',
    fbclid: 'Facebook click ID',
    landing_page: 'Landing page'
  };

  let responseFrame;

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

  function setupSimpleCaptcha(form) {
    const captcha = form.querySelector('[data-captcha="simple"]');
    if (!captcha) {
      return null;
    }

    const question = captcha.querySelector('[data-captcha-question]');
    const input = captcha.querySelector('[data-captcha-input]');
    const firstNumber = Math.floor(Math.random() * 8) + 2;
    const secondNumber = Math.floor(Math.random() * 7) + 3;
    const answer = String(firstNumber + secondNumber);

    if (question) {
      question.textContent = `${firstNumber} + ${secondNumber}`;
    }

    if (input) {
      input.value = '';
      input.dataset.captchaAnswer = answer;
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('inputmode', 'numeric');
    }

    return input;
  }

  function isCaptchaValid(input) {
    return !input || input.value.trim() === input.dataset.captchaAnswer;
  }

  function labelForField(name) {
    return FIELD_LABELS[name] || name.replace(/[_-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
  }

  function displayValue(form, name, value) {
    const control = form.elements[name];
    if (control && control.tagName === 'SELECT' && control.selectedIndex >= 0) {
      return control.options[control.selectedIndex].text.trim() || value;
    }

    return String(value).trim();
  }

  function buildLeadDetails(form, config) {
    const details = [
      `Lead type: ${config.label}`,
      `Page: ${window.location.href}`,
      `Submitted (UTC): ${new Date().toISOString()}`
    ];

    new FormData(form).forEach((value, name) => {
      if (EXCLUDED_FIELDS.has(name) || value instanceof File) {
        return;
      }

      const cleanedValue = displayValue(form, name, value);
      if (cleanedValue) {
        details.push(`${labelForField(name)}: ${cleanedValue}`);
      }
    });

    return details.join('\n');
  }

  function getResponseFrame() {
    if (responseFrame && document.body.contains(responseFrame)) {
      return responseFrame;
    }

    responseFrame = document.createElement('iframe');
    responseFrame.name = 'fge-google-forms-response';
    responseFrame.title = 'Google Forms response';
    responseFrame.hidden = true;
    responseFrame.setAttribute('aria-hidden', 'true');
    document.body.appendChild(responseFrame);
    return responseFrame;
  }

  function submitToGoogleForm(config, details) {
    const submission = document.createElement('form');
    const field = document.createElement('input');
    const frame = getResponseFrame();
    let cleanupTimer;

    function cleanup() {
      window.clearTimeout(cleanupTimer);
      submission.remove();
    }

    submission.method = 'post';
    submission.action = config.endpoint;
    submission.target = frame.name;
    submission.style.display = 'none';

    field.type = 'hidden';
    field.name = config.entry;
    field.value = details;
    submission.appendChild(field);
    document.body.appendChild(submission);
    frame.addEventListener('load', cleanup, { once: true });
    submission.submit();
    cleanupTimer = window.setTimeout(cleanup, 10000);
  }

  getResponseFrame();

  document.querySelectorAll('form[data-lead]').forEach((form) => {
    const btn = form.querySelector('[type="submit"]');
    const successMsg = form.querySelector('.form-success, .lead-form-status.form-success') ||
      form.parentElement?.querySelector('.form-success, .lead-form-status.form-success');
    const errorMsg = form.querySelector('.form-error, .lead-form-status.form-error');
    const originalButtonHtml = btn ? btn.innerHTML : '';
    let captchaInput = setupSimpleCaptcha(form);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      setMessage(successMsg, '');
      setMessage(errorMsg, '');

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!isCaptchaValid(captchaInput)) {
        setMessage(errorMsg, 'Please type the correct CAPTCHA answer before sending your request.');
        if (captchaInput) {
          captchaInput.focus();
        }
        return;
      }

      const source = form.dataset.lead || form.id || 'website-form';
      const config = GOOGLE_FORMS[source];
      if (!config) {
        setMessage(errorMsg, 'This form is not configured yet. Please contact us on WhatsApp.');
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
      }

      try {
        submitToGoogleForm(config, buildLeadDetails(form, config));
        form.reset();
        captchaInput = setupSimpleCaptcha(form);
        setMessage(successMsg, successMsg ? successMsg.dataset.message : 'Thanks—your request has been sent.');

        if (successMsg) {
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (typeof gtag === 'function') {
          gtag('event', 'lead_form_submit', {
            form_id: source,
            form_label: config.label,
            page: window.location.pathname
          });
          gtag('event', 'generate_lead', {
            lead_source: source
          });
        }

        // Clarity — specific tag per form type
        if (typeof window.clarity === 'function') {
          const clarityTagMap = {
            'contact': 'contact_form_lead',
            'calculator': 'calculator_lead',
            'home_energy_check': 'energy_check_lead',
            'pm-surya-ghar-checklist': 'checklist_lead'
          };
          const clarityTag = clarityTagMap[source] || 'generic_form_lead';
          window.clarity('event', clarityTag);
        }

        window.dispatchEvent(new CustomEvent('fge:lead-submitted', {
          detail: {
            source,
            page: window.location.pathname
          }
        }));
      } catch (error) {
        setMessage(errorMsg, 'We could not send your request. Please try again or contact us on WhatsApp.');

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
