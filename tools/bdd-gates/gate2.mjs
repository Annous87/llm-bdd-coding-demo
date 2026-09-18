import { evaluateRepoContext } from './repo-context.mjs';
import { evaluateSpecContext } from './spec-context.mjs';

function toMs(ts) {
  const value = new Date(ts).getTime();
  return Number.isNaN(value) ? null : value;
}

function chooseTeamApproval({ prAuthor, reviews, latestCommitSha }) {
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
  const fresh = latest.commitSha ? latest.commitSha === latestCommitSha : false;

  return {
    mode: 'TEAM',
    reviewer: latest.reviewer,
    approvalTimestamp: latest.timestamp,
    approvalEvidence: fresh ? 'PASS' : 'STALE',
    approvalFreshness: fresh ? 'PASS' : 'FAIL',
    approvalFresh: fresh,
    reason: fresh ? null : 'Implementation approval is stale because commits were added after approval.',
  };
}

function chooseSoloApproval({ prAuthor, comments, latestCommitTsMs }) {
  const marker = 'Implementation reviewed. Approved for merge.';
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
      mode: 'SOLO POC',
      reviewer: prAuthor ?? 'NONE',
      approvalTimestamp: null,
      approvalEvidence: 'NOT FOUND',
      approvalFreshness: 'NOT EVALUATED',
      approvalFresh: false,
      reason: 'Missing explicit implementation approval comment.',
    };
  }

  const latest = candidates[0];
  const fresh = latest.timestampMs > latestCommitTsMs;

  return {
    mode: 'SOLO POC',
    reviewer: prAuthor,
    approvalTimestamp: latest.timestamp,
    approvalEvidence: fresh ? 'PASS' : 'STALE',
    approvalFreshness: fresh ? 'PASS' : 'FAIL',
    approvalFresh: fresh,
    reason: fresh ? null : 'Implementation approval is stale because commits were added after approval.',
  };
}

export function evaluateGate2(input) {
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

  if (pr.headSha !== headSha) {
    return {
      issue: issueKey,
      result: 'FAIL',
      mode: 'NONE',
      approvalFresh: false,
      missingCondition: 'Local branch and pull request head are not synchronized.',
    };
  }

  const spec = evaluateSpecContext({
    issueKey,
    specDirectories,
    changedFiles,
    commits,
    requireLatestSpecCommit: false,
  });
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

  if (spec.implementationFiles.length === 0) {
    return {
      issue: issueKey,
      result: 'FAIL',
      mode: 'NONE',
      approvalFresh: false,
      missingCondition: 'No implementation changes are present in the pull request.',
      specDirectory: spec.specDirectory,
    };
  }

  const latestCommit = (commits ?? [])
    .map((commit) => ({ ...commit, timestampMs: toMs(commit.timestamp) }))
    .filter((commit) => commit.timestampMs !== null)
    .sort((a, b) => b.timestampMs - a.timestampMs)[0];

  if (!latestCommit) {
    return {
      issue: issueKey,
      result: 'FAIL',
      mode: 'NONE',
      approvalFresh: false,
      missingCondition: 'Unable to determine latest pull request commit.',
      specDirectory: spec.specDirectory,
    };
  }

  const team = chooseTeamApproval({
    prAuthor: pr.author,
    reviews,
    latestCommitSha: latestCommit.sha,
  });

  const approval = team ?? chooseSoloApproval({
    prAuthor: pr.author,
    comments,
    latestCommitTsMs: latestCommit.timestampMs,
  });

  if (approval.approvalEvidence === 'NOT FOUND') {
    return {
      issue: issueKey,
      result: 'FAIL',
      mode: approval.mode,
      reviewer: approval.reviewer,
      approvalEvidence: approval.approvalEvidence,
      approvalFreshness: approval.approvalFreshness,
      approvalTimestamp: approval.approvalTimestamp,
      approvalFresh: false,
      latestPrCommitSha: latestCommit.sha,
      latestPrCommitTimestamp: latestCommit.timestamp,
      implementationFiles: spec.implementationFiles,
      missingCondition: approval.reason,
    };
  }

  if (!approval.approvalFresh) {
    return {
      issue: issueKey,
      result: 'FAIL',
      mode: approval.mode,
      reviewer: approval.reviewer,
      approvalEvidence: approval.approvalEvidence,
      approvalFreshness: approval.approvalFreshness,
      approvalTimestamp: approval.approvalTimestamp,
      approvalFresh: false,
      latestPrCommitSha: latestCommit.sha,
      latestPrCommitTimestamp: latestCommit.timestamp,
      implementationFiles: spec.implementationFiles,
      missingCondition: approval.reason,
    };
  }

  return {
    issue: issueKey,
    result: 'PASS',
    repository: repo.repository,
    branch,
    mode: approval.mode,
    reviewer: approval.reviewer,
    approvalEvidence: approval.approvalEvidence,
    approvalFreshness: approval.approvalFreshness,
    approvalTimestamp: approval.approvalTimestamp,
    approvalFresh: true,
    latestPrCommitSha: latestCommit.sha,
    latestPrCommitTimestamp: latestCommit.timestamp,
    implementationFiles: spec.implementationFiles,
    specDirectory: spec.specDirectory,
    missingCondition: null,
  };
}
