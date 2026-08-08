/* ============================================================
   FGE SOLAR — CALCULATOR JS
   Kerala solar savings & ROI calculator
   ============================================================ */

(function() {
  'use strict';

  /* ── Constants ────────────────────────────────────────── */
  const SYSTEM_COST_PER_KW  = 65000;  // ₹ avg installed cost
  const SUBSIDY_MAX         = 78000;  // ₹ cap at 3kW
  const PANEL_LIFE          = 25;     // years
  const DEGRADATION         = 0.005;  // 0.5%/yr
  const CO2_PER_KW          = 1.4;    // tonnes/yr/kW

  /*
   * KSERC LT-I domestic energy charges effective 01 Apr 2025–31 Mar 2027.
   * Up to 250 units is telescopic. Above 250 units, the applicable
   * non-telescopic rate is charged on the full monthly consumption.
   * The calculator deliberately excludes duty, fuel surcharge, meter rent,
   * ToD effects and other bill-specific adjustments.
   */
  const DOMESTIC_TELESCOPIC_SLABS = [
    { limit: 50,  rate: 3.35 },
    { limit: 100, rate: 4.25 },
    { limit: 150, rate: 5.35 },
    { limit: 200, rate: 7.20 },
    { limit: 250, rate: 8.50 }
  ];

  function domesticEnergyCharge(units) {
    const value = Math.max(0, units);

    if (value > 500) return value * 9.20;
    if (value > 400) return value * 8.25;
    if (value > 350) return value * 7.95;
    if (value > 300) return value * 7.60;
    if (value > 250) return value * 6.75;

    let remaining = value;
    let previousLimit = 0;
    let total = 0;
    DOMESTIC_TELESCOPIC_SLABS.forEach(({ limit, rate }) => {
      const slabUnits = Math.max(0, Math.min(remaining, limit - previousLimit));
      total += slabUnits * rate;
      remaining -= slabUnits;
      previousLimit = limit;
    });
    return total;
  }

  function domesticFixedCharge(units) {
    if (units <= 50) return 50;
    if (units <= 100) return 85;
    if (units <= 150) return 105;
    if (units <= 200) return 140;
    if (units <= 250) return 160;
    if (units <= 300) return 220;
    if (units <= 350) return 240;
    if (units <= 400) return 260;
    if (units <= 500) return 285;
    return 310;
  }

  function estimateDomesticUnits(monthlyBill) {
    let bestUnits = 1;
    let smallestDifference = Infinity;

    for (let units = 1; units <= 2000; units += 1) {
      const modelledBill = domesticEnergyCharge(units) + domesticFixedCharge(units);
      const difference = Math.abs(modelledBill - monthlyBill);
      if (difference < smallestDifference) {
        bestUnits = units;
        smallestDifference = difference;
      }
    }
    return bestUnits;
  }

  function pmSuryaGharSubsidy(systemKW) {
    const firstTwoKW = Math.min(Math.max(systemKW, 0), 2);
    const thirdKW = Math.min(Math.max(systemKW - 2, 0), 1);
    return Math.min(
      Math.round((firstTwoKW * 30000) + (thirdKW * 18000)),
      SUBSIDY_MAX
    );
  }

  /* Peak sun hours by district */
  const SUN_HOURS = {
    thiruvananthapuram: 5.5,
    kollam:             5.3,
    pathanamthitta:     5.2,
    alappuzha:          5.0,
    kottayam:           5.0,
    idukki:             4.8,
    ernakulam:          5.2,
    thrissur:           5.3,
    palakkad:           5.8,
    malappuram:         5.1,
    kozhikode:          5.0,
    wayanad:            4.7,
    kannur:             5.0,
    kasaragod:          5.1,
    other:              5.0
  };

  /* ── Format helpers ───────────────────────────────────── */
  function formatIndian(num) {
    num = Math.round(num);
    if (num >= 100000) {
      const lakhs = num / 100000;
      return '₹' + lakhs.toFixed(1) + ' L';
    }
    return '₹' + num.toLocaleString('en-IN');
  }

  function formatCrore(num) {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
    if (num >= 100000)   return (num / 100000).toFixed(1) + ' L';
    return formatIndian(num);
  }

  /* ── Core Calculation ─────────────────────────────────── */
  function calculate(monthlyBill, district, roofType, homeType) {
    const sunHrs = SUN_HOURS[district] || SUN_HOURS.other;

    // Step 1: Infer domestic monthly consumption from current LT-I charges.
    const unitsPerMonth = estimateDomesticUnits(monthlyBill);

    // Step 2: Recommended system size
    const dailyUnitsNeeded = unitsPerMonth / 30;
    const rawSystemKW = dailyUnitsNeeded / (sunHrs * 0.8);
    const systemKW = Math.max(1, Math.ceil(rawSystemKW * 2) / 2); // round to 0.5 kW

    // Flat roof efficiency modifier (slightly lower due to fixed tilt)
    const roofMod = roofType === 'flat' ? 0.95 : 1.0;

    // Step 3: System cost
    const grossCost = systemKW * SYSTEM_COST_PER_KW;

    // Step 4: PM Surya Ghar CFA: ₹30k/kW for first 2 kW + ₹18k for third kW.
    const subsidy = pmSuryaGharSubsidy(systemKW);
    const netCost = grossCost - subsidy;

    // Step 5: Indicative avoided domestic energy charge at current tariff.
    const estimatedMonthlyGeneration = systemKW * sunHrs * 30 * 0.8 * roofMod;
    const solarOffsetUnits = Math.min(unitsPerMonth, estimatedMonthlyGeneration);
    const remainingGridUnits = Math.max(0, unitsPerMonth - solarOffsetUnits);
    const monthlySavings = Math.max(
      0,
      domesticEnergyCharge(unitsPerMonth) - domesticEnergyCharge(remainingGridUnits)
    );
    const annualSavings = monthlySavings * 12;

    // Step 6: Payback
    const paybackYears = netCost / annualSavings;

    // Step 7: 25-year savings in today's tariff terms; no tariff-hike promise.
    let totalSavings = 0;
    for (let yr = 1; yr <= PANEL_LIFE; yr++) {
      const yearSaving = annualSavings * Math.max(0, 1 - DEGRADATION * (yr - 1));
      totalSavings += yearSaving;
    }
    const netTotalSavings = totalSavings - netCost;

    // Step 8: CO2 offset
    const co2PerYear = systemKW * CO2_PER_KW;

    return {
      systemKW,
      grossCost,
      subsidy,
      netCost,
      monthlySavings: Math.round(monthlySavings),
      annualSavings:  Math.round(annualSavings),
      paybackYears:   paybackYears,
      totalSavings:   Math.round(totalSavings),
      netTotalSavings: Math.round(netTotalSavings),
      co2PerYear:     co2PerYear.toFixed(1),
      sunHours:       sunHrs,
      unitsPerMonth:  unitsPerMonth
    };
  }

  /* ── UI ───────────────────────────────────────────────── */
  const form    = document.getElementById('calc-form');
  const results = document.getElementById('calc-results');
  const billInput    = document.getElementById('calc-bill');
  const districtSel  = document.getElementById('calc-district');
  const roofSel      = document.getElementById('calc-roof');
  const homeSel      = document.getElementById('calc-home');
  const billSlider   = document.getElementById('calc-bill-slider');
  const billDisplay  = document.getElementById('calc-bill-display');
  const leadCta      = document.getElementById('res-lead-cta');
  const leadCapture  = document.getElementById('calculator-lead-capture');
  let latestLeadState = null;

  if (!form) return; // Not on calculator page

  /* Sync slider ↔ input */
  if (billSlider && billInput) {
    billSlider.addEventListener('input', () => {
      billInput.value = billSlider.value;
      if (billDisplay) billDisplay.textContent = '₹' + parseInt(billSlider.value).toLocaleString('en-IN');
    });

    billInput.addEventListener('input', () => {
      const val = parseInt(billInput.value) || 0;
      if (billSlider) billSlider.value = Math.min(val, parseInt(billSlider.max));
      if (billDisplay) billDisplay.textContent = '₹' + val.toLocaleString('en-IN');
    });
  }

  /* Form submit */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const bill     = parseInt(billInput?.value) || 0;
    const district = districtSel?.value || 'other';
    const roof     = roofSel?.value || 'sloped';
    const home     = homeSel?.value || 'house';

    if (bill < 500) {
      showError('Please enter a monthly bill of at least ₹500 to get accurate results.');
      return;
    }

    if (home === 'commercial') {
      showError('This calculator uses KSEB domestic tariffs and residential subsidy rules. Please request a commercial load-profile assessment.');
      return;
    }

    const res = calculate(bill, district, roof, home);
    displayResults(res, bill, district, roof, home);

    // Run conversion upgrades
    updateMoneyLost(res.monthlySavings);
    updateDistrictProof(district);
    updateKSEBProjection(bill);
    updateNeighbourBadge(res.systemKW, res.monthlySavings);
    showStickyBar(res.monthlySavings, res.netCost);
    showWhatNext();
    updateLeadCTACopy(res.subsidy, res.netCost);

    // Track
    if (typeof gtag === 'function') {
      gtag('event', 'calculator_completed', {
        bill_amount: bill,
        district: district,
        system_kw: res.systemKW
      });
    }
    if (typeof window.clarity === 'function') {
      window.clarity('event', 'calculator_result_seen');
    }

    // Scroll to results
    if (results) {
      setTimeout(() => {
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  });

  if (leadCta && leadCapture) {
    leadCta.addEventListener('click', () => {
      if (leadCapture.hidden) {
        leadCapture.hidden = false;
        leadCapture.classList.add('is-active');
        leadCta.setAttribute('aria-expanded', 'true');
        leadCta.innerHTML = 'Your Result Is Ready <small>Complete the short form below</small>';
      }

      if (typeof gtag === 'function') {
        gtag('event', 'calculator_lead_cta_clicked', {
          lead_source: 'calculator_results_cta',
          system_kw: latestLeadState?.systemKW || 'unknown'
        });
      }
      if (typeof window.clarity === 'function') {
        window.clarity('event', 'calculator_converted');
      }

      window.setTimeout(() => {
        leadCapture.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('lead-name')?.focus({ preventScroll: true });
      }, 80);
    });
  }

  function displayResults(r, bill, district, roof, home) {
    if (!results) return;

    // Update result elements
    setEl('res-system-size',  r.systemKW + ' kW');
    setEl('res-gross-cost',   formatIndian(r.grossCost));
    setEl('res-subsidy',      '₹' + r.subsidy.toLocaleString('en-IN'));
    setEl('res-net-cost',     formatIndian(r.netCost));
    setEl('res-monthly-save', '₹' + r.monthlySavings.toLocaleString('en-IN') + '/mo');
    setEl('res-annual-save',  '₹' + r.annualSavings.toLocaleString('en-IN') + '/yr');
    setEl('res-payback',      r.paybackYears.toFixed(1) + ' years');
    setEl('res-25yr-savings', formatCrore(r.netTotalSavings));
    setEl('res-co2',          r.co2PerYear + ' tonnes/yr');

    // Payback bar
    const paybackBar = document.getElementById('res-payback-bar');
    if (paybackBar) {
      const pct = Math.min((r.paybackYears / 6) * 100, 100);
      paybackBar.style.width = pct + '%';
    }

    // Build WhatsApp pre-filled message
    const districtName = selectedOptionText(districtSel, district || 'Not specified');
    const waMsg = `Hi FGE Solar, my monthly KSEB bill is ₹${bill.toLocaleString('en-IN')} and I'm in ${districtName}. The calculator showed I could save ₹${r.monthlySavings.toLocaleString('en-IN')}/month with a ${r.systemKW}kW system. Can you confirm this and arrange a free site visit?`;
    const waBtn = document.getElementById('res-wa-btn');
    if (waBtn) {
      waBtn.href = `https://wa.me/918089073029?text=${encodeURIComponent(waMsg)}`;
    }

    syncLeadEstimate(r, bill, districtName, roof, home);

    // Show results
    results.classList.add('is-visible', 'fade-up', 'visible');
  }

  function setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setLeadField(id, value) {
    const field = document.getElementById(id);
    if (field) {
      field.value = value;
      field.defaultValue = value;
    }
  }

  function selectedOptionText(select, fallback) {
    if (!select || !select.value) return fallback;
    return select.options[select.selectedIndex]?.text || fallback;
  }

  function syncLeadEstimate(r, bill, districtName, roof, home) {
    const roofName = selectedOptionText(roofSel, roof || 'Not specified');
    const propertyName = selectedOptionText(homeSel, home || 'Not specified');
    const grossCost = formatIndian(r.grossCost);
    const subsidy = '₹' + r.subsidy.toLocaleString('en-IN');
    const netCost = formatIndian(r.netCost);
    const monthlySavings = '₹' + r.monthlySavings.toLocaleString('en-IN') + '/month';
    const payback = r.paybackYears.toFixed(1) + ' years';

    latestLeadState = { systemKW: r.systemKW };

    setLeadField('lead-monthly-bill', '₹' + bill.toLocaleString('en-IN') + ' per month');
    setLeadField('lead-district', districtName);
    setLeadField('lead-roof-profile', roofName);
    setLeadField('lead-property-type', propertyName);
    setLeadField('lead-system-size', r.systemKW + ' kW');
    setLeadField('lead-gross-cost', grossCost);
    setLeadField('lead-subsidy', subsidy);
    setLeadField('lead-net-cost', netCost);
    setLeadField('lead-monthly-savings', monthlySavings);
    setLeadField('lead-payback', payback);

    setEl('res-lead-summary', `Your latest ${r.systemKW} kW plan is estimated at ${netCost} after a ${subsidy} subsidy, with about ${monthlySavings} in savings. We’ll attach these details to your request.`);
    setEl('lead-capture-copy', `We’ll attach this ${r.systemKW} kW estimate, ${netCost} net price and your KSEB details automatically. Just share your name and WhatsApp number.`);
  }

  function showError(msg) {
    const err = document.getElementById('calc-error');
    if (err) {
      err.textContent = msg;
      err.style.display = 'block';
      setTimeout(() => { err.style.display = 'none'; }, 4000);
    }
  }

  // ── CONVERSION UPGRADES ────────────────────────────────────────────────

  /* 1. PM Surya Ghar Subsidy Countdown (March 31, 2027 23:59:59 IST) */
  const SUBSIDY_DEADLINE = new Date('2027-03-31T23:59:59+05:30').getTime();

  function pad2(n) { return String(n).padStart(2, '0'); }

  function calcCountdown() {
    const now  = Date.now();
    const diff = Math.max(0, SUBSIDY_DEADLINE - now);
    const totalDays  = Math.floor(diff / 864e5);
    const months     = Math.floor(totalDays / 30.44);
    const days       = Math.floor(totalDays % 30.44);
    const hours      = Math.floor((diff % 864e5) / 36e5);
    const mins       = Math.floor((diff % 36e5)  / 6e4);
    return { months, days, hours, mins };
  }

  function updateSubsidyCountdown() {
    const { months, days, hours, mins } = calcCountdown();
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('sct-days',  months);   // now shows months
    set('sct-hours', pad2(days));   // now shows days
    set('sct-mins',  pad2(hours));
    set('sct-secs',  pad2(mins));
    set('sticky-sct-days', months + ' months');
  }

  // Start countdown immediately and tick every second
  updateSubsidyCountdown();
  setInterval(updateSubsidyCountdown, 1000);

  /* 2. Money Lost Card */
  function updateMoneyLost(monthlySavings) {
    const card = document.getElementById('money-lost-card');
    const val  = document.getElementById('money-lost-value');
    if (!card || !val) return;
    // Months since Jan 1, 2026
    const jan2026 = new Date('2026-01-01T00:00:00+05:30').getTime();
    const monthsElapsed = Math.max(1, Math.floor((Date.now() - jan2026) / (30.44 * 864e5)));
    const lostAmount = monthlySavings * monthsElapsed;
    val.textContent = '₹' + lostAmount.toLocaleString('en-IN');
    card.classList.add('is-shown');
  }

  /* 3. District Social Proof */
  const DISTRICT_DATA = {
    'thiruvananthapuram': { installs: 38, payback: 3.6, label: 'Thiruvananthapuram' },
    'kollam':             { installs: 24, payback: 3.7, label: 'Kollam' },
    'pathanamthitta':     { installs: 18, payback: 3.8, label: 'Pathanamthitta' },
    'alappuzha':          { installs: 21, payback: 3.9, label: 'Alappuzha' },
    'kottayam':           { installs: 27, payback: 3.7, label: 'Kottayam' },
    'idukki':             { installs: 12, payback: 3.6, label: 'Idukki' },
    'ernakulam':          { installs: 46, payback: 3.5, label: 'Ernakulam / Kochi' },
    'thrissur':           { installs: 31, payback: 3.6, label: 'Thrissur' },
    'palakkad':           { installs: 19, payback: 3.5, label: 'Palakkad' },
    'malappuram':         { installs: 22, payback: 3.7, label: 'Malappuram' },
    'kozhikode':          { installs: 29, payback: 3.6, label: 'Kozhikode' },
    'wayanad':            { installs: 14, payback: 3.8, label: 'Wayanad' },
    'kannur':             { installs: 23, payback: 3.7, label: 'Kannur' },
    'kasaragod':          { installs: 16, payback: 3.8, label: 'Kasaragod' },
  };

  function updateDistrictProof(district) {
    const box  = document.getElementById('district-proof');
    const text = document.getElementById('district-proof-text');
    if (!box || !text) return;
    const d = DISTRICT_DATA[district];
    if (d) {
      text.innerHTML = `<strong>${d.installs} families in ${d.label}</strong> installed with FGE Solar this year. Average payback in your district: <strong>${d.payback} years</strong>.`;
    } else {
      text.innerHTML = 'Hundreds of Kerala families have already switched to solar with FGE Solar this year.';
    }
    box.classList.add('is-shown');
  }

  /* 4. KSEB Tariff Projection */
  function updateKSEBProjection(bill) {
    const card    = document.getElementById('kseb-proj-card');
    const today   = document.getElementById('proj-today');
    const yr5     = document.getElementById('proj-5yr');
    if (!card || !today || !yr5) return;
    const bill5yr = Math.round(bill * Math.pow(1.08, 5));
    const fmt = n => '₹' + n.toLocaleString('en-IN');
    today.textContent = fmt(bill) + '/mo';
    yr5.textContent   = fmt(bill5yr) + '/mo';
    card.classList.add('is-shown');
  }

  /* 5. Neighbour Badge */
  function updateNeighbourBadge(systemKW, monthlySavings) {
    const badge = document.getElementById('neighbour-badge');
    const text  = document.getElementById('neighbour-badge-text');
    if (!badge || !text) return;
    const savingsFmt = '₹' + monthlySavings.toLocaleString('en-IN');
    text.innerHTML = `People with similar bills in Kerala typically go for <strong>${systemKW} kW systems</strong> and save <strong>${savingsFmt}/month</strong> with FGE Solar.`;
    badge.classList.add('is-shown');
  }

  /* 6. Sticky Bar */
  let stickyBarShown = false;
  function showStickyBar(monthlySavings, netCost) {
    const bar      = document.getElementById('calc-sticky-bar');
    const savingEl = document.getElementById('sticky-bar-savings');
    const ctaBtn   = document.getElementById('sticky-bar-cta');
    if (!bar) return;
    if (savingEl) {
      savingEl.textContent = `Save ₹${monthlySavings.toLocaleString('en-IN')}/month — Book your free site visit`;
    }
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        document.getElementById('res-lead-cta')?.click();
        bar.classList.add('is-hidden');
        fgeEvent('sticky_bar_cta_click', { monthly_savings: monthlySavings }, 'sticky_bar_converted');
      });
    }
    // Hide sticky bar once lead form is submitted
    window.addEventListener('fge:lead-submitted', () => {
      bar.classList.remove('is-visible');
      bar.classList.add('is-hidden');
    }, { once: true });

    // Show after short delay
    setTimeout(() => {
      bar.classList.add('is-visible');
      stickyBarShown = true;
      fgeEvent('sticky_bar_shown', { monthly_savings: monthlySavings }, 'sticky_bar_shown');
    }, 1200);
  }

  /* 7. What Happens Next */
  function showWhatNext() {
    const el = document.getElementById('what-next-section');
    if (el) el.classList.add('is-shown');
  }

  /* 8. Personalised Lead CTA copy */
  function updateLeadCTACopy(subsidy, netCost) {
    const h3  = document.getElementById('result-lead-title');
    const cta = document.getElementById('res-lead-cta');
    const now = Date.now();
    const daysLeft = Math.floor(Math.max(0, SUBSIDY_DEADLINE - now) / 864e5);
    if (h3) {
      h3.textContent = `Lock in your ₹${subsidy.toLocaleString('en-IN')} subsidy — only ${daysLeft} days left`;
    }
    if (cta) {
      cta.innerHTML = `Book Free Site Visit<small>No cost · No commitment · Results sent to WhatsApp</small>`;
    }
  }


})();
