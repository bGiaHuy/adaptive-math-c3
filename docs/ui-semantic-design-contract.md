# AdaptiveMath semantic interface contract

## Product lens

AdaptiveMath serves Vietnamese secondary-school learners preparing for mathematics assessments, teachers assigning and reviewing work, and staff governing question quality. The daily learner job is to identify the next useful task, answer mathematical questions, and understand what to practise next. Teachers compare completion and attainment, investigate particular responses, and safely publish or regrade. Mathematical prompts, evidence quality, response completeness, and release policy are domain objects; decorative achievement counters are not substitutes. Preserve React/Vite, KaTeX, the existing paper/ink/amber identity, all assessment rules, and role boundaries. This contract is based on source inspection; runtime screenshots and interaction checks are separately required.

## Comparable product evidence

These are transferable workflow patterns, not visual templates.

| Product and primary reference | Pattern and job | Lesson for AdaptiveMath |
|---|---|---|
| [Khan Academy mastery reports](https://www.khanacademy.org/khan-for-educators/khan-for-educators-advanced-course/x2e5750eab575b791%3Akhan-for-educators-advanced/x2e5750eab575b791%3Ausing-ka-reports-to-personalize-learning/a/review-student-progress-toward-mastery-a9) | Inspect mastery by class and unit | Relate skill progress to actual evidence and a practice decision; retain unknown separately from low attainment. |
| [Google Classroom student work](https://support.google.com/edu/classroom/answer/9157286?hl=en) | Filter work by submission and grading status | Completion, submission, and grade publication are different dimensions. Use precise text and actionable filters. |
| [Moodle quiz use](https://docs.moodle.org/500/en/Using_quiz) | Review attempts, responses, statistics, and connection warnings | A question navigator and focused response review fit assessments; communicate unsaved work without discarding it. |
| [Desmos calculator guide](https://help.desmos.com/hc/en-us/articles/202529279-Desmos-Graphing-Calculator-User-Guide) | Mathematical workspace joins expressions and their representation | Keep the mathematical object central; help and tools support the workspace rather than becoming equal-weight cards. |

Accessibility review also uses the installed UI/UX Pro Max skill: readable semantic state labels, keyboard operation, contextual status announcements, and usable narrow layouts. No palette or trend catalogue determines the design.

## Application inventory and page contracts

Every row specifies user/job, first read, interaction model, density, and acceptance evidence. Source filenames identify the implementation surface, including views selected through `App.jsx` rather than URL routes.

| Page / implementation | First read and primary action | Chosen semantic pattern and reason | Required finish evidence |
|---|---|---|---|
| Landing / `LandingPage` | Mathematics learning offer; register or sign in | Editorial introduction with one labelled sample competency visual. Supporting capabilities can be a short sequence; three equal feature cards must not dominate the learning offer. | Desktop/mobile; sample data clearly labelled; working entry actions. |
| Registration/login / `RegisterPage`, `App` | Account fields and role consequences; submit | Focused labelled form. Role chooser is a small exclusive choice, not competing promotional panels. | Validation, server rejection, pending submit, keyboard and narrow width. |
| Onboarding / `OnboardingWizard` | Current configuration decision; next | Sequential field groups, native single/multiple choice controls. Card-like selectable options are justified only when their explanation changes the choice. | Selected versus unselected, back preserves fields, disabled next explains missing input, mobile. |
| Home / `DashboardView`, `TodayActivities`, `PracticeCalendar` | Resume unfinished session or next prerequisite; continue | One prioritized next-action area, compact activity agenda, calendar for dates. Calendar is temporal navigation, not an ornamental statistics tile. | New user, configured/unassessed, ongoing session, assessed user; today's work visible before secondary history on mobile. |
| Competency / `ProfileCompetencyView`, `CompetencyChart`, `MathCompetencyRadar` | Assessed skills and evidence; choose learning action | Overview radar plus labelled comparative skill rows/bars. Compact aligned values permit comparisons; method explanation belongs in disclosure. No-data skills have no numerical bar. | Null versus actual zero, low evidence, target thresholds, accessible chart alternatives and mobile. |
| Learning path / `LearningPathView` | Today's useful activity; start/resume | Date-grouped agenda with future dates disclosed, searchable/filterable topic comparison. Compact rows show topic, estimate, evidence, availability, action. Replacing cards with equally tall bordered rows fails. | Current/future dates, empty plan, no search match/reset, active-session lock, insufficient published questions, mobile. |
| Diagnostic / `DiagnosticTest` | Current question and completeness; answer/navigate/submit | Focused assessment workspace with numbered navigator and optional full-paper view. Completion markers express answer presence; correctness is a post-submission concept. Solutions use contextual disclosure. | Both modes preserve answers/time; blank and partial true/false; submit confirmation; restored draft; retry; mobile mathematical notation. |
| Practice / `MathPracticeView` | Current mathematical problem and phase; check answer then continue | Single problem workspace; phase progress, concise verdict, expandable method. Keep lesson introduction intentional, not a parallel card dashboard. | Correct/incorrect feedback, pending/retry preserves selection, phase boundaries, ongoing and completed session, mobile. |
| Missions / `MissionsView` | Actual available learning tasks; open task | Honest compact action checklist/agenda. Show measured progress only when derived from real records. Do not advertise fictitious XP, streaks, or locked-path mechanics. | Before/after tasks with actual recorded states; no fake rewards or permanent 0/x progress. |
| Mistake notebook / `MistakeNotebookView` | Error pattern and next review; inspect selected question | Searchable/filterable index with concise topic/error summary and expandable mathematical detail. Do not show every full prompt, answer, explanation, and action in a tall repeated box. | Long prompts, filtering/reset, blank/partial/wrong distinctions, solved/review-needed, empty notebook, mobile. |
| Review / `MathReviewView` | Due question; answer then recall decision | Focused retrieval workspace plus compact due queue and expandable notebook entries. Explanation appears in response context; archived tutor sessions stay secondary. | No due items, reveal, correct/incorrect, enrollment, busy/error, mobile. |
| Tutor / `MathTutorWidget`, `MathTutorChat`, `MathTutorArchive`, `MathAiReply` | Current mathematical question and conversation; ask follow-up | Conversation transcript with math rendering and contextual disclosures for long derivations; archive is searchable history. Avoid text-heavy walls or success claims about mastery from chatting. | Streaming/pending, error/retry, long formula, keyboard focus, mobile composer visible. |
| Student classroom / `ClassroomView` | Assigned work and due/submission state; open/continue | Class chooser plus compact assignment agenda. Join-code form is a distinct occasional action. Exam opens a focused workspace with navigator; returned work opens response review. | No class, join errors, not started/in progress/submitted/pending grade/released, mobile. |
| Exam results / `ExamResultDialog`, `MathQuestionResult` | Score availability and review needs; jump to question | Question-status strip and focused document review. Show answer comparison and per-statement outcome; long solution disclosure. Preserve score release restrictions and grading adjustments. | Blank/partial/wrong/correct/pending; hidden solutions; excluded/full-credit; mobile and focus return. |
| Teacher pending / `TeacherPendingView` | Verification state; correct or await review | Status explanation with next permitted action. No dashboard or fake progress percentage. | Pending/rejected/error and narrow screen. |
| Teacher classes / `TeacherClassroomsView`, `TeacherWorkspace`, `TeacherStudentList` | Class/assignment needing attention; inspect | Master-detail assignment explorer and compact class index. Rosters are tables because comparisons need aligned columns; invite code is a distinct sharing object. | Search/filter/reset, no classes, large roster pagination, projector/invite, mobile navigation. |
| Assignment results / `AssignmentResultsPanel`, `AssignmentAnalyticsPanel` | Completion and learning gaps; inspect student/question | Filterable roster comparison, score/answer distribution bars, question drilldown. Preserve existing strong patterns instead of replacing them for visual variety. | Pending grades versus zeros, empty cohort, distribution denominators, blank responses, mobile table scroller. |
| Exam authoring / `TeacherExamComposer`, `DocumentExamComposer`, `QuestionBankView`, `ExamTopicPicker`, `ExamMethodSelector` | Selected exam question and structure; edit/preview | Focused document editor with outline, editable prompt, response-type controls, and preview. Bank exploration uses search/filter and expandable rows. Method choice can use radio tiles because sources have different consequences. | All three question types, draft restore, validation, AI pending/error, long math, narrow editing. |
| Publishing/regrading / `ReportPublishReview`, `RegradeImpact` | Who will see what, and score changes; confirm | Explicit review workspace with before/after comparison table and counts of increases/decreases. Retain confirmation and publication policy. | Old/new scores, no changes, hidden/released reports, apply pending/error; no misleading success. |
| Admin overview/users / `AdminPortalView` | Queue requiring approval; inspect/decide | Compact operational queue and labelled filters; user comparison table. Summary numbers serve triage and should not become an equal-weight card wall. | Role boundaries, pending/approved/rejected, action feedback, long names, mobile. |
| Content governance / `AdminPortalView` | Question and review state; edit/review | Question index with contextual detail/editor, separate author and reviewer actions; render mathematics throughout. | Draft/pending/published/rejected, maker-checker restriction, validation and mobile. |
| Audit / `AdminPortalView` | Event/time/actor/object; investigate | Chronological filterable event table with expandable metadata. Avoid cards that destroy scan alignment. | Long metadata disclosure, no matches/reset, pagination, narrow scroll region. |
| Account/session/legal/error / modal components, `NotFoundView`, `ErrorBoundary`, loaders | Current recovery/security task; act or return | Focused form/dialog or short recovery notice. Loading names real pending work; no fabricated percentage. | Focus trap/return, Escape where safe, validation, failed request, 404, retry, mobile. |

## Source findings that block acceptance

These describe the pre-change implementation and must be rechecked against final source and screenshots.

1. `MissionsView` hardcodes progress, a one-day streak, XP, and an unlocking claim. This invents educational progress. Replace with real task state or honest actions without fabricated metrics.
2. `ProfileCompetencyView` falls back from missing mastery to zero in repeated skill cards. Unknown is not weak attainment; show an explicit unassessed state with no numerical bar.
3. `MathQuestionResult` labels unselected true/false statements as incorrect; `ExamResultDialog` assigns every noncorrect answer an incorrect heading; `TeacherWorkspace` combines wrong and blank in detail rows. Preserve scoring while exposing separate completeness and correctness.
4. `LearningPathView`, `ProfileCompetencyView`, `MissionsView`, `MistakeNotebookView`, and `MathReviewView` repeat full bordered containers around objects that need scanning, comparison, or focused retrieval. A CSS border removal alone is insufficient: summaries, aligned values, search, disclosure, or prioritized actions must reduce user work.
5. Existing report distribution bars, roster filters, regrade comparisons, current-day disclosure, and mathematical editor are suitable domain patterns. Keep their useful information and actions.

## Shared state vocabulary

| Meaning | Required visible treatment | Forbidden conflation |
|---|---|---|
| Unanswered | Neutral open marker plus “Chưa trả lời” or “Bỏ trống”; navigate to it | Red wrong-answer marker before assessment, or fabricated zero mastery |
| Incomplete | Explicit answered subparts count such as 2/4; continue action | “Unanswered” for a partly completed true/false response |
| Pending | Named save/submit/grading operation, disabled duplicate action, status announcement | Success, failure, or numeric zero while outcome is unavailable |
| Incorrect | Wrong marker plus text after graded evidence; selected answer and correction where permitted | Treating blanks as wrong attempts in learning explanations |
| Partially correct | Earned/possible points or statement results and text | Entire question labelled wholly incorrect despite awarded partial credit |
| Successful | Explicit saved/submitted/correct state tied to the completed operation | One green badge meaning saved, submitted, graded, and published simultaneously |
| Excluded/full credit | Named grading adjustment and its consequence | Inferring answer correctness from awarded points |

Completeness, awarded score, grading availability, and publication are independent. Keep backend scoring, true/false point rules, accepted short answers/tolerances, weighted scores, excluded/full-credit handling, timer persistence, and hidden-answer policy unchanged. Do not infer a grading result when the service has not supplied one.

## Global finish gate

**Current decision: HOLD pending final runtime evidence.** Source review alone cannot certify a finished interface.

Required before PASS:

1. For every redesigned page provide comparable before/after screenshots at desktop (approximately 1440px) and narrow (approximately 390px), with the same representative data where possible. Record exact viewport and state. A before screenshot of a different fixture does not establish improvement.
2. Explain the changed interaction: fewer simultaneous prompts, aligned comparisons, direct next action, meaningful distributions, useful disclosure, or faster navigation. Cosmetic container changes do not pass.
3. Exercise keyboard focus, loading, empty, error, disabled, selection, and long-content states for changed surfaces. Do not claim these are verified merely because CSS exists.
4. Verify unanswered, partial true/false, incorrect, correct, pending, excluded, full-credit, hidden-solution, and unpublished-score fixtures. Compare score/results against existing assessment tests.
5. At narrow width, preserve question, response controls, status, and primary action. Wide comparison tables may scroll inside a labelled focusable region; the page itself must not overflow. Disclosure labels must remain understandable without hover.
6. No fake metrics, color-only state communication, decorative filler, or repeated full-detail cards may remain in changed workflows without a product-specific reason.

Unchanged surfaces may be reported as audited/retained, with reasons. They must not be presented as redesigned or visually verified without evidence. Final report must separate source review, runtime checks, and unverified limitations.
