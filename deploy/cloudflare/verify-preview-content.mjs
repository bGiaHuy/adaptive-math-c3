import assert from 'node:assert/strict';
import { readFile, writeFile, access } from 'node:fs/promises';
const base = 'https://adaptive-math-c3-candidate.adaptive-learning-c3.workers.dev';
const qa = JSON.parse(await readFile('.cache/c3-cloudflare-qa.json', 'utf8'));
const evidence = JSON.parse(await readFile('.cache/cloudflare-live-regression.json', 'utf8'));
assert.equal(evidence.project, 'otpekgrqjnzjecieiqra');
const checks = [];
async function api(path, status, actor, method = 'GET', body) {
  const response = await fetch(base + '/api/v1' + path, {
    method, headers: { origin: base, ...(actor?.cookie ? { cookie: actor.cookie } : {}), ...(body && !(body instanceof FormData) ? { 'content-type': 'application/json' } : {}) },
    ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30000)
  });
  assert.equal(response.status, status, `${method} ${path}`);
  assert.match(response.headers.get('cache-control'), /no-store/);
  checks.push({ method, path, status });
  return response;
}
for (const name of ['teacher', 'other', 'student']) {
  const r = await api('/auth/login', 200, null, 'POST', { identifier: qa[name].identifier, password: qa[name].password });
  qa[name].cookie = r.headers.get('set-cookie').split(';')[0];
}
const classes = await (await api('/classrooms', 200, qa.teacher)).json();
const classId = classes.find(c => c.name.startsWith('Cloudflare QA')).id;
const customQuestions = [
  { difficulty: 'EASY', questionType: 'SINGLE_CHOICE', content: 'Cloudflare QA: Giá trị log_2(8) bằng bao nhiêu?', options: ['3', '2', '4', '8'].map((content, i) => ({ key: 'ABCD'[i], content })), correctOption: 'A' },
  { difficulty: 'MEDIUM', questionType: 'TRUE_FALSE', content: 'Cloudflare QA: Xét các mệnh đề.', statements: [{ key: 'a', content: '2 + 2 = 4', isCorrect: true }, { key: 'b', content: '3 là số chẵn', isCorrect: false }, { key: 'c', content: '5 là số nguyên tố', isCorrect: true }, { key: 'd', content: '1 > 2', isCorrect: false }] },
  { difficulty: 'HARD', questionType: 'SHORT_ANSWER', content: 'Cloudflare QA: Tính 1/2.', shortAnswer: { mode: 'NUMERIC', acceptedAnswers: ['0.5'], instructions: 'Nhập số, không ghi đơn vị.' } }
];
const created = await (await api(`/classrooms/${classId}/assignments`, 201, qa.teacher, 'POST', { title: 'Cloudflare QA all question types', durationMinutes: 30, questionCounts: { SINGLE_CHOICE: 1, TRUE_FALSE: 1, SHORT_ANSWER: 1 }, customQuestions })).json();
const id = created.assignment.id;
const taken = (await (await api(`/assignments/${id}/take`, 200, qa.student)).json()).assignment;
assert.deepEqual(taken.questions.map(q => q.questionType), ['SINGLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER']);
assert.equal(taken.questions[0].options.length, 4);
assert.ok(!('isCorrect' in taken.questions[1].statements[0]));
assert.ok(!('shortAnswer' in taken.questions[2]));
const answers = [{ questionId: taken.questions[0].id, selectedOptionKey: 'A' }, { questionId: taken.questions[1].id, response: { trueFalseAnswers: { a: true, b: false, c: true, d: false } } }, { questionId: taken.questions[2].id, response: { shortAnswer: '0,5' } }];
const submitted = await (await api(`/assignments/${id}/submit`, 200, qa.student, 'POST', { timeSpentSeconds: 10, answers })).json();
assert.equal(submitted.score, 10);
const report = await (await api(`/classrooms/${classId}/assignments/${id}/submissions`, 200, qa.teacher)).json();
assert.equal(report.questions[0].options.find(x => x.isCorrect).optionKey, 'A');
assert.deepEqual(report.questions[2].shortAnswer.acceptedAnswers, ['0.5']);
const bytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1kAAAAASUVORK5CYII=', 'base64');
const form = new FormData(); form.append('file', new Blob([bytes], { type: 'image/png' }), 'cloudflare-qa.png');
const { document: doc } = await (await api('/assignments/documents', 201, qa.teacher, 'POST', form)).json();
assert.ok(doc.id);
const downloaded = await api(`/assignments/documents/${doc.id}/file`, 200, qa.teacher);
assert.deepEqual(Buffer.from(await downloaded.arrayBuffer()), bytes);
await api(`/assignments/documents/${doc.id}/file`, 403, qa.other);
await api(`/assignments/documents/${doc.id}/file`, 403, qa.student);
const materials = await (await api('/curriculum/materials', 200, qa.student)).json();
assert.ok(materials.items.length > 0);
await api(`/curriculum/materials/${materials.items[0].id}/file`, 404, qa.teacher);
const questions = await (await api('/curriculum/materials/questions', 200, qa.student)).json();
const illustrated = questions.items.find(q => q.images?.length);
assert.ok(illustrated);
const image = await api(`/curriculum/materials/questions/${illustrated.id}/images/1`, 200, qa.student);
assert.match(image.headers.get('content-type'), /image\/png/);
const manifest = JSON.parse(await readFile('.cache/cloudflare-release-ce14155/content/thpt-materials/bulk-review.json', 'utf8'));
const missing = [];
for (const asset of Object.values(manifest.assets)) {
  try { await access(`.cache/cloudflare-release-ce14155/outputs/thpt-extracted-batches/${asset.batch}/${asset.path}`); }
  catch { missing.push(`${asset.batch}/${asset.path}`); }
}
assert.equal(missing.length, 0, 'All manifest-referenced bulk images must be packaged');
const result = { pass: true, base, project: evidence.project, at: new Date().toISOString(), checks, allQuestionTypesScore: submitted.score, packagedBulkImages: Object.keys(manifest.assets).length, assignmentId: id, classId, documentBytesMatch: true };
await writeFile('.cache/cloudflare-live-content.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify({ pass: true, requests: checks.length, packagedBulkImages: result.packagedBulkImages, allQuestionTypesScore: submitted.score }));
