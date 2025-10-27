const supabase = require('../config/supabaseClient').default;

/**
 * Service for handling OTP operations with Supabase
 */

/**
 * Send OTP to email using Supabase Auth
 * @param {string} email - User's email address
 * @param {Object} options - Additional options for OTP
 * @returns {Promise} Supabase response
 */
const sendEmailOTP = async (email, options = {}) => {
  try {
    const defaultOptions = {
      shouldCreateUser: true,
      emailRedirectTo: process.env.EMAIL_REDIRECT_URL || 'http://localhost:3000/auth/callback',
      data: {
        app_name: 'Loukify',
        ...options.data
      }
    };

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { ...defaultOptions, ...options }
    });

    if (error) {
      throw new Error(`Failed to send OTP: ${error.message}`);
    }

    return {
      success: true,
      data: data,
      message: 'OTP sent successfully'
    };
  } catch (error) {
    console.error('OTP Service - Send Email OTP Error:', error);
    throw error;
  }
};

/**
 * Verify OTP token
 * @param {string} email - User's email address
 * @param {string} token - OTP token to verify
 * @returns {Promise} Verification result
 */
const verifyEmailOTP = async (email, token) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'email'
    });

    if (error) {
      throw new Error(`OTP verification failed: ${error.message}`);
    }

    return {
      success: true,
      data: data,
      message: 'OTP verified successfully'
    };
  } catch (error) {
    console.error('OTP Service - Verify Email OTP Error:', error);
    throw error;
  }
};

/**
 * Resend OTP to email
 * @param {string} email - User's email address
 * @returns {Promise} Supabase response
 */
const resendEmailOTP = async (email) => {
  try {
    // Same as sending OTP, Supabase handles the resend logic
    return await sendEmailOTP(email, {
      data: {
        resend: true
      }
    });
  } catch (error) {
    console.error('OTP Service - Resend Email OTP Error:', error);
    throw error;
  }
};

/**
 * Check if email exists in Supabase Auth
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} Whether email exists
 */
const checkEmailExists = async (email) => {
  try {
    // Note: Supabase doesn't have a direct method to check if email exists
    // This is a security feature to prevent email enumeration
    // We'll return true for now, but you could implement custom logic
    return true;
  } catch (error) {
    console.error('OTP Service - Check Email Exists Error:', error);
    return false;
  }
};

/**
 * Validate OTP format
 * @param {string} token - OTP token to validate
 * @returns {boolean} Whether OTP format is valid
 */
const validateOTPFormat = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // OTP should be 6 digits
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(token.trim());
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email format is valid
 */
const validateEmailFormat = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
};

module.exports = {
  sendEmailOTP,
  verifyEmailOTP,
  resendEmailOTP,
  checkEmailExists,
  validateOTPFormat,
  validateEmailFormat
};
