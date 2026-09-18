function normalize(text) {
  return (text ?? '').trim();
}

export function isSpecApprovedDuplicate({ comments = [], prReference, specVersion }) {
  const marker = '[BDD] SPECIFICATION APPROVED';

  return comments.some((comment) => {
    const body = normalize(comment.body);
    if (!body.includes(marker)) {
      return false;
    }

    const prMatch = body.includes(`GitHub PR: ${prReference}`);
    const specMatch = body.includes(`Specification version: ${specVersion}`);

    return prMatch && specMatch;
  });
}
