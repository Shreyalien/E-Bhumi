'use strict';

function calculatorWorkspace() {
  return toolsPage().replace('যাচাই, area ও share proposal', 'Land Calculator · জমির হিসাব') + `
    <div class="grid two">
      <form class="panel" id="localUnitForm">
        <h2>Local unit worksheet</h2>
        <p class="help">Enter the square-foot convention supplied for your location. Katha and bigha vary; this app does not choose a legal standard.</p>
        <label>Area (decimal)<input name="area" type="number" min="0" step="any" value="10" required></label>
        <label>Local unit name<input name="unit" maxlength="50" placeholder="Katha / Bigha" required></label>
        <label>Square feet per local unit<input name="sqft" type="number" min="0.000001" step="any" required></label>
        <div class="actions"><button class="btn primary">Calculate local units</button></div>
        <div class="result" id="localUnitResult" role="status">Enter your local convention.</div>
      </form>
      <form class="panel" id="valueForm">
        <h2>Land value & budget worksheet</h2>
        <label>Area (decimal)<input name="area" type="number" min="0.000001" step="any" required></label>
        <label>Agreed price per decimal (BDT)<input name="rate" type="number" min="0" step="any" required></label>
        <label>Additional budget entered by you (BDT)<input name="extra" type="number" min="0" step="any" value="0" required></label>
        <div class="actions"><button class="btn primary">Calculate budget</button></div>
        <div class="result" id="valueResult" role="status">No official valuation, tax or registration fee is calculated.</div>
      </form>
    </div><section class="panel"><div class="actions">${btn('Download latest calculation', 'export-calculation')}</div><p class="help">Calculation results stay in memory for this visit. Export a copy before leaving.</p></section>`;
}

function appointmentsWorkspace() {
  const list = scopedApplications(['appointment']);
  return heading('VISITS & LOCAL QUEUE', 'Appointments & Queue', 'Request → support review → token. Rescheduling requires fresh support confirmation.', '<a class="btn primary" href="#service/appointment">＋ Request appointment</a>') +
    `<section class="panel"><h2>How the visit process works</h2><p>Choose an office, future Dhaka date/time and assistance needs, attach the reference and submit. Support reviews and issues a demo token. Each local office/time has four sandbox places; no government slot is booked.</p></section><div class="grid two">${list.map(a => `
      <article class="card"><div class="actions">${badge(a.status)}</div><h2>${esc(a.details.office || 'Office not chosen')}</h2>
      <p>${esc(a.details.visitDate || 'Date not chosen')} · ${esc(a.details.slot || 'Time not chosen')} (Asia/Dhaka)</p><p>${esc(a.id)}<br>${esc(a.details.assistance || 'No assistance preference')}</p>
      <div class="actions"><a class="btn" href="#application/${a.id}">Open request →</a>${appointmentActions(a)}</div></article>`).join('') || '<section class="panel"><p>No visits yet. Start an appointment request.</p></section>'}</div>`;
}

function appointmentActions(a) {
  if (a.ownerId !== state.user.id) return '';
  let result = '';
  if (!['Draft', 'Cancelled', 'Rejected', 'Withdrawn'].includes(a.status)) result += btn('Reschedule', 'appointment-dialog', `data-id="${a.id}" data-kind="reschedule"`) + btn('Cancel appointment', 'appointment-dialog', `data-id="${a.id}" data-kind="cancel"`);
  if (a.status === 'Completed') result += btn('Download token', 'appointment-token', `data-id="${a.id}"`) + btn('Add to calendar (.ics)', 'appointment-calendar', `data-id="${a.id}"`);
  return result;
}

function filterPaymentLedger() {
  const query = normalize($('#paymentSearch')?.value || ''), status = $('#paymentStatus')?.value || 'all';
  $('#paymentResults').innerHTML = paymentTable(state.payments.filter(p => (status === 'all' || p.status === status) && normalize([p.receipt, p.applicationId, p.amount].join(' ')).includes(query)));
}

function filterCaseRegister() {
  const query = normalize($('#caseSearch').value), status = $('#caseStatus').value;
  $('#caseResults').innerHTML = applicationTable(scopedApplications(['revenue-case', 'review', 'appeal', 'rent-case', 'complaint']).filter(a => (status === 'all' || a.status === status) && normalize(a.id + ' ' + a.service.name + ' ' + Object.values(a.details).join(' ')).includes(query)));
}

