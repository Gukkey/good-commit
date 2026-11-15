/**
 * Formats conventional commit parts into standard string and git commands
 */
export function formatCommit({
  type = 'feat',
  scope = '',
  isBreaking = false,
  description = '',
  body = '',
  breakingDescription = '',
  issues = [],
  customFooters = [],
  coAuthors = [],
}) {
  const cleanScope = scope.trim();
  const cleanDesc = description.trim();

  // Header construction
  let header = type;
  if (cleanScope) {
    header += `(${cleanScope})`;
  }
  if (isBreaking) {
    header += '!';
  }
  header += cleanDesc ? `: ${cleanDesc}` : ': ';

  // Footers list
  const footers = [];

  // Breaking Change footer
  if (isBreaking && breakingDescription.trim()) {
    footers.push(`BREAKING CHANGE: ${breakingDescription.trim()}`);
  }

  // Issues / Closes / Fixes footers
  issues.forEach((item) => {
    if (item.action && item.reference && item.reference.trim()) {
      const ref = item.reference.trim();
      footers.push(`${item.action} ${ref.startsWith('#') || ref.includes('/') ? ref : '#' + ref}`);
    }
  });

  // Co-authors
  coAuthors.forEach((author) => {
    if (author.name && author.email) {
      footers.push(`Co-authored-by: ${author.name.trim()} <${author.email.trim()}>`);
    }
  });

  // Custom footers (Git trailers)
  customFooters.forEach((footer) => {
    if (footer.token && footer.token.trim() && footer.value && footer.value.trim()) {
      const token = footer.token.trim().replace(/\s+/g, '-');
      footers.push(`${token}: ${footer.value.trim()}`);
    }
  });

  // Full conventional commit message
  const parts = [header];

  const cleanBody = body.trim();
  if (cleanBody) {
    parts.push(cleanBody);
  }

  if (footers.length > 0) {
    parts.push(footers.join('\n'));
  }

  const fullMessage = parts.join('\n\n');

  return {
    header,
    body: cleanBody,
    footers,
    fullMessage,
  };
}

/**
 * Generate git CLI commands in different styles
 */
export function generateGitCommand(commitData, style = 'multiple-m') {
  const { header, body, footers, fullMessage } = formatCommit(commitData);

  if (style === 'single') {
    // Escaped single line
    const escaped = fullMessage.replace(/"/g, '\\"');
    return `git commit -m "${escaped}"`;
  }

  if (style === 'multiple-m') {
    const flags = [`-m "${header.replace(/"/g, '\\"')}"`];
    if (body) {
      flags.push(`-m "${body.replace(/"/g, '\\"')}"`);
    }
    if (footers.length > 0) {
      flags.push(`-m "${footers.join('\n').replace(/"/g, '\\"')}"`);
    }
    return `git commit ${flags.join(' ')}`;
  }

  if (style === 'heredoc') {
    return `git commit -F - << 'EOF'\n${fullMessage}\nEOF`;
  }

  return `git commit -m "${header}"`;
}

/**
 * Validates commit according to conventional commit guidelines
 */
export function validateCommit({
  type,
  scope,
  isBreaking,
  description,
  body,
  breakingDescription,
}) {
  const issues = [];
  const cleanDesc = (description || '').trim();
  const cleanScope = (scope || '').trim();

  if (!type) {
    issues.push({ level: 'error', message: 'Commit type is required.' });
  }

  if (!cleanDesc) {
    issues.push({ level: 'error', message: 'Short description is required.' });
  } else {
    // Check first letter capitalization
    const firstChar = cleanDesc.charAt(0);
    if (firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase() && isNaN(firstChar)) {
      issues.push({
        level: 'warning',
        message: 'Prefer lowercase for the first word in description (e.g. "add" instead of "Add").',
      });
    }

    // Check trailing period
    if (cleanDesc.endsWith('.')) {
      issues.push({
        level: 'warning',
        message: 'Conventional commits avoid trailing periods at the end of the subject.',
      });
    }

    // Check header length
    let headerLength = type.length + (cleanScope ? cleanScope.length + 2 : 0) + (isBreaking ? 1 : 0) + 2 + cleanDesc.length;
    if (headerLength > 72) {
      issues.push({
        level: 'warning',
        message: `Header length (${headerLength} chars) exceeds 72 characters limit.`,
      });
    } else if (headerLength > 50) {
      issues.push({
        level: 'info',
        message: `Header length is ${headerLength} chars. Recommended ideal length is <= 50 chars.`,
      });
    }
  }

  if (cleanScope && /\s/.test(cleanScope)) {
    issues.push({
      level: 'warning',
      message: 'Scope should not contain spaces. Use kebab-case or slashes (e.g. "ui/button" or "user-auth").',
    });
  }

  if (isBreaking && !breakingDescription.trim()) {
    issues.push({
      level: 'info',
      message: 'You flagged a breaking change (!). Adding a "BREAKING CHANGE:" footer description is highly recommended to explain migration path.',
    });
  }

  if (body) {
    const lines = body.split('\n');
    const longLines = lines.filter((l) => l.length > 72);
    if (longLines.length > 0) {
      issues.push({
        level: 'info',
        message: `${longLines.length} line(s) in body exceed recommended 72 characters wrap limit.`,
      });
    }
  }

  return issues;
}
