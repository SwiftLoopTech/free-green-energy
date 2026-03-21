/* ============================================================
   FGE SOLAR — CALCULATOR JS
   Kerala solar savings & ROI calculator
   ============================================================ */

(function() {
  'use strict';

  /* ── Constants ────────────────────────────────────────── */
  const KSEB_RATE_HIGH      = 7.50;   // ₹/unit (highest slab)
  const SYSTEM_COST_PER_KW  = 65000;  // ₹ avg installed cost
  const SUBSIDY_PER_KW      = 18000;  // ₹/kW (PM Surya Ghar)
  const SUBSIDY_MAX         = 78000;  // ₹ cap at 3kW
  const BILL_REDUCTION      = 0.85;   // 85% of bill eliminated
  const PANEL_LIFE          = 25;     // years
  const DEGRADATION         = 0.005;  // 0.5%/yr
  const TARIFF_HIKE         = 0.05;   // 5% annual increase
  const CO2_PER_KW          = 1.4;    // tonnes/yr/kW

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

    // Step 1: Estimate monthly units consumed
    const unitsPerMonth = monthlyBill / KSEB_RATE_HIGH;

    // Step 2: Recommended system size
    const dailyUnitsNeeded = unitsPerMonth / 30;
    const rawSystemKW = dailyUnitsNeeded / (sunHrs * 0.8);
    const systemKW = Math.max(1, Math.ceil(rawSystemKW * 2) / 2); // round to 0.5 kW

    // Flat roof efficiency modifier (slightly lower due to fixed tilt)
    const roofMod = roofType === 'flat' ? 0.95 : 1.0;

    // Step 3: System cost
    const grossCost = systemKW * SYSTEM_COST_PER_KW;

    // Step 4: Subsidy
    const subsidyKW = Math.min(systemKW, 3);
    const subsidy = Math.min(subsidyKW * SUBSIDY_PER_KW, SUBSIDY_MAX);
    const netCost = grossCost - subsidy;

    // Step 5: Monthly savings
    const monthlySavings = monthlyBill * BILL_REDUCTION * roofMod;
    const annualSavings = monthlySavings * 12;

    // Step 6: Payback
    const paybackYears = netCost / annualSavings;

    // Step 7: 25-year total savings (with compound tariff hike + degradation)
    let totalSavings = 0;
    for (let yr = 1; yr <= PANEL_LIFE; yr++) {
      const yearSaving = annualSavings
        * Math.pow(1 + TARIFF_HIKE, yr)
        * (1 - DEGRADATION * yr);
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
      sunHours:       sunHrs
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

    const res = calculate(bill, district, roof, home);
    displayResults(res, bill, district);

    // Track
    if (typeof gtag === 'function') {
      gtag('event', 'calculator_completed', {
        bill_amount: bill,
        district: district,
        system_kw: res.systemKW
      });
    }

    // Scroll to results
    if (results) {
      setTimeout(() => {
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  });

  function displayResults(r, bill, district) {
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
    const districtName = districtSel?.options[districtSel.selectedIndex]?.text || district;
    const waMsg = `Hi FGE Solar, my monthly KSEB bill is ₹${bill.toLocaleString('en-IN')} and I'm in ${districtName}. The calculator showed I could save ₹${r.monthlySavings.toLocaleString('en-IN')}/month with a ${r.systemKW}kW system. Can you confirm this and arrange a free site visit?`;
    const waBtn = document.getElementById('res-wa-btn');
    if (waBtn) {
      waBtn.href = `https://wa.me/918089073029?text=${encodeURIComponent(waMsg)}`;
    }

    // Pre-fill district in lead form
    const leadDistrict = document.getElementById('lead-district');
    if (leadDistrict && districtSel) {
      leadDistrict.value = districtSel.options[districtSel.selectedIndex]?.text || '';
    }

    // Show results
    results.style.display = 'block';
    results.classList.add('fade-up', 'visible');
  }

  function setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function showError(msg) {
    const err = document.getElementById('calc-error');
    if (err) {
      err.textContent = msg;
      err.style.display = 'block';
      setTimeout(() => { err.style.display = 'none'; }, 4000);
    }
  }

})();