function installWorkflowFeatures() {
  const oldPayments = paymentsPage;
  paymentsPage = () => {
    if (!applicant() && state.user.role !== 'finance') return oldPayments();
    const due = state.applications.filter(a => a.ownerId === state.user.id && ['AwaitingPayment', 'PaymentFailed'].includes(a.status));
    return heading('SANDBOX FINANCE', state.user.role === 'finance' ? 'Payment reconciliation' : 'Payments & Receipts', 'Pay a local demand, retry a failed attempt and download the recorded receipt. No real money is used.') +
      (applicant() ? `<section class="panel"><h2>Payment due · ${due.length} requests</h2>${due.length ? `<div class="table-wrap"><table><thead><tr><th>Request / service</th><th>Demand</th><th>Status</th><th>Action</th></tr></thead><tbody>${due.map(a => `<tr><td><a href="#application/${a.id}">${esc(a.id)}</a><br>${esc(a.service.en)}</td><td>${a.service.sandboxFee} sandbox units</td><td>${badge(a.status)}</td><td>${btn(a.status === 'PaymentFailed' ? 'Retry payment' : 'Pay demand', 'checkout', `data-id="${a.id}"`, true)}</td></tr>`).join('')}</tbody></table></div>` : '<p>No unpaid sandbox demands. Staff approval creates a demand for a fee-bearing service.</p><a class="btn" href="#applications">View application progress →</a>'}</section>` : '') +
      `<section class="panel"><h2>Transaction history</h2><div class="toolbar"><input id="paymentSearch" type="search" aria-label="Search transactions" placeholder="Receipt, request or amount…"><select id="paymentStatus" aria-label="Payment status"><option value="all">All results</option><option>Successful</option><option>Failed</option></select></div><div id="paymentResults">${paymentTable(state.payments)}</div><div class="actions">${btn('Download ledger CSV', 'export-payments')}</div></section>`;
  };
  const oldCases = caseRegister;
  caseRegister = (title, description, ids) => {
    if (title !== 'Cases & Complaints') return oldCases(title, description, ids);
    const list = scopedApplications(ids);
    return heading('CASE REGISTER', title, description) + `<section class="panel"><h2>Choose the right process</h2><div class="grid two">${ids.map(id => { const s = service(id); return `<article class="card"><h3>${esc(s.en)}</h3><p>${esc(s.description)}</p><a class="btn" href="#service/${id}">Prepare full request →</a></article>`; }).join('')}</div><p class="help">Submit evidence, respond to corrections, follow hearings, pay a sample demand when required, and download the reasoned outcome. Legal forum and filing deadlines need separate official confirmation.</p></section><section class="panel"><div class="toolbar"><input id="caseSearch" type="search" aria-label="Search cases" placeholder="Reference, facts or service…"><select id="caseStatus" aria-label="Case status"><option value="all">All statuses</option>${[...new Set(list.map(a => a.status))].map(s => `<option>${esc(s)}</option>`).join('')}</select></div><div id="caseResults">${applicationTable(list)}</div></section>`;
  };
  const oldDiligence = diligenceWorkspace;
  diligenceWorkspace = () => oldDiligence() + `<section class="panel"><h2>Tracked due-diligence reviews</h2><p>The checklist is preparation. Submit the separate review for evidence inspection, correction, payment and a downloadable local report.</p>${applicationTable(scopedApplications(['due-diligence']))}</section>`;
  const oldDetail = detail;
  detail = a => oldDetail(a) + (a.serviceId === 'appointment' ? `<section class="panel"><h2>Appointment controls</h2><p>Current slot: ${esc(a.details.visitDate || 'Not selected')} · ${esc(a.details.slot || '')} (Asia/Dhaka). A reschedule invalidates the previous token and returns the request to support.</p><div class="actions">${appointmentActions(a)}</div></section>` : '') +
    (a.ownerId === state.user.id && ['Completed', 'Rejected'].includes(a.status) && ['revenue-case', 'review', 'appeal', 'rent-case'].includes(a.serviceId) ? `<section class="panel"><h2>Prepare a linked follow-up</h2><p>The previous case remains unchanged. Its reference and land context are copied into a new draft; review the facts and attach the required evidence.</p><div class="actions">${btn('Prepare review', 'linked-case', `data-id="${a.id}" data-service="review"`)}${btn('Prepare appeal', 'linked-case', `data-id="${a.id}" data-service="appeal"`)}</div></section>` : '');

  Object.assign(actionHandlers, {
    async 'linked-case'(el) {
      const source = getApp(el.dataset.id);
      let a = (await api('/applications', {method: 'POST', body: {serviceId: el.dataset.service}})).application;
      a = (await api('/applications/' + a.id, {method: 'PATCH', body: {revision: a.revision, details: {...source.details, eligibility: false, order: source.id, grounds: ''}, documentIds: []}})).application;
      await replaceApp(a); state.step = 0; location.hash = 'wizard/' + a.id;
    },
    'appointment-dialog'(el) {
      const a = getApp(el.dataset.id), reschedule = el.dataset.kind === 'reschedule';
      modal(reschedule ? 'Reschedule local appointment' : 'Cancel local appointment', `<form id="appointmentForm" data-id="${a.id}" data-kind="${el.dataset.kind}"><p>${esc(a.id)} · ${esc(a.details.office)}</p>${reschedule ? `<label>Future date (Dhaka)<input name="visitDate" type="date" value="${esc(a.details.visitDate)}" required></label><label>Preferred time<select name="slot">${service('appointment').fields.find(f => f.key === 'slot').options.map(slot => `<option ${a.details.slot === slot ? 'selected' : ''}>${slot}</option>`).join('')}</select></label><div class="actions">${btn('Check local availability', 'appointment-availability', `type="button" data-id="${a.id}"`)}</div><p id="slotAvailability" role="status"></p>` : ''}<label>Reason<textarea name="note" maxlength="4000" required></textarea></label><p class="help">${reschedule ? 'Support must review and issue a new token. Previous token becomes invalid.' : 'Cancellation is final for this request; history remains available.'}</p><button class="btn primary">Confirm ${reschedule ? 'reschedule' : 'cancellation'}</button><p id="modalError" class="error" role="alert"></p></form>`);
    },
    async 'appointment-availability'(el) {
      const form = $('#appointmentForm'), a = getApp(el.dataset.id);
      const result = await api('/appointment-slots?date=' + encodeURIComponent(form.elements.visitDate.value) + '&office=' + encodeURIComponent(a.details.office));
      $('#slotAvailability').textContent = result.slots.map(s => s.slot + ': ' + (s.available ? 'Available' : 'Full / past')).join(' · ');
    },
    'appointment-token'(el) { const a = getApp(el.dataset.id); if (a.status !== 'Completed') throw Error('Support must issue a token first'); download(a.id + '-DEMO-token.html', outcomeHTML(a), 'text/html;charset=utf-8'); },
    'appointment-calendar'(el) {
      const a = getApp(el.dataset.id); if (a.status !== 'Completed') throw Error('Support must issue a token first');
      const clean = value => String(value).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
      const utc = value => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
      const start = Date.parse(a.details.visitDate + 'T' + a.details.slot + ':00+06:00');
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//e-Bhumi//Local sandbox//EN', 'BEGIN:VEVENT', 'UID:' + a.id + '@demo.ebhumi.local', 'DTSTAMP:' + utc(Date.now()), 'DTSTART:' + utc(start), 'DTEND:' + utc(start + 1800000), 'SUMMARY:DEMO e-Bhumi appointment', 'LOCATION:' + clean(a.details.office), 'DESCRIPTION:' + clean('DEMO only; no government booking. Current token: ' + a.outcome.id + '. Recheck the app after changes.'), 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
      download(a.id + '-DEMO-appointment.ics', ics, 'text/calendar;charset=utf-8');
    },
    'export-calculation'() { if (!state.calculation) { toast('Run a calculator first'); return; } download('land-calculation.json', JSON.stringify(state.calculation, null, 2)); }
  });
  document.addEventListener('input', e => { if (e.target.id === 'paymentSearch') filterPaymentLedger(); if (e.target.id === 'caseSearch') filterCaseRegister(); });
  document.addEventListener('change', e => { if (e.target.id === 'paymentStatus') filterPaymentLedger(); if (e.target.id === 'caseStatus') filterCaseRegister(); });
  document.addEventListener('submit', async e => {
    const form = e.target;
    if (!['appointmentForm', 'localUnitForm', 'valueForm', 'areaForm', 'compareForm', 'shareForm'].includes(form.id)) return;
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form)), button = e.submitter;
    try {
      if (form.id === 'appointmentForm') {
        if (button) button.disabled = true;
        const a = getApp(form.dataset.id);
        const result = await api('/applications/' + a.id + '/appointment', {method: 'POST', body: {...data, revision: a.revision, action: form.dataset.kind}});
        await replaceApp(result.application); await refresh(); closeModal(); await render(); toast('Appointment ' + form.dataset.kind + ' saved');
      }
      if (form.id === 'localUnitForm') {
        const area = Number(data.area), unit = Number(data.sqft);
        if (!Number.isFinite(area) || area < 0 || !Number.isFinite(unit) || unit <= 0) throw Error('Enter a finite nonnegative area and positive unit size');
        $('#localUnitResult').textContent = (area * 435.6 / unit).toFixed(6) + ' ' + data.unit + ' using your convention of ' + unit + ' sq ft/unit.';
      }
      if (form.id === 'valueForm') {
        const area = Number(data.area), rate = Number(data.rate), extra = Number(data.extra), total = area * rate + extra;
        if (![area, rate, extra, total].every(Number.isFinite) || area <= 0 || rate < 0 || extra < 0) throw Error('Enter a positive area and finite nonnegative costs');
        $('#valueResult').textContent = 'Land: BDT ' + (area * rate).toLocaleString('en-BD') + ' · Total budget: BDT ' + total.toLocaleString('en-BD') + ' (your inputs; no official fees).';
      }
      if (form.id !== 'appointmentForm') {
        const target = {areaForm:'areaResult', compareForm:'compareResult', shareForm:'shareResult', localUnitForm:'localUnitResult', valueForm:'valueResult'}[form.id];
        state.calculation = {tool:form.id, inputs:data, result:$('#' + target).textContent, at:new Date().toISOString(), mode:'Preparation worksheet; not a legal determination or official valuation'};
      }
    } catch (error) { if ($('#modalError')) $('#modalError').textContent = error.message; toast(error.message); }
    finally { if (button) button.disabled = false; }
  });
}
