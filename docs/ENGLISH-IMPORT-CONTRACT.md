# Adaptive Learning: English content import and rollout

The English experience uses separate `EnglishTopic`, `EnglishLesson`, `EnglishExercise`, and `EnglishLessonProgress` tables. Existing mathematics records are retained. Student navigation now opens the English catalogue, listening lessons, and English progress.

## Apply schema

After setting `DATABASE_URL` for the target environment, run:

```bash
npm run prisma:generate
cd apps/api
npx prisma migrate deploy
cd ../..
npm run content:import
```

Back up the database before applying the migration in a shared environment. The migration adds tables and does not delete existing records.

## Bundled `batch_001`

The user-supplied sibling folder `../batch_001` was converted with `node scripts/prepare-english-batch.mjs ../batch_001`. The checked, app-ready result is [`content/english/batch_001.json`](../../content/english/batch_001.json) with two VOA MP3 files in `public/media/batch_001/`. Run `npm run content:import` after migrations to load the 3 populated topics, 5 lessons, and 19 exercises. The import is idempotent by lesson ID. It does not import `needs_review` records, LibriVox/BBC files, source dumps, ASR models, or unused audio.

The manifest's hashes for all ready JSONL and included audio files match. The only mismatch is `needs_review/README.md`, which has an appended AI metadata footer and is not used for import. The two ready transcripts have machine-aligned timestamps marked `alignmentVerified: false`; the app shows their text but does not enable segment replay until those timestamps are checked. The batch contains A1 and B1 content but no A2 lesson, so the starting-point quiz only assesses the available levels and does not claim a calibrated CEFR result.

## Import format

The admin or content author uploads one UTF-8 JSON file in **Nội dung tiếng Anh**. `POST /api/v1/english/import` accepts the same body. Maximum practical file size in the UI is 2 MB, with at most 100 topics and 500 lessons per batch. The importer checks the full batch before writing, then upserts topics and lessons in one transaction. Lesson exercises are replaced on reimport. Use stable IDs. Admin imports can publish when `published` is `true`; content author imports are forced to draft.

```json
{
  "topics": [
    { "id": "daily-life", "title": "Đời sống hằng ngày", "description": "Tình huống quen thuộc" }
  ],
  "lessons": [
    {
      "id": "daily-life-greetings-a1",
      "topicId": "daily-life",
      "title": "A morning conversation",
      "summary": "Lời chào buổi sáng",
      "level": "A1",
      "kind": "LISTENING",
      "body": null,
      "audioUrl": "https://example.org/licensed/greetings.mp3",
      "transcript": [
        { "id": "s1", "startMs": 0, "endMs": 1800, "textEn": "Good morning.", "textVi": "Chào buổi sáng." }
      ],
      "sourceAttribution": "Original recording by the content team",
      "published": false,
      "exercises": [
        {
          "id": "greetings-q1",
          "kind": "SINGLE_CHOICE",
          "prompt": "What do you hear?",
          "options": ["Good morning.", "Good night."],
          "correctAnswer": "Good morning.",
          "acceptedAnswers": [],
          "explanation": "The speaker says good morning.",
          "segmentId": "s1"
        }
      ]
    }
  ]
}
```

`level` is `A1`, `A2`, or `B1`. `kind` is `LISTENING`, `VOCABULARY`, `GRAMMAR`, or `READING`. Exercise `kind` is `SINGLE_CHOICE`, `FILL_BLANK`, or `DICTATION`. For choice questions, `correctAnswer` must match one of the option strings exactly. Text answers are checked case insensitively after trimming and collapsing spaces; punctuation still matters, so put accepted variants in `acceptedAnswers`.

For listening lessons, `audioUrl` is required and must begin with `https://` or `/media/`. Bundled audio under `public/media/` is copied into the frontend build and served from `/media/` by the web host. Transcript timestamps are milliseconds. The importer checks their shape; check alignment, source rights, and age suitability before publishing additional content.

The earlier crawl brief uses separate JSONL files and more provenance fields. The crawl coordinator should retain those source files and produce this JSON bundle as the final import export. Store rights evidence, checksums, and QA reports alongside the bundle; the current app stores only `sourceAttribution` for display.

## Current limits

- The English catalogue and progress work after `npm run content:import`. The supplied batch ships with this repository.
- The starting-point quiz needs at least six published multiple-choice exercises across two levels. It suggests a *lesson starting level* among the available levels; it is not a calibrated CEFR assessment. Progress recommends unfinished lessons, prioritizing a skill type when the student's completed exercises in that type have lower accuracy.
- Verified teachers can create classes, issue invite codes, assign published English lessons, and see class completion counts. Students can join classes and open their assigned lessons. The legacy admin mathematics question bank remains separate.
- The existing video demo still depicts AdaptiveMath and needs a new recording when approved content is present.
