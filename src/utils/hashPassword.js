const bcrypt = require('bcryptjs');

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Number of salt rounds (default: 10)
 * @returns {string} Hashed password
 */

const hashPassword = async (password, saltRounds = 12) => {
  try {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Hash password error:', error);
    throw new Error(`Failed to hash password: ${error.message}`);
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} Whether passwords match
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    if (!password || !hashedPassword) {
      throw new Error('Password and hashed password are required');
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Compare password error:', error);
    throw new Error(`Failed to compare password: ${error.message}`);
  }
};

/**
 * Generate a random password
 * @param {number} length - Password length (default: 12)
 * @param {Object} options - Password generation options
 * @returns {string} Random password
 */
const generateRandomPassword = (length = 12, options = {}) => {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = false,
    excludeSimilar = true
  } = options;

  let charset = '';
  
  if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers) charset += '0123456789';
  if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (excludeSimilar) {
    charset = charset.replace(/[0O1lI]/g, '');
  }

  if (!charset) {
    throw new Error('At least one character type must be included');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return password;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and feedback
 */
const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      score: 0,
      feedback: ['Password is required']
    };
  }

  const feedback = [];
  let score = 0;

  // Length check
  if (password.length < 6) {
    feedback.push('Password must be at least 6 characters long');
  } else if (password.length >= 8) {
    score += 1;
  }

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Additional checks
  if (password.length >= 12) score += 1;

  // Feedback based on missing elements
  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
  if (!/[0-9]/.test(password)) feedback.push('Add numbers');
  if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('Add special characters');

  // Common patterns to avoid
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeating characters');
    score -= 1;
  }

  if (/123|abc|qwe/i.test(password)) {
    feedback.push('Avoid common sequences');
    score -= 1;
  }

  const strength = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';

  return {
    isValid: feedback.length === 0 && score >= 3,
    score: Math.max(0, score),
    strength,
    feedback
  };
};

/**
 * Hash multiple passwords concurrently
 * @param {string[]} passwords - Array of passwords to hash
 * @param {number} saltRounds - Number of salt rounds
 * @returns {Promise<string[]>} Array of hashed passwords
 */
const hashMultiplePasswords = async (passwords, saltRounds = 12) => {
  try {
    const hashPromises = passwords.map(password => hashPassword(password, saltRounds));
    return await Promise.all(hashPromises);
  } catch (error) {
    console.error('Hash multiple passwords error:', error);
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateRandomPassword,
  validatePasswordStrength,
  hashMultiplePasswords
};
