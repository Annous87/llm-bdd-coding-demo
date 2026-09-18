function normalizePathForCompare(filePath) {
  return filePath.replace(/\\/g, '/');
}

export function resolveSpecDirectory({ issueKey, specDirectories = [] }) {
  const issuePrefix = `spec/${issueKey}-`;

  const normalized = specDirectories.map((dir) => normalizePathForCompare(dir).replace(/\/$/, ''));

  const issueMatches = normalized.filter((dir) => dir.startsWith(issuePrefix));
  if (issueMatches.length === 1) {
    return { ok: true, specDirectory: issueMatches[0], mode: 'issue-key' };
  }

  if (issueMatches.length > 1) {
    return {
      ok: false,
      reason: 'Multiple specification directories found for Jira issue.',
      specDirectory: null,
    };
  }

  return {
    ok: false,
    reason: 'Specification directory not found. Expected spec/<ISSUE-KEY>-<slug>/ for Jira-driven workflow.',
    specDirectory: null,
  };
}

export function requiredSpecFiles(specDirectory) {
  return [
    `${specDirectory}/prd.md`,
    `${specDirectory}/acceptance.feature`,
    `${specDirectory}/implementation-plan.md`,
  ];
}

export function missingRequiredFiles({ specDirectory, changedFiles = [] }) {
  const normalized = new Set(changedFiles.map((file) => normalizePathForCompare(file)));
  return requiredSpecFiles(specDirectory).filter((file) => !normalized.has(file));
}

export function detectImplementationFiles({ specDirectory, changedFiles = [] }) {
  const normalizedSpecDir = normalizePathForCompare(specDirectory);
  return changedFiles
    .map((file) => normalizePathForCompare(file))
    .filter((file) => !file.startsWith(`${normalizedSpecDir}/`))
    .filter((file) => file.startsWith('src/'));
}

export function latestSpecChangingCommit({ specDirectory, commits = [] }) {
  const normalizedSpecDir = normalizePathForCompare(specDirectory);
  let latest = null;

  for (const commit of commits) {
    const files = (commit.files ?? []).map((file) => normalizePathForCompare(file));
    const touchesSpec = files.some((file) => file.startsWith(`${normalizedSpecDir}/`));
    if (!touchesSpec) {
      continue;
    }

    const ts = new Date(commit.timestamp).getTime();
    if (Number.isNaN(ts)) {
      continue;
    }

    if (!latest || ts >= latest.timestampMs) {
      latest = {
        sha: commit.sha,
        timestamp: commit.timestamp,
        timestampMs: ts,
      };
    }
  }

  if (!latest) {
    return {
      ok: false,
      reason: 'Unable to determine current BDD specification version.',
    };
  }

  return {
    ok: true,
    sha: latest.sha,
    timestamp: latest.timestamp,
    timestampMs: latest.timestampMs,
  };
}

export function evaluateSpecContext({ issueKey, specDirectories, changedFiles, commits, requireLatestSpecCommit = true }) {
  const specResolution = resolveSpecDirectory({ issueKey, specDirectories });
  if (!specResolution.ok) {
    return {
      issue: issueKey,
      result: 'FAIL',
      specDirectory: null,
      missingCondition: specResolution.reason,
    };
  }

  const specDirectory = specResolution.specDirectory;
  const missingFiles = missingRequiredFiles({ specDirectory, changedFiles });
  if (missingFiles.length > 0) {
    return {
      issue: issueKey,
      result: 'FAIL',
      specDirectory,
      missingCondition: `Missing required specification files: ${missingFiles.join(', ')}`,
      missingFiles,
    };
  }

  const latestSpec = latestSpecChangingCommit({ specDirectory, commits });
  if (requireLatestSpecCommit && !latestSpec.ok) {
    return {
      issue: issueKey,
      result: 'FAIL',
      specDirectory,
      missingCondition: latestSpec.reason,
    };
  }

  return {
    issue: issueKey,
    result: 'PASS',
    specDirectory,
    specDirectoryMode: specResolution.mode,
    requiredFilesPresent: true,
    latestSpecSha: latestSpec.ok ? latestSpec.sha : null,
    latestSpecTimestamp: latestSpec.ok ? latestSpec.timestamp : null,
    latestSpecTimestampMs: latestSpec.ok ? latestSpec.timestampMs : null,
    implementationFiles: detectImplementationFiles({ specDirectory, changedFiles }),
    missingCondition: null,
  };
}
