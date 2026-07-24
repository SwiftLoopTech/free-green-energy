/* FGE Solar — Home Energy Check: calculator, attribution, and lead tracking. */
(function () {
  'use strict';

  const checkForm = document.getElementById('energy-check-form');
  const report = document.getElementById('energy-report');
  const leadForm = document.getElementById('energy-lead-form');
  const state = {};
  const attributionKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];

  function track(eventName, properties) {
    const payload = Object.assign({ page: window.location.pathname }, properties || {});
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, payload));
    if (typeof window.gtag === 'function') window.gtag('event', eventName, payload);
    if (typeof window.fbq === 'function') window.fbq('trackCustom', eventName, payload);
  }

  function formatMoney(value) {
    return '₹' + Number(value).toLocaleString('en-IN');
  }

  function getAttribution() {
    const params = new URLSearchParams(window.location.search);
    const stored = JSON.parse(window.sessionStorage.getItem('fge_energy_attribution') || '{}');
    const result = Object.assign({}, stored);
    attributionKeys.forEach((key) => {
      if (params.get(key)) result[key] = params.get(key);
    });
    result.landing_page = window.location.href;
    window.sessionStorage.setItem('fge_energy_attribution', JSON.stringify(result));
    return result;
  }

  function fillAttribution() {
    const attribution = getAttribution();
    document.querySelectorAll('[data-attribution]').forEach((field) => {
      field.value = attribution[field.dataset.attribution] || '';
    });
  }

  function selectedValue(name) {
    const input = document.querySelector('input[name="' + name + '"]:checked');
    return input ? input.value : '';
  }

  function getSolarWindow(bill) {
    if (bill < 1500) return { size: '1–2 kW', budget: 'Smaller-system or efficiency-first review', subsidy: 'Up to ₹60,000 for eligible residential systems' };
    if (bill < 3500) return { size: '2–3 kW', budget: 'Planning band: roughly ₹1.3–2.1 lakh before subsidy', subsidy: 'Indicative subsidy range: ₹60,000–₹78,000 if eligible' };
    if (bill < 6500) return { size: '3–5 kW', budget: 'Planning band: roughly ₹2.0–3.5 lakh before subsidy', subsidy: 'Eligible residential subsidy is capped at ₹78,000' };
    if (bill < 10000) return { size: '5–7 kW', budget: 'Planning band: roughly ₹3.2–4.8 lakh before subsidy', subsidy: 'Eligible residential subsidy is capped at ₹78,000' };
    return { size: '7 kW+', budget: 'A custom energy and roof assessment is the right next step', subsidy: 'Eligible residential subsidy is capped at ₹78,000' };
  }

  function calculate(values) {
    const bill = values.monthlyBill;
    const ownedRoof = values.roof === 'open' || values.roof === 'tiled';
    const solarWindow = getSolarWindow(bill);
    let score = 48;
    if (bill >= 3000) score += 13;
    else if (bill >= 1500) score += 7;
    if (values.roof === 'open') score += 22;
    if (values.roof === 'tiled') score += 13;
    if (values.roof === 'shaded') score -= 8;
    if (values.roof === 'apartment') score -= 18;
    if (values.acCount === '2plus') score += 5;
    if (values.waterHeating === 'electric') score += 5;
    score = Math.max(24, Math.min(95, score));

    const hasHighCooling = values.acCount === '2plus';
    const hasElectricWaterHeating = values.waterHeating === 'electric';
    let result;
    if (ownedRoof && score >= 70) {
      result = {
        readiness: 'Solar-ready',
        title: 'Solar looks like a strong first move for this home.',
        copy: 'Your bill level and roof profile suggest that a site-specific solar plan is worth doing now. We would verify shade, structure and daytime use before committing to a system size.',
        priorityOne: ['Plan the right system—not the biggest one.', 'A roof inspection and a recent KSEB bill will narrow this to a safe, useful system size.'],
        priorityThree: ['Book a roof and energy review.', 'Ask for a site visit that confirms the roof, output and an itemised price.']
      };
    } else if (values.roof === 'apartment') {
      result = {
        readiness: 'Efficiency first',
        title: 'Start with the apartment’s controllable energy loads.',
        copy: 'A shared roof can make personal rooftop solar harder to plan. We would first map the highest-use appliances and check whether the association has a common-area solar opportunity.',
        priorityOne: ['Check roof access and association options.', 'Shared-roof permission matters before a private solar estimate becomes useful.'],
        priorityThree: ['Request an appliance-use plan.', 'FGE can help prioritise the changes that reduce the bill without relying on roof access.']
      };
    } else if (values.roof === 'shaded') {
      result = {
        readiness: 'Roof review needed',
        title: 'Measure the shade before choosing solar.',
        copy: 'The roof may still work, but heavy shade is exactly where a quick generic quote can be misleading. First verify the clear roof area and the hours of direct sun.',
        priorityOne: ['Map clear roof space.', 'A site visit should identify the shade-free zones before a system size or price is recommended.'],
        priorityThree: ['Make the low-risk savings first.', 'Use appliance and water-heating improvements while the roof opportunity is assessed.']
      };
    } else {
      result = {
        readiness: 'Efficiency first',
        title: 'Reduce the expensive loads, then size solar properly.',
        copy: 'With this bill level or roof profile, the best return may start with a few practical efficiency changes. A smaller, well-matched solar plan can follow once the base load is clearer.',
        priorityOne: ['Understand the base load.', 'Separate fixed daily use from seasonal AC and water-heating use before committing to a solar capacity.'],
        priorityThree: ['Ask for a practical upgrade sequence.', 'A home check can identify which action should happen first and which can wait.']
      };
    }

    if (hasHighCooling) {
      result.priorityTwo = ['Cooling is a major signal.', 'Two or more ACs make usage patterns and efficient settings worth reviewing alongside solar.'];
    } else if (hasElectricWaterHeating) {
      result.priorityTwo = ['Review water heating.', 'An electric heater can be a concentrated load; ask whether solar water heating is relevant for this home.'];
    } else {
      result.priorityTwo = ['Track daytime use for one week.', 'The more useful daytime consumption you have, the easier it is to use rooftop solar well.'];
    }

    return Object.assign({ score, solarWindow }, result);
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function updateLeadFields() {
    document.querySelectorAll('[data-audit-field]').forEach((field) => {
      field.value = state[field.dataset.auditField] || '';
    });
  }

  function updateWhatsApp() {
    const link = document.getElementById('energy-whatsapp');
    if (!link) return;
    const message = [
      'Hi FGE Solar, I completed the Home Energy Check.',
      'My KSEB bill is about ' + formatMoney(state.monthly_bill) + '/month in ' + state.district + '.',
      'The report showed: ' + state.readiness + ' — ' + state.recommendation,
      'Can you help me plan a site visit?'
    ].join(' ');
    link.href = 'https://wa.me/918089073029?text=' + encodeURIComponent(message);
  }

  function displayReport(result) {
    setText('report-score', result.score);
    setText('report-score-label', result.readiness);
    setText('report-score-copy', 'A quick indicator of how ready this home is for the next energy upgrade.');
    setText('recommendation-title', result.title);
    setText('recommendation-copy', result.copy);
    setText('solar-size', result.solarWindow.size);
    setText('solar-window-copy', result.solarWindow.budget + '. ' + result.solarWindow.subsidy + '.');
    setText('priority-one-title', result.priorityOne[0]);
    setText('priority-one-copy', result.priorityOne[1]);
    setText('priority-two-title', result.priorityTwo[0]);
    setText('priority-two-copy', result.priorityTwo[1]);
    setText('priority-three-title', result.priorityThree[0]);
    setText('priority-three-copy', result.priorityThree[1]);
    const ring = document.getElementById('score-ring');
    if (ring) window.requestAnimationFrame(() => { ring.style.setProperty('--score', result.score); });
  }

  function makeValues() {
    return {
      monthlyBill: Number(document.getElementById('monthly-bill').value),
      district: document.getElementById('district').value,
      roof: selectedValue('roof'),
      acCount: selectedValue('ac_count'),
      waterHeating: selectedValue('water_heating')
    };
  }

  if (checkForm) {
    checkForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!checkForm.checkValidity()) {
        checkForm.reportValidity();
        return;
      }
      const values = makeValues();
      const result = calculate(values);
      Object.assign(state, {
        score: String(result.score), readiness: result.readiness, recommendation: result.title,
        monthly_bill: String(values.monthlyBill), district: values.district, roof: values.roof,
        ac_count: values.acCount, water_heating: values.waterHeating
      });
      displayReport(result);
      updateLeadFields();
      updateWhatsApp();
      report.classList.add('is-visible');
      track('energy_check_completed', { bill_band: values.monthlyBill >= 6500 ? '6500_plus' : values.monthlyBill >= 3500 ? '3500_6499' : values.monthlyBill >= 1500 ? '1500_3499' : 'under_1500', district: values.district, roof_profile: values.roof, readiness: result.readiness, score: result.score });
      if (typeof window.fbq === 'function') window.fbq('track', 'ViewContent', { content_name: 'Home Energy Check Report', content_category: result.readiness });
      window.setTimeout(() => report.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    });

    let started = false;
    checkForm.addEventListener('focusin', () => {
      if (!started) { started = true; track('energy_check_started'); }
    });
  }

  document.querySelectorAll('[data-track]').forEach((link) => {
    link.addEventListener('click', () => {
      const action = link.dataset.track;
      track(action, { location: action });
      if (action === 'report_whatsapp' && typeof window.fbq === 'function') window.fbq('track', 'Contact', { content_name: 'Home Energy Check WhatsApp' });
    });
  });

  window.addEventListener('fge:lead-submitted', (event) => {
    if (!event.detail || event.detail.source !== 'home_energy_check') return;
    track('generate_lead', { lead_source: 'home_energy_check', readiness: state.readiness || 'unknown', score: state.score || 'unknown' });
    if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'FGE Home Energy Check', content_category: state.readiness || 'unknown' });
  });

  fillAttribution();
}());
