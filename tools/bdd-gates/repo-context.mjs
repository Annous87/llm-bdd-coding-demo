const GITHUB_REMOTE_REGEXES = [
  /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/i,
  /^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/i,
];

const ISSUE_KEY_REGEX = /^[A-Z][A-Z0-9]+-\d+$/;

export function parseGithubOrigin(originUrl) {
  if (!originUrl || typeof originUrl !== 'string') {
    return { ok: false, reason: 'Repository context could not be resolved from origin.' };
  }

  for (const regex of GITHUB_REMOTE_REGEXES) {
    const match = originUrl.trim().match(regex);
    if (!match) {
      continue;
    }

    const owner = match[1];
    const repo = match[2].replace(/\.git$/i, '');

    if (!owner || !repo) {
      break;
    }

    return {
      ok: true,
      owner,
      repo,
      fullName: `${owner}/${repo}`,
    };
  }

  return { ok: false, reason: 'Repository context could not be resolved from origin.' };
}

export function isValidIssueKey(issueKey) {
  return ISSUE_KEY_REGEX.test(issueKey ?? '');
}

export function branchMatchesIssue(branch, issueKey) {
  if (!branch || !issueKey) {
    return false;
  }

  const normalizedBranch = branch.toUpperCase();
  const normalizedIssue = issueKey.toUpperCase();

  return (
    normalizedBranch === normalizedIssue ||
    normalizedBranch.includes(`/${normalizedIssue}`) ||
    normalizedBranch.includes(`-${normalizedIssue}-`) ||
    normalizedBranch.startsWith(`${normalizedIssue}-`) ||
    normalizedBranch.endsWith(`-${normalizedIssue}`)
  );
}

export function evaluateRepoContext({ issueKey, branch, headSha, originUrl }) {
  const origin = parseGithubOrigin(originUrl);
  if (!origin.ok) {
    return {
      issue: issueKey ?? null,
      result: 'FAIL',
      missingCondition: origin.reason,
      repository: null,
      branch: branch ?? null,
      headSha: headSha ?? null,
    };
  }

  if (!isValidIssueKey(issueKey)) {
    return {
      issue: issueKey ?? null,
      result: 'FAIL',
      missingCondition: 'Invalid or missing Jira issue key.',
      repository: origin.fullName,
      branch: branch ?? null,
      headSha: headSha ?? null,
    };
  }

  if (!branch || branch === 'main') {
    return {
      issue: issueKey,
      result: 'FAIL',
      missingCondition: 'Current branch must correspond to Jira issue and must not be main.',
      repository: origin.fullName,
      branch: branch ?? null,
      headSha: headSha ?? null,
    };
  }

  if (!branchMatchesIssue(branch, issueKey)) {
    return {
      issue: issueKey,
      result: 'FAIL',
      missingCondition: 'Current branch does not correspond to supplied Jira issue key.',
      repository: origin.fullName,
      branch,
      headSha: headSha ?? null,
    };
  }

  return {
    issue: issueKey,
    result: 'PASS',
    repository: origin.fullName,
    owner: origin.owner,
    repo: origin.repo,
    branch,
    headSha: headSha ?? null,
    missingCondition: null,
  };
}
