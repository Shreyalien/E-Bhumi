'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

// Mock browser globals for app.js evaluation in Node environment
global.window = { addEventListener: () => {}, location: { hash: '' } };
global.document = {
  addEventListener: () => {},
  documentElement: { lang: '' },
  querySelector: () => ({ addEventListener: () => {} }),
  querySelectorAll: () => []
};
global['$'] = () => null;
global['$$'] = () => [];
global.localStorage = { getItem: () => null, setItem: () => {} };

let code = fs.readFileSync('app.js', 'utf8');
code = code.replace(/^\s*\(\(\)\s*=>\s*\{/, '').replace(/\}\)\(\);\s*$/, '');
code += '\nglobal.routeCitizenProblem = routeCitizenProblem; global.VERIFIED_SERVICE_DIRECTORY = VERIFIED_SERVICE_DIRECTORY;\n';
eval(code);

test('AI Service Router (#71) - Verified Service Directory structure and integrity', () => {
  assert(Array.isArray(global.VERIFIED_SERVICE_DIRECTORY), 'VERIFIED_SERVICE_DIRECTORY should be an array');
  assert(global.VERIFIED_SERVICE_DIRECTORY.length >= 12, 'Directory should contain at least 12 verified services');

  for (const s of global.VERIFIED_SERVICE_DIRECTORY) {
    assert(s.id, 'Service must have an id');
    assert(s.name, `Service ${s.id} must have a name`);
    assert(s.authority, `Service ${s.id} must have an authority`);
    assert(s.categoryKey, `Service ${s.id} must have a categoryKey`);
    assert(s.sourceCitation, `Service ${s.id} must cite official R&D v1.4 source`);
    assert(Array.isArray(s.keywords), `Service ${s.id} must have keywords array`);
    assert(Array.isArray(s.citizenNextSteps), `Service ${s.id} must have citizenNextSteps`);

    // Guardrail: if URL is provided, it must be an official verified gov.bd domain from R&D v1.4
    if (s.officialPortalUrl) {
      assert(s.officialPortalUrl.includes('.gov.bd'), `URL for ${s.id} must be an official gov.bd domain: ${s.officialPortalUrl}`);
      assert.equal(s.urlVerified, true, `Official URL for ${s.id} must be marked verified`);
    } else {
      assert.equal(s.isOnlineSubmission, false, `Services without portal must require in-person office submission`);
    }
  }
});

test('AI Service Router (#71) - Clear routing for mutation (Bangla and English)', () => {
  const r1 = global.routeCitizenProblem('আমি জমি কিনেছি, এখন খারিজ করতে চাই');
  assert.equal(r1.status, 'RECOMMENDED');
  assert.equal(r1.service.id, 'mutation');
  assert.equal(r1.service.officialPortalUrl, 'https://mutation.land.gov.bd/');
  assert.equal(r1.service.urlVerified, true);
  assert(r1.rationale.includes('খারিজ') || r1.rationale.includes('জমি'));
  assert(r1.nextSteps.length > 0);
  assert(r1.guardrail.includes('আইনি'));

  const r2 = global.routeCitizenProblem('How do I apply for online mutation / namjari?');
  assert.equal(r2.status, 'RECOMMENDED');
  assert.equal(r2.service.id, 'mutation');
});

test('AI Service Router (#71) - Clear routing for land development tax', () => {
  const r = global.routeCitizenProblem('জমির খাজনা দিতে চাই, বকেয়া কর কীভাবে পরিশোধ করব?');
  assert.equal(r.status, 'RECOMMENDED');
  assert.equal(r.service.id, 'tax');
  assert.equal(r.service.officialPortalUrl, 'https://ldtax.gov.bd/');
  assert.equal(r.service.urlVerified, true);
  assert(r.nextSteps.some(s => s.includes('ldtax.gov.bd')));
});

test('AI Service Router (#71) - Clear routing for certified khatian / porcha copy', () => {
  const r = global.routeCitizenProblem('খতিয়ানের পর্চা তুলতে চাই, সার্টিফাইড কপি দরকার');
  assert.equal(r.status, 'RECOMMENDED');
  assert.equal(r.service.id, 'khatian');
  assert.equal(r.service.officialPortalUrl, 'https://land.gov.bd/');
});

