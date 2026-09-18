import { evaluateRepoContext } from './repo-context.mjs';
import { evaluateSpecContext } from './spec-context.mjs';

function toMs(ts) {
  const value = new Date(ts).getTime();
  return Number.isNaN(value) ? null : value;
}

function chooseTeamApproval({ prAuthor, reviews, latestSpecTsMs }) {
  const candidates = (reviews ?? [])
    .filter((review) => review.state === 'APPROVED')
    .filter((review) => review.author && review.author !== prAuthor)
    .map((review) => ({
      reviewer: review.author,
      timestamp: review.timestamp,
      timestampMs: toMs(review.timestamp),
      commitSha: review.commitSha ?? null,
    }))
    .filter((review) => review.timestampMs !== null)
    .sort((a, b) => b.timestampMs - a.timestampMs);

  if (candidates.length === 0) {
    return null;
  }

  const latest = candidates[0];
  const fresh = latest.timestampMs > latestSpecTsMs;

  return {
    mode: 'TEAM MODE',
    reviewer: latest.reviewer,
    approvalTimestamp: latest.timestamp,
    approvalFresh: fresh,
    approvalEvidence: fresh ? 'PASS' : 'STALE',
    approvalFreshness: fresh ? 'PASS' : 'FAIL',
    reason: fresh ? null : 'Specification changed after the latest valid approval.',
  };
}

function chooseSoloApproval({ prAuthor, comments, latestSpecTsMs }) {
  const marker = 'BDD specification reviewed. Approved for implementation.';
  const candidates = (comments ?? [])
    .filter((comment) => comment.author === prAuthor)
    .filter((comment) => comment.body?.includes(marker))
    .map((comment) => ({
      timestamp: comment.timestamp,
      timestampMs: toMs(comment.timestamp),
    }))
    .filter((comment) => comment.timestampMs !== null)
    .sort((a, b) => b.timestampMs - a.timestampMs);

  if (candidates.length === 0) {
    return {
      mode: 'SOLO POC MODE',
      reviewer: prAuthor ?? 'NONE',
      approvalTimestamp: null,
      approvalFresh: false,
      approvalEvidence: 'NOT FOUND',
      approvalFreshness: 'NOT EVALUATED',
      reason: 'Missing human approval for the current BDD specification.',
    };
  }

  const latest = candidates[0];
  const fresh = latest.timestampMs > latestSpecTsMs;

  return {
    mode: 'SOLO POC MODE',
    reviewer: prAuthor,
    approvalTimestamp: latest.timestamp,
    approvalFresh: fresh,
    approvalEvidence: fresh ? 'PASS' : 'STALE',
    approvalFreshness: fresh ? 'PASS' : 'FAIL',
    reason: fresh ? null : 'Specification changed after the latest valid approval.',
  };
}

export function evaluateGate1(input) {
  const {
    issueKey,
    branch,
    headSha,
    originUrl,
    specDirectories,
    pr,
    changedFiles,
    commits,
    reviews,
    comments,
    requireSpecificationOnly = true,
  } = input;

  const repo = evaluateRepoContext({ issueKey, branch, headSha, originUrl });
  if (repo.result === 'FAIL') {
    return {
      issue: issueKey,
      result: 'FAIL',
      mode: 'NONE',
      approvalFresh: false,
      missingCondition: repo.missingCondition,
    };
  }

  if (!pr) {
    return {
      issue: issueKey,
      result: 'FAIL',
      mode: 'NONE',
      approvalFresh: false,
      missingCondition: 'No open pull request found in origin repository for current branch.',
    };
  }

  if (pr.baseBranch !== 'main' || pr.headBranch !== branch || pr.repository !== repo.repository || pr.baseRepository !== repo.repository) {
    return {
      issue: issueKey,
      result: 'FAIL',
      mode: 'NONE',
      approvalFresh: false,
      missingCondition: 'Wrong PR target/base repository or branch.',
    };
  }

  const spec = evaluateSpecContext({ issueKey, specDirectories, changedFiles, commits });
  if (spec.result === 'FAIL') {
    return {
      issue: issueKey,
      result: 'FAIL',
      mode: 'NONE',
      approvalFresh: false,
      missingCondition: spec.missingCondition,
      specDirectory: spec.specDirectory,
    };
  }

  if (requireSpecificationOnly && spec.implementationFiles.length > 0) {
    return {
      issue: issueKey,
      result: 'FAIL',
      mode: 'NONE',
      approvalFresh: false,
      specDirectory: spec.specDirectory,
      latestSpecSha: spec.latestSpecSha,
      latestSpecTimestamp: spec.latestSpecTimestamp,
      implementationFiles: spec.implementationFiles,
      missingCondition: 'Implementation files are already present before BDD specification approval.',
    };
  }

  const latestSpecTsMs = spec.latestSpecTimestampMs;
  const team = chooseTeamApproval({ prAuthor: pr.author, reviews, latestSpecTsMs });
  const approved = team ?? chooseSoloApproval({ prAuthor: pr.author, comments, latestSpecTsMs });

  if (!approved || approved.approvalEvidence === 'NOT FOUND') {
    return {
      issue: issueKey,
      result: 'FAIL',
      mode: approved?.mode ?? 'NONE',
      reviewer: approved?.reviewer ?? 'NONE',
      approvalEvidence: approved?.approvalEvidence ?? 'NOT FOUND',
      approvalFreshness: approved?.approvalFreshness ?? 'NOT EVALUATED',
      latestSpecSha: spec.latestSpecSha,
      latestSpecTimestamp: spec.latestSpecTimestamp,
      approvalTimestamp: approved?.approvalTimestamp ?? null,
      approvalFresh: false,
      specVersion: spec.latestSpecSha,
      missingCondition: approved?.reason ?? 'Missing human approval for the current BDD specification.',
    };
  }

  if (!approved.approvalFresh) {
    return {
      issue: issueKey,
      result: 'FAIL',
      mode: approved.mode,
      reviewer: approved.reviewer,
      approvalEvidence: approved.approvalEvidence,
      approvalFreshness: approved.approvalFreshness,
      latestSpecSha: spec.latestSpecSha,
      latestSpecTimestamp: spec.latestSpecTimestamp,
      approvalTimestamp: approved.approvalTimestamp,
      approvalFresh: false,
      specVersion: spec.latestSpecSha,
      missingCondition: approved.reason,
    };
  }

  return {
    issue: issueKey,
    result: 'PASS',
    mode: approved.mode,
    reviewer: approved.reviewer,
    approvalEvidence: approved.approvalEvidence,
    approvalFreshness: approved.approvalFreshness,
    approvalTimestamp: approved.approvalTimestamp,
    approvalFresh: true,
    repository: repo.repository,
    branch,
    specDirectory: spec.specDirectory,
    latestSpecSha: spec.latestSpecSha,
    latestSpecTimestamp: spec.latestSpecTimestamp,
    specVersion: spec.latestSpecSha,
    implementationFiles: spec.implementationFiles,
    missingCondition: null,
  };
}
