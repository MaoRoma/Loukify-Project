const jwt = require('jsonwebtoken');
/**
 * Generate a JWT token
 * @param {Object} payload - Token payload
 * @param {string} secret - JWT secret
 * @param {Object} options - JWT options
 * @returns {string} JWT token
 */
const generateJWT = (payload, secret = process.env.JWT_SECRET, options = {}) => {
  if (!secret) {
    throw new Error('JWT secret is required');
  }

  const defaultOptions = {
    expiresIn: '7d',
    issuer: 'loukify-backend',
    ...options
  };

  return jwt.sign(payload, secret, defaultOptions);
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @param {string} secret - JWT secret
 * @returns {Object} Decoded token payload
 */
const verifyJWT = (token, secret = process.env.JWT_SECRET) => {
  if (!secret) {
    throw new Error('JWT secret is required');
  }

  return jwt.verify(token, secret);
};

/**
 * Generate a random token for various purposes
 * @param {number} length - Token length
 * @returns {string} Random token
 */
const generateRandomToken = (length = 32) => {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate OTP (One-Time Password)
 * @param {number} length - OTP length (default: 6)
 * @returns {string} OTP
 */
const generateOTP = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

/**
 * Generate a secure API key
 * @returns {string} API key
 */
const generateAPIKey = () => {
  const prefix = 'lk_';
  const randomPart = generateRandomToken(24);
  return `${prefix}${randomPart}`;
};

/**
 * Decode JWT without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object} Decoded token
 */
const decodeJWT = (token) => {
  return jwt.decode(token, { complete: true });
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} Whether token is expired
 */
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

module.exports = {
  generateJWT,
  verifyJWT,
  generateRandomToken,
  generateOTP,
  generateAPIKey,
  decodeJWT,
  isTokenExpired
};
