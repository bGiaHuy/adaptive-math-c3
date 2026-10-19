import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const sourceRoot = resolve(process.argv[2] || '../batch_001');
const outputRoot = resolve('content/english');
const mediaRoot = resolve('public/media/batch_001');
const checkOnly = process.argv.includes('--check');

const fail = message => { throw new Error(message); };
const json = async name => JSON.parse(await readFile(join(sourceRoot, name), 'utf8'));
const jsonl = async name => (await readFile(join(sourceRoot, name), 'utf8'))
  .split(/\r?\n/).filter(Boolean).map((line, index) => {
    try { return JSON.parse(line); }
    catch { return fail(`${name}:${index + 1} is not valid JSON`); }
  });
const sha256 = buffer => createHash('sha256').update(buffer).digest('hex');

const manifest = await json('manifest.json');
if (manifest.batch !== 'batch_001' || manifest.schemaVersion !== '1.0.0') fail('Unexpected batch or schema version');
for (const file of manifest.files) {
  const actual = await readFile(join(sourceRoot, file.path));
  if (actual.length !== file.bytes || sha256(actual) !== file.sha256) {
    if (file.path === 'needs_review/README.md') console.warn('Non-imported needs_review/README.md differs from manifest; ready records are still verified.');
    else fail(`Manifest checksum failed: ${file.path}`);
  }
}

const [sources, topics, lessons, questions, transcripts, media] = await Promise.all([
  jsonl('sources.jsonl'), jsonl('topics.jsonl'), jsonl('lessons.jsonl'),
  jsonl('questions.jsonl'), jsonl('transcripts.jsonl'), jsonl('media.jsonl')
]);
const byId = items => new Map(items.map(item => [item.id, item]));
const sourceById = byId(sources);
const topicById = byId(topics);
const mediaById = byId(media);
const transcriptByLesson = new Map(transcripts.map(item => [item.lessonId, item]));
const allowedKinds = { listening: 'LISTENING', vocabulary: 'VOCABULARY', grammar: 'GRAMMAR', reading: 'READING' };
const readyLessons = lessons.filter(item => item.reviewStatus === 'ready');
if (readyLessons.length !== manifest.counts.lessonsReady || questions.length !== manifest.counts.questionsReady) fail('Ready counts do not match manifest');
if (readyLessons.some(item => !manifest.readyLessonIds.includes(item.id))) fail('Ready lesson ID missing from manifest');

const converted = [];
const audioCopies = [];
for (const lesson of readyLessons) {
  if (!topicById.has(lesson.topicId) || !allowedKinds[lesson.kind]) fail(`Broken lesson: ${lesson.id}`);
  const lessonSources = lesson.sourceIds.map(id => sourceById.get(id));
  if (lessonSources.some(source => !source || source.evaluationStatus !== 'approved_for_reuse' ||
      !['reusable_with_attribution', 'public_domain'].includes(source.allowedUsage))) fail(`Source not approved: ${lesson.id}`);
  const lessonMedia = lesson.mediaIds.map(id => mediaById.get(id));
  if (lessonMedia.some(item => !item || item.reviewStatus !== 'ready' || item.lessonId !== lesson.id)) fail(`Media not ready: ${lesson.id}`);
  const audio = lessonMedia[0] || null;
  if (lesson.kind === 'listening' && !audio) fail(`Listening lesson lacks audio: ${lesson.id}`);
  if (audio) {
    const bytes = await readFile(join(sourceRoot, audio.localPath));
    if (bytes.length !== audio.bytes || sha256(bytes) !== audio.sha256) fail(`Audio checksum failed: ${audio.id}`);
    audioCopies.push({ from: join(sourceRoot, audio.localPath), to: join(mediaRoot, audio.localPath.split('/').at(-1)) });
  }
  const transcript = transcriptByLesson.get(lesson.id);
  if (transcript && (transcript.reviewStatus !== 'ready' || transcript.mediaId !== audio?.id)) fail(`Transcript not ready: ${lesson.id}`);
  const segments = transcript?.segments.map(segment => ({
    id: segment.id, startMs: segment.startMs, endMs: segment.endMs,
    textEn: segment.textEn, textVi: segment.textVi,
    alignmentVerified: transcript.alignmentVerified === true
  })) || [];
  if (segments.some(segment => segment.endMs > audio.durationMs || segment.startMs >= segment.endMs)) fail(`Transcript timing invalid: ${lesson.id}`);
  const exercises = questions.filter(item => item.lessonId === lesson.id).map(item => {
    if (item.reviewStatus !== 'ready') fail(`Question not ready: ${item.id}`);
    if (item.segmentId && !segments.some(segment => segment.id === item.segmentId)) fail(`Unknown segment: ${item.id}`);
    const options = item.type === 'multiple_choice' ? item.options.map(option => option.text) : [];
    const correct = item.type === 'multiple_choice'
      ? item.options.find(option => option.id === item.correctOptionId)?.text
      : item.acceptedAnswers?.[0];
    if (!correct || (options.length && new Set(options).size !== options.length)) fail(`Invalid answer: ${item.id}`);
    return {
      id: item.id,
      kind: item.type === 'multiple_choice' ? 'SINGLE_CHOICE' : item.type === 'dictation' ? 'DICTATION' : 'FILL_BLANK',
      prompt: [item.instructionVi, item.promptEn].filter(Boolean).join('\n'),
      options, correctAnswer: correct,
      acceptedAnswers: item.acceptedAnswers || [],
      explanation: item.explanationVi || null,
      segmentId: item.segmentId || null
    };
  });
  if (!exercises.length) fail(`No exercises: ${lesson.id}`);
  converted.push({
    id: lesson.id, topicId: lesson.topicId, title: lesson.titleVi || lesson.titleEn,
    summary: lesson.summaryVi || null, level: lesson.level,
    kind: allowedKinds[lesson.kind],
    body: lesson.kind === 'listening' ? null : `${lesson.bodyEn}\n\nBản dịch / Ghi chú tiếng Việt\n${lesson.bodyVi}`,
    audioUrl: audio ? `/media/batch_001/${audio.localPath.split('/').at(-1)}` : null,
    transcript: segments,
    sourceAttribution: lessonSources.map(source => source.attributionText).join(' · '),
    published: true, exercises
  });
}
if (questions.some(item => !readyLessons.some(lesson => lesson.id === item.lessonId))) fail('Orphan ready questions');
const usedTopicIds = new Set(converted.map(item => item.topicId));
const batch = {
  batchId: manifest.batch,
  topics: topics.filter(topic => usedTopicIds.has(topic.id)).map(topic => ({
    id: topic.id, title: topic.nameVi, description: topic.descriptionVi || topic.nameEn
  })),
  lessons: converted
};
const summary = {
  batch: batch.batchId, topics: batch.topics.length, lessons: batch.lessons.length,
  exercises: converted.reduce((count, lesson) => count + lesson.exercises.length, 0),
  audio: audioCopies.length, unverifiedTranscriptTimings: converted.filter(lesson => lesson.transcript.some(segment => !segment.alignmentVerified)).length
};
if (!checkOnly) {
  await mkdir(outputRoot, { recursive: true });
  await mkdir(mediaRoot, { recursive: true });
  for (const item of audioCopies) await copyFile(item.from, item.to);
  await writeFile(join(outputRoot, 'batch_001.json'), `${JSON.stringify(batch, null, 2)}\n`, 'utf8');
}
console.log(JSON.stringify(summary));