test('AI Service Router (#71) - Clear routing for record correction / miss case', () => {
  const r = global.routeCitizenProblem('খতিয়ানে নামের বানান ভুল এসেছে, রেকর্ড সংশোধন করতে মিসকেস করতে হবে');
  assert.equal(r.status, 'RECOMMENDED');
  assert.equal(r.service.id, 'dispute-correction');
  assert.equal(r.service.officialPortalUrl, 'https://case.gov.bd/');
});

test('AI Service Router (#71) - Clear routing for inheritance & faraiz distribution', () => {
  const r = global.routeCitizenProblem('বাবার মৃত্যুর পর পৈতৃক সম্পত্তি ওয়ারিশদের মধ্যে বণ্টন করতে চাই');
  assert.equal(r.status, 'RECOMMENDED');
  assert.equal(r.service.id, 'inheritance');
});

test('AI Service Router (#71) - Clear routing for boundary dispute with government surveyor', () => {
  const r = global.routeCitizenProblem('প্রতিবেশী সীমানা দখল করছে, সরকারি আমিন দিয়ে জমি মাপতে চাই');
  assert.equal(r.status, 'RECOMMENDED');
  assert.equal(r.service.id, 'boundary-survey');
  assert.equal(r.service.isOnlineSubmission, false, 'Boundary survey requires office application at AC Land');
});

test('AI Service Router (#71) - Clear routing for CHT special land governance', () => {
  const r = global.routeCitizenProblem('রাঙামাটি পার্বত্য জেলায় হেডম্যানের প্রতিবেদন ও সার্কেল চিফের অনুমতি');
  assert.equal(r.status, 'RECOMMENDED');
  assert.equal(r.service.id, 'cht-special');
  assert.equal(r.service.officialPortalUrl, 'https://mochta.gov.bd/');
  assert.equal(r.service.isOnlineSubmission, false);
});

test('AI Service Router (#71) - Ambiguous input triggers clarifying question without blind guessing', () => {
  // Broad vague problem statement
  const r = global.routeCitizenProblem('আমার জমি নিয়ে সমস্যা হচ্ছে');
  assert.equal(r.status, 'AMBIGUOUS');
  assert.equal(r.confidence, 'low');
  assert(r.clarification !== null, 'Ambiguous input must have clarifying options');
  assert(r.clarification.options.length >= 3, 'Must present at least 3 clarifying choices');
  assert(r.clarification.question.length > 5);

  // Equal keyword multi-match query
  const rMulti = global.routeCitizenProblem('দলিল তল্লাশ ও নামজারি দুটিই');
  assert.equal(rMulti.status, 'AMBIGUOUS');
  assert(rMulti.clarification !== null);
});

test('AI Service Router (#71) - Resolving ambiguity via selected category option', () => {
  const resolved = global.routeCitizenProblem('আমার জমি নিয়ে সমস্যা হচ্ছে', { selectedCategory: 'mutation' });
  assert.equal(resolved.status, 'RECOMMENDED');
  assert.equal(resolved.service.id, 'mutation');
});

test('AI Service Router (#71) - Out of scope / no match queries handled honestly', () => {
  const r1 = global.routeCitizenProblem('পাসপোর্ট রিনিউ করার নিয়ম কী?');
  assert.equal(r1.status, 'NO_MATCH');
  assert.equal(r1.confidence, 'none');
  assert.equal(r1.service, null);
  assert(r1.rationale.includes('মেলেনি'));
  assert(r1.nextSteps.some(s => s.includes('16122')));
  assert(r1.guardrail.includes('কোনো কাল্পনিক সেবা'));

  const r2 = global.routeCitizenProblem('weather forecast tomorrow');
  assert.equal(r2.status, 'NO_MATCH');

  const r3 = global.routeCitizenProblem('');
  assert.equal(r3.status, 'EMPTY_INPUT');
});

test('AI Service Router (#71) - Guardrail integrity across all recommendation responses', () => {
  const queries = [
    'খারিজ করতে চাই',
    'খাজনা দেব',
    'মৌজা নকশা লাগবে',
    'খাস জমি বন্দোবস্ত',
    'অধিগ্রহণ ক্ষতিপূরণ',
    'দলিল তল্লাশ'
  ];

  for (const q of queries) {
    const res = global.routeCitizenProblem(q);
    assert(res.guardrail, 'Must provide guardrail disclaimer');
    assert(res.guardrail.includes('আইনি') || res.guardrail.includes('মালিকানা'), 'Guardrail must emphasize legal/title caution');
  }
});
