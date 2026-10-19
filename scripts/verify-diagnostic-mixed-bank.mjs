import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const e = JSON.parse(await fs.readFile('docs/evidence/math-question-types/api.json', 'utf8'));
const base = 'http://127.0.0.1:3000/api/v1';
async function api(path, body, cookie, expected = 200) {
  const r = await fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers: { 'content-type': 'application/json', origin: 'http://127.0.0.1:3000', ...(cookie ? { cookie } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  const data = await r.json(); assert.equal(r.status, expected, JSON.stringify(data));
  return { data, cookie: r.headers.getSetCookie().map(x => x.split(';')[0]).join('; ') };
}
const teacher = (await api('/auth/login', { identifier: e.credentials.teacherEmail, password: e.credentials.password })).cookie;
const bank = (await api('/admin/questions', undefined, teacher)).data;
const resumeQa = process.argv.includes('--resume-qa');
const username = resumeQa ? e.credentials.studentUsername : 'qa_entry_' + Date.now();
if (!resumeQa) await api('/auth/register/student', { username, email: username + '@adaptivemath.local', fullName: 'QA đầu vào ba dạng', password: e.credentials.password }, undefined, 201);
const student = (await api('/auth/login', { identifier: username, password: e.credentials.password })).cookie;
const start = (await api('/diagnostic/start', {}, student, 201)).data;
let question = start.currentQuestion; const types = [], ids = new Set();
while (question) {
  assert.ok(!ids.has(question.id)); ids.add(question.id); types.push(question.questionType);
  assert.ok(!question.shortAnswer); assert.ok(!question.explanation);
  for (const option of [...(question.options || []), ...(question.statements || [])]) assert.ok(!('isCorrect' in option));
  const q = bank.find(row => row.id === question.id); assert.ok(q);
  const answer = q.questionType === 'TRUE_FALSE' ? { response: { trueFalseAnswers: Object.fromEntries(q.statements.map(s => [s.key, s.isCorrect])) } }
    : q.questionType === 'SHORT_ANSWER' ? { response: { shortAnswer: q.shortAnswer.acceptedAnswers[0] } }
      : { selectedOptionKey: q.options.find(o => o.isCorrect).optionKey };
  const response = (await api('/diagnostic/answer', { attemptId: start.attemptId, questionId: q.id, timeSpentSeconds: 10, ...answer }, student)).data;
  assert.ok(!response.correctOptionKey); assert.ok(!response.explanation);
  question = response.nextQuestion;
}
if (!resumeQa) { const rank = {SINGLE_CHOICE:0,TRUE_FALSE:1,SHORT_ANSWER:2}; assert.equal(new Set(types).size,3); assert.ok(types.every((type,index) => index === 0 || rank[type] >= rank[types[index-1]])); }
const result = (await api('/diagnostic/submit/' + start.attemptId, {}, student)).data;
assert.equal(result.scorePercentage, 100);
const detail = (await api('/diagnostic/results/' + start.attemptId, undefined, student)).data;
const random = (await api('/assignments/random-preview', {}, teacher)).data;
assert.equal(random.questionIds.length, 22); assert.equal(new Set(random.questionIds).size, 22);
await fs.writeFile(`docs/evidence/math-question-types/diagnostic-mixed-bank${resumeQa ? '-ui-resumed' : ''}.json`, JSON.stringify({ at: new Date().toISOString(), username, attemptId: start.attemptId, types, result, detail, randomCounts: random.questionCounts }, null, 2));
console.log(JSON.stringify({ answered: types.length, initialTypes: types.slice(0, 3), score: result.scorePercentage, randomCounts: random.questionCounts }));
