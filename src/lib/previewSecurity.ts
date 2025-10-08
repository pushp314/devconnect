
/**
 * @fileOverview Security utilities for sandboxing and analyzing code snippets.
 */

// Disallowed patterns that indicate potentially malicious or unsafe code.
// This is not exhaustive but covers common vectors.
const disallowedPatterns = [
  // Network requests
  'fetch',
  'XMLHttpRequest',
  'WebSocket',

  // Dynamic code execution
  'eval',
  'new Function',

  // Globals and storage
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'window.parent',
  'window.top',
  'window.opener',

  // Imports and requires
  'import',
  'require',
];

// A single regex to test for all disallowed patterns.
// It looks for the patterns as whole words or as properties/methods.
const unsafeCodeRegex = new RegExp(`\\b(${disallowedPatterns.join('|')})\\b`, 'i');

/**
 * Statically analyzes a code snippet to check for disallowed patterns.
 * @param code The code snippet to analyze.
 * @returns {boolean} `true` if the code is considered safe, `false` otherwise.
 */
export function isCodeSafeForPreview(code: string): boolean {
  return !unsafeCodeRegex.test(code);
}
