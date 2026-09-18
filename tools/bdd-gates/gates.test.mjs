import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { evaluateGate1 } from './gate1.mjs';
import { evaluateGate2 } from './gate2.mjs';
import { isSpecApprovedDuplicate } from './sync-duplicates.mjs';

const fixturesDir = path.join(process.cwd(), 'tools', 'bdd-gates', 'fixtures');

function loadFixture(name) {
  const fullPath = path.join(fixturesDir, name);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

test('Gate 1 fails when approval predates latest spec change', () => {
  const input = loadFixture('gate1-stale-spec-approval.json');
  const result = evaluateGate1(input);

  assert.equal(result.result, 'FAIL');
  assert.equal(result.approvalEvidence, 'STALE');
  assert.equal(result.approvalFreshness, 'FAIL');
});

test('Gate 1 passes when approval is after latest spec change', () => {
  const input = loadFixture('gate1-fresh-spec-approval.json');
  const result = evaluateGate1(input);

  assert.equal(result.result, 'PASS');
  assert.equal(result.mode, 'SOLO POC MODE');
  assert.equal(result.approvalFresh, true);
});

test('Gate 1 passes in solo mode with empty reviews and valid solo comment', () => {
  const input = loadFixture('gate1-solo-empty-reviews-pass.json');
  const result = evaluateGate1(input);

  assert.equal(result.result, 'PASS');
  assert.equal(result.mode, 'SOLO POC MODE');
  assert.equal(result.approvalEvidence, 'PASS');
});

test('Spec-approved duplicate check is version-aware (SHA A vs SHA B is not duplicate)', () => {
  const fixture = loadFixture('spec-duplicate-sha-a-vs-b.json');
  const duplicate = isSpecApprovedDuplicate({
    comments: fixture.comments,
    prReference: fixture.prReference,
    specVersion: fixture.currentSpecVersion,
  });

  assert.equal(duplicate, false);
});

test('Gate 2 fails when approval is stale after new commit', () => {
  const input = loadFixture('gate2-stale-after-new-commit.json');
  const result = evaluateGate2(input);

  assert.equal(result.result, 'FAIL');
  assert.equal(result.approvalEvidence, 'STALE');
  assert.equal(result.approvalFreshness, 'FAIL');
});
