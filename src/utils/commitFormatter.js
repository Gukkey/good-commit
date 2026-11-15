import { GITMOJIS } from '../constants/gitmojis';

/**
 * Resolves a gitmoji code or emoji into the requested format ('code' | 'emoji')
 */
export function resolveGitmoji(gitmojiStr, format = 'emoji') {
  if (!gitmojiStr) return '';
  const item = GITMOJIS.find(
    (g) => g.code === gitmojiStr || g.emoji === gitmojiStr || g.name === gitmojiStr
  );
  if (!item) return gitmojiStr;
  return format === 'code' ? item.code : item.emoji;
}

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
  useGitmoji = false,
  gitmoji = '',
  gitmojiFormat = 'emoji', // 'emoji' | 'code'
  gitmojiPosition = 'after-type', // 'after-type' | 'before-type'
}) {
  const cleanScope = scope.trim();
  const cleanDesc = description.trim();
  const resolvedEmoji = useGitmoji && gitmoji ? resolveGitmoji(gitmoji, gitmojiFormat) : '';

  // Core header part: <type>(<scope>)!
  let corePrefix = type;
  if (cleanScope) {
    corePrefix += `(${cleanScope})`;
  }
  if (isBreaking) {
    corePrefix += '!';
  }

  // Construct complete header with gitmoji
  let header = '';
  if (resolvedEmoji) {
    if (gitmojiPosition === 'before-type') {
      header = `${resolvedEmoji} ${corePrefix}: ${cleanDesc}`.trim();
    } else {
      header = `${corePrefix}: ${resolvedEmoji} ${cleanDesc}`.trim();
    }
  } else {
    header = `${corePrefix}: ${cleanDesc}`.trim();
  }

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
    corePrefix,
    resolvedEmoji,
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
  useGitmoji,
  gitmoji,
  gitmojiFormat,
  gitmojiPosition,
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
    // Check first letter capitalization (ignoring any leading emoji/symbols)
    const firstAlpha = cleanDesc.match(/[a-zA-Z]/);
    if (firstAlpha && firstAlpha.index === 0) {
      const char = firstAlpha[0];
      if (char === char.toUpperCase() && char !== char.toLowerCase()) {
        issues.push({
          level: 'warning',
          message: 'Prefer lowercase for the first word in description (e.g. "add" instead of "Add").',
        });
      }
    }

    // Check trailing period
    if (cleanDesc.endsWith('.')) {
      issues.push({
        level: 'warning',
        message: 'Conventional commits avoid trailing periods at the end of the subject.',
      });
    }

    const { header } = formatCommit({
      type,
      scope,
      isBreaking,
      description,
      useGitmoji,
      gitmoji,
      gitmojiFormat,
      gitmojiPosition,
    });

    const headerLength = header.length;
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
