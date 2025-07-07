/**
 * AllNighter v2 - Security Module
 * 
 * Security utilities for protecting against XSS, sanitizing input,
 * and implementing security best practices.
 * 
 * @author Julián LR, Lucas Salmerón Olschansky, Julián Moreira
 * @version 2.0.0
 * @license MIT
 */

// DOMPurify-like sanitization for security
const ALLOWED_TAGS = ['span', 'div', 'p', 'br', 'strong', 'em', 'b', 'i'];
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*>/gi,
  /<link\b[^<]*>/gi,
  /<meta\b[^<]*>/gi
];

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - The HTML content to sanitize
 * @returns {string} Sanitized HTML content
 */
export function sanitizeHTML(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  let sanitized = html;
  
  // Remove dangerous patterns
  DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Remove any remaining script tags that might have been obfuscated
  sanitized = sanitized.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Encode remaining HTML entities
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  return sanitized;
}

/**
 * Sanitize text content for safe display
 * @param {string} text - The text content to sanitize
 * @returns {string} Sanitized text content
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Remove any null bytes or control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Validate file name for security
 * @param {string} fileName - The file name to validate
 * @returns {boolean} True if file name is safe
 */
export function validateFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') {
    return false;
  }
  
  // Check for dangerous patterns in file names
  const dangerousPatterns = [
    /\.\./,           // Directory traversal
    /[<>:"|?*]/,      // Windows invalid characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows reserved names
    /^\./,            // Hidden files
    /\.$|\.$/,        // Ending with dot
    /\s+$/,           // Trailing whitespace
    /^$/              // Empty name
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(fileName));
}

/**
 * Sanitize file content before processing
 * @param {string} content - The file content to sanitize
 * @param {number} maxLength - Maximum allowed content length
 * @returns {string} Sanitized content
 */
export function sanitizeFileContent(content, maxLength = 10 * 1024 * 1024) { // 10MB default
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // Truncate content if too long
  if (content.length > maxLength) {
    content = content.substring(0, maxLength);
  }
  
  // Remove any null bytes or dangerous control characters
  content = content.replace(/[\x00\x08\x0B\x0C\x0E\x1F\x7F]/g, '');
  
  // Remove any embedded scripts or dangerous content
  content = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  content = content.replace(/javascript:/gi, '');
  content = content.replace(/data:text\/html/gi, '');
  
  return content;
}

/**
 * Generate a secure random string for nonces or tokens
 * @param {number} length - Length of the random string
 * @returns {string} Secure random string
 */
export function generateSecureToken(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate that content doesn't contain suspicious patterns
 * @param {string} content - Content to validate
 * @returns {object} Validation result with details
 */
export function validateContent(content) {
  const result = {
    isValid: true,
    warnings: [],
    errors: []
  };
  
  if (!content || typeof content !== 'string') {
    result.isValid = false;
    result.errors.push('Invalid content type');
    return result;
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    { pattern: /<script/gi, message: 'Contains script tags' },
    { pattern: /javascript:/gi, message: 'Contains JavaScript protocol' },
    { pattern: /data:text\/html/gi, message: 'Contains HTML data URLs' },
    { pattern: /on\w+\s*=/gi, message: 'Contains event handlers' },
    { pattern: /<iframe/gi, message: 'Contains iframe tags' },
    { pattern: /<object/gi, message: 'Contains object tags' },
    { pattern: /<embed/gi, message: 'Contains embed tags' }
  ];
  
  suspiciousPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(content)) {
      result.warnings.push(message);
    }
  });
  
  // Check content length
  if (content.length > 50 * 1024 * 1024) { // 50MB
    result.isValid = false;
    result.errors.push('Content too large');
  }
  
  return result;
}

/**
 * Rate limiting implementation
 */
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) { // 10 requests per minute default
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }
  
  /**
   * Check if request is allowed under rate limiting
   * @param {string} identifier - Unique identifier for the client
   * @returns {boolean} True if request is allowed
   */
  isAllowed(identifier = 'default') {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const userRequests = this.requests.get(identifier);
    
    // Remove old requests outside the time window
    const recentRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
  
  /**
   * Get remaining requests for an identifier
   * @param {string} identifier - Unique identifier
   * @returns {number} Number of remaining requests
   */
  getRemainingRequests(identifier = 'default') {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      return this.maxRequests;
    }
    
    const userRequests = this.requests.get(identifier);
    const recentRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    return Math.max(0, this.maxRequests - recentRequests.length);
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

/**
 * Secure the application by setting up CSP and other security headers
 * @returns {string} CSP nonce for scripts
 */
export function initializeSecurity() {
  const nonce = generateSecureToken(16);
  
  // Set Content Security Policy
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'", // Allow inline styles for dynamic styling
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'none'",
    "object-src 'none'",
    "frame-src 'none'",
    "worker-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  // Create meta tag for CSP if it doesn't exist
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', csp);
    document.head.appendChild(meta);
  }
  
  // Add other security headers via meta tags where possible
  const securityHeaders = [
    { name: 'X-Content-Type-Options', content: 'nosniff' },
    { name: 'X-Frame-Options', content: 'DENY' },
    { name: 'X-XSS-Protection', content: '1; mode=block' },
    { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
  ];
  
  securityHeaders.forEach(({ name, content }) => {
    if (!document.querySelector(`meta[http-equiv="${name}"]`)) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', name);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    }
  });
  
  return nonce;
}

/**
 * Safely set innerHTML with sanitization
 * @param {HTMLElement} element - Target element
 * @param {string} html - HTML content to set
 */
export function safeSetInnerHTML(element, html) {
  if (!element || !html) {
    return;
  }
  
  const sanitizedHTML = sanitizeHTML(html);
  element.innerHTML = sanitizedHTML;
}

/**
 * Safely set textContent
 * @param {HTMLElement} element - Target element
 * @param {string} text - Text content to set
 */
export function safeSetTextContent(element, text) {
  if (!element) {
    return;
  }
  
  const sanitizedText = sanitizeText(text);
  element.textContent = sanitizedText;
}
