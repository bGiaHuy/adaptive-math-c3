import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as legacyShim from '../src/components/examDisplay.js';
import * as featureDisplay from '../src/features/exam-display/index.js';
import { orderExamQuestions } from '../src/components/examDisplay.js';

test('giữ nguyên tất cả export và identity giữa shim cũ và feature exam-display', () => {
  assert.deepEqual(Object.keys(legacyShim).sort(), Object.keys(featureDisplay).sort());
  for (const key of Object.keys(featureDisplay)) {
    assert.equal(legacyShim[key], featureDisplay[key]);
  }
});
test('groups a shuffled legacy exam into three contiguous stable sections without mutating input', () => {
  const rows = [{id:1,questionType:'SHORT_ANSWER'},{id:2,questionType:'TRUE_FALSE'},{id:3},{id:4,questionType:'SINGLE_CHOICE'},{id:5,questionType:'TRUE_FALSE'}];
  assert.deepEqual(orderExamQuestions(rows).map(q => q.id), [3,4,2,5,1]);
  assert.deepEqual(rows.map(q => q.id), [1,2,3,4,5]);
});
