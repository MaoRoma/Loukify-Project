const express = require('express');
const rateLimit = require('express-rate-limit');
const { sendOtp, verifyOtp, signOut, getCurrentUser, refreshToken, signup, login, passwordResetRequest, passwordResetConfirm, emailValidator, otpValidator, signupValidator } = require('../controllers/authController');
const { authenticateToken, requireEmailVerified } = require('../middlewares/authMiddleware');

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const otpLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: 'Too many OTP requests, please try again after a minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/send-otp', authLimiter, emailValidator, otpLimiter, sendOtp);
router.post('/verify-otp', authLimiter, otpValidator, verifyOtp);
// Password-based auth (Supabase-managed)
router.post('/signup', authLimiter, express.json(), signupValidator, signup);
router.post('/login', authLimiter, express.json(), login);
// Password reset (OTP-based)
router.post('/password-reset', authLimiter, express.json(), passwordResetRequest);
router.post('/password-reset/confirm', authLimiter, express.json(), otpValidator, passwordResetConfirm);
router.post('/refresh-token', authLimiter, refreshToken);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/sign-out', authenticateToken, signOut);
// Alias without hyphen to support clients that call /signout
router.post('/signout', authenticateToken, signOut);
router.get('/profile', authenticateToken, requireEmailVerified, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Access to protected profile route granted',
        data: {
            user: req.user
        }
    });
});

router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Health check successful',
        timestamp: new Date().toISOString()
    });
});
 module.exports = router;