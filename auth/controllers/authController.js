import { body, validationResult } from "express-validator";
import { supabaseAdmin } from "../../config/supabase.js";
import https from 'https';
import { URL } from 'url';

//Email Validation
const emailValidator = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
];

//OTP Validation
const otpValidator = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    // custom check: require either otp or token and if otp is present it must be 6 digits
    body().custom((_, { req }) => {
        const otp = req.body.otp;
        const token = req.body.token;
        if (!otp && !token) {
            throw new Error('OTP or token is required');
        }
        // If otp provided, ensure it's a 6-digit numeric code
        if (otp && !/^\d{6}$/.test(otp)) {
            throw new Error('OTP must be 6-digits number');
        }
        return true;
    })
];

// Signup with fullname Validation
const signupValidator = [
    body('fullname')
        .trim()
        .notEmpty()
        .withMessage('Full name is required'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must include at least one uppercase letter'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

//Send OTP to Email
const sendOtp = async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Send OTP validation errors:", errors.array());
            return res.status(400).json({ success:false, message:'Failed', errors: errors.array() });
        }
        const { email } = req.body;
        console.log("Sending OTP to:", email);
        const { data, error } = await supabaseAdmin.auth.signInWithOtp({ 
            email,
            options: {
                shouldCreateUser: true,
                emailRedirectTo: process.env.EMAIL_REDIRECT_URL
            }
        });
        if (error) {
            console.error("Error sending OTP:", error);
            return res.status(500).json({ success:false, message: 'Failed to send OTP', error: error.message });
        }
        console.log("OTP sent successfully:", email);

        res.status(200).json({ success:true, message: 'OTP sent successfully', data: { email: email } });
    } catch (err) {
        console.error("Unexpected error in sendOtp:", err);
        res.status(500).json({ success:false, message: 'Unexpected server error', error: err.message });
    }
};

//Verify OTP
const verifyOtp = async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Verify OTP validation errors:", errors.array());
            return res.status(400).json({ success:false, message:'Failed', errors: errors.array() });
        }

        // accept either `token` (preferred by supabase) or `otp` (client-provided 6-digit code)
        const { email } = req.body;
        let { token, otp } = req.body;
    // If client sent otp (6-digit), use it as token for Supabase verifyOtp call
    const tokenToUse = token || otp;

    console.log("Verifying OTP for:", email);
    console.log("Using token/otp:", tokenToUse);
    console.log("Token length:", tokenToUse ? tokenToUse.length : 'undefined');
    console.log("Token type:", typeof tokenToUse);
    console.log("Raw body:", JSON.stringify(req.body));
    

    const { data, error } = await supabase.auth.verifyOtp({ 
        email,
            token: tokenToUse,
            type: 'email'
        });
        if (error && error.message.includes('type')) {
            console.log('Retrying with magiclink tpe due to error',);
            const result = await supabase.auth.verifyOtp({ 
                email,
                token,
                type: 'magiclink'
            });
            data = result.data;
            error = result.error;
        }
        if (error) {
            console.error('Supabase OTP verification error:', error);
            console.error('   Error code:', error.code);
            console.error('   Error message:', error.message);
            console.error('   Error status:', error.status);
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP',
                error: error.message,
                debug: process.env.NODE_ENV === 'development' ? {
                    code: error.code,
                    status: error.status,
                    details: error
                    } : undefined
            });
        }

        const { user , session } = data;
        console.log('OTP verified successfully for:', email);

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    email_confirmed_at: user.email_confirmed_at,
                    created_at: user.created_at,
                },
                session: {
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                    expires_at: session.expires_at,
                    token_type: session.token_type,
                }
            }
        }); 
    } catch (error) {
        console.error("Unexpected error in verifyOtp:", error);
        res.status(500).json({
            success:false,
            message: 'Unexpected server error',
            error: error.message
        });
    }
};

//Sign Out
const signOut = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false,
                message: 'Authorization header missing or malformed' });
        }

        const token = authHeader.substring(7);

        try {
            let result;
            if (supabase.auth && supabase.auth.api && typeof supabase.auth.api.signOut === 'function') {
                result = await supabase.auth.api.signOut(token);
            } else if (supabase.auth && typeof supabase.auth.signOut === 'function') {
                // v2 signOut may not accept token; attempt to call with token if supported
                result = await supabase.auth.signOut({ access_token: token });
            } else {
                console.error('Supabase signOut not available on this SDK version');
                return res.status(501).json({ success: false, message: 'Sign out not supported with current Supabase SDK' });
            }

            const error = result?.error || null;
            if (error) {
                console.error("Error signing out:", error);
                return res.status(500).json({ 
                    success: false,
                    message: 'Failed to sign out',
                    error: error.message
                });
            }
        } catch (e) {
            console.error('Error during signOut:', e);
            return res.status(500).json({ success: false, message: 'Failed to sign out', error: e.message });
        }

        res.status(200).json({
            success: true,
            message: 'Signed out successfully'
        });

    } catch (error) {
        console.error("Unexpected error in signOut:", error);
        res.status(500).json({
            success:false,
            message: 'Unexpected server error',
            error: error.message
        });
    }
}; 

// Signup with email & password (Supabase-managed)
const signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Signup validation errors:", errors.array());
            return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
        }

        const { fullname, email, password } = req.body;

        let result;
        // try common APIs
        if (supabase.auth && typeof supabase.auth.signUp === 'function') {
            result = await supabase.auth.signUp(
                { email, password },
                { 
                    data: { 
                        fullname: fullname 
                    } 
                }
            );
        } else if (supabase.auth && typeof supabase.auth.signUp === 'function') {
            // fallback (same as above) kept for clarity
            result = await supabase.auth.signUp(
                { email, password },
                { 
                    data: { 
                        fullname: fullname 
                    } 
                }
            );
        } else {
            return res.status(501).json({ success: false, message: 'Signup not supported with current Supabase SDK' });
        }

        if (result.error) {
            return res.status(400).json({ success: false, message: result.error.message });
        }

        // normalize user object for different supabase-js versions
        const user = (result.data && result.data.user) || result.user || null;

        // If signup returned a user, insert a profile row into the `users` table
        if (user && user.id) {
            try {
                // derive first/last name from fullname if provided
                let firstName = '';
                let lastName = '';
                if (fullname && typeof fullname === 'string') {
                    const parts = fullname.trim().split(/\s+/);
                    firstName = parts.shift() || '';
                    lastName = parts.join(' ') || '';
                }

                const { data: insertData, error: insertError } = await supabase
                    .from('users')
                    .insert({
                        user_id: user.id,
                        first_name: firstName,
                        last_name: lastName,
                        email: user.email || email || '',
                    });

                if (insertError) {
                    console.error('Error inserting profile row into users table:', insertError);
                }
            } catch (err) {
                console.error('Unexpected error while inserting profile row:', err);
            }
        }

        return res.status(200).json({ success: true, message: 'Signup initiated', data: result.data || result });
    } catch (e) {
        console.error('Signup error:', e);
        return res.status(500).json({ success: false, message: 'Server error', error: e.message });
    }
};

// Login with email & password (Supabase-managed)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        let result;
        if (supabase.auth && typeof supabase.auth.signInWithPassword === 'function') {
            // supabase-js v2
            result = await supabase.auth.signInWithPassword({ email, password });
        } else if (supabase.auth && typeof supabase.auth.signIn === 'function') {
            // supabase-js v1
            result = await supabase.auth.signIn({ email, password });
        } else {
            return res.status(501).json({ success: false, message: 'Login not supported with current Supabase SDK' });
        }

        if (result.error) {
            return res.status(401).json({ success: false, message: result.error.message });
        }

        // normalize session/data
        const data = result.data || result;
        const session = data?.session || data?.user?.session || data?.session;

        return res.status(200).json({ success: true, message: 'Logged in', data: data });
    } catch (e) {
        console.error('Login error:', e);
        return res.status(500).json({ success: false, message: 'Server error', error: e.message });
    }
};

// Password reset: request OTP (reuse Supabase OTP send)
const passwordResetRequest = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: false,
            }
        });

        if (error) {
            console.error('Error sending password reset OTP:', error);
            return res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
        }

        // In development you may want the token echoed (not for production)
        return res.status(200).json({ success: true, message: 'Password reset OTP sent', data: data });
    } catch (e) {
        console.error('passwordResetRequest error:', e);
        return res.status(500).json({ success: false, message: 'Server error', error: e.message });
    }
};

// Password reset confirmation: verify OTP and update password via Supabase Admin API
const passwordResetConfirm = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
        }

        const { email } = req.body;
        let { token, otp, newPassword } = req.body;
        const tokenToUse = token || otp;

        if (!email || !tokenToUse || !newPassword) {
            return res.status(400).json({ success: false, message: 'email, token (or otp) and newPassword are required' });
        }

        // password policy
        if (typeof newPassword !== 'string' || newPassword.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
        }
        if (!/[A-Z]/.test(newPassword)) {
            return res.status(400).json({ success: false, message: 'Password must include at least one uppercase letter' });
        }

        // Verify OTP to get user id
        const verifyResult = await supabase.auth.verifyOtp({ email, token: tokenToUse, type: 'email' });
        let { data, error } = verifyResult;
        if (error) {
            console.error('Error verifying OTP for password reset:', error);
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP', error: error.message });
        }

        const user = data?.user;
        if (!user || !user.id) {
            return res.status(400).json({ success: false, message: 'User not found after OTP verification' });
        }

        // Use Supabase Admin REST API to update password if service key is available
        const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
        if (!serviceKey) {
            return res.status(501).json({ success: false, message: 'Server not configured with SUPABASE_SERVICE_KEY to perform password reset' });
        }

        // Build admin endpoint URL: {SUPABASE_URL}/auth/v1/admin/users/{id}
        const baseUrl = new URL(process.env.SUPABASE_URL);
        const adminPath = `${baseUrl.origin}/auth/v1/admin/users/${user.id}`;
        const body = JSON.stringify({ password: newPassword });

        const urlObj = new URL(adminPath);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                'apikey': serviceKey,
                'Authorization': `Bearer ${serviceKey}`
            }
        };

        const respBody = await new Promise((resolve, reject) => {
            const req = https.request(options, (r) => {
                let data = '';
                r.on('data', (chunk) => { data += chunk; });
                r.on('end', () => {
                    if (r.statusCode && r.statusCode >= 200 && r.statusCode < 300) return resolve({ status: r.statusCode, body: data ? JSON.parse(data) : null });
                    return reject(new Error(`Admin API responded ${r.statusCode}: ${data}`));
                });
            });
            req.on('error', (e) => reject(e));
            req.write(body);
            req.end();
        });

        return res.status(200).json({ success: true, message: 'Password updated successfully', data: respBody.body || null });
    } catch (e) {
        console.error('passwordResetConfirm error:', e);
        return res.status(500).json({ success: false, message: 'Server error', error: e.message });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token required'
            });
        }

        const token = authHeader.substring(7);
        let user;
        let err;

        // Compatibility: older supabase-js had supabase.auth.api.getUser(token)
        // Newer supabase-js (v2) exposes supabase.auth.getUser(token) / supabase.auth.getUser()
        try {
            if (supabase.auth && supabase.auth.api && typeof supabase.auth.api.getUser === 'function') {
                const result = await supabase.auth.api.getUser(token);
                user = result?.data?.user;
                err = result?.error;
            } else if (supabase.auth && typeof supabase.auth.getUser === 'function') {
                // supabase-js v2: getUser may accept the access token directly
                const result = await supabase.auth.getUser(token);
                // result may be { data: { user } } or { user }
                user = result?.data?.user || result?.user || result?.data?.user || undefined;
                err = result?.error || null;
            } else {
                // unknown supabase client shape
                console.error('Supabase client auth.getUser not available on this SDK version');
                return res.status(501).json({ success: false, message: 'Server does not support token introspection with current Supabase SDK version' });
            }
        } catch (e) {
            console.error('Error calling supabase getUser:', e);
            return res.status(500).json({ success: false, message: 'Failed to retrieve user from token', error: e.message });
        }

        if (err || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
                error: err?.message || undefined
            });
        }
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    email_confirmed_at: user.email_confirmed_at,
                    created_at: user.created_at,
                    last_sign_in_at: user.last_sign_in_at
                }
            }
        });
    
    } catch (error){
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        try {
            let result;
            if (supabase.auth && supabase.auth.api && typeof supabase.auth.api.refreshToken === 'function') {
                result = await supabase.auth.api.refreshToken({ refresh_token });
            } else if (supabase.auth && typeof supabase.auth.refreshSession === 'function') {
                // supabase-js v2 uses refreshSession or similar; try refreshSession
                result = await supabase.auth.refreshSession({ refresh_token });
            } else {
                console.error('Supabase refresh token API not available on this SDK version');
                return res.status(501).json({ success: false, message: 'Token refresh not supported with current Supabase SDK' });
            }

            const data = result?.data || result;
            const error = result?.error || null;
            if (error) {
                console.error("Error refreshing token:", error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to refresh token',
                    error: error.message
                });
            }

            // normalize data for response below
            // result may be { data: { user, session } }
            const responseData = data?.data || data;

            // build response using responseData to match previous shape
            const user = responseData?.user || responseData?.user;
            const session = responseData?.session || responseData?.session;

            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    user: {
                        id: user?.id,
                        email: user?.email,
                        email_confirmed_at: user?.email_confirmed_at
                    },
                    session: {
                        access_token: session?.access_token,
                        refresh_token: session?.refresh_token,
                        expires_at: session?.expires_at,
                        token_type: session?.token_type
                    }
                }
            });
            return;
        } catch (e) {
            console.error('Error refreshing token:', e);
            return res.status(500).json({ success: false, message: 'Failed to refresh token', error: e.message });
        }

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    email_confirmed_at: data.user.email_confirmed_at
                },
                session: {
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                    expires_at: data.session.expires_at,
                    token_type: data.session.token_type
                }
            }
        });

    } catch (error) {
        console.error("Unexpected error in refreshToken:", error);
        res.status(500).json({
            success: false,
            message: 'Unexpected server error',
            error: error.message
        });
    }
};

// Google OAuth: Initiate authentication
const initiateGoogleAuth = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: process.env.GOOGLE_REDIRECT_URL || 'http://localhost:3000/auth/google/callback',
                scopes: 'email profile'
            }
        });

        if (error) {
            console.error('Error initiating Google OAuth:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to initiate Google authentication',
                error: error.message
            });
        }

        // Supabase returns a URL to redirect the user to Google's OAuth consent screen
        if (data && data.url) {
            return res.status(200).json({
                success: true,
                message: 'Google authentication initiated',
                data: {
                    url: data.url
                }
            });
        }

        return res.status(500).json({
            success: false,
            message: 'No redirect URL returned from Supabase'
        });
    } catch (e) {
        console.error('Unexpected error in initiateGoogleAuth:', e);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: e.message
        });
    }
};

// Google OAuth: Handle callback and exchange code for session
const handleGoogleCallback = async (req, res) => {
    try {
        // Extract code and state from query params (Supabase sends these after Google OAuth)
        const { code, error: oauthError } = req.query;

        if (oauthError) {
            console.error('OAuth error from Google:', oauthError);
            return res.status(400).json({
                success: false,
                message: 'Google authentication failed',
                error: oauthError
            });
        }

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Authorization code missing'
            });
        }

        // Exchange code for session using Supabase
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('Error exchanging code for session:', error);
            return res.status(400).json({
                success: false,
                message: 'Failed to authenticate with Google',
                error: error.message
            });
        }

        const user = data?.user;
        const session = data?.session;

        if (!user || !session) {
            return res.status(400).json({
                success: false,
                message: 'No user or session returned from Google authentication'
            });
        }

        // Create/update user profile in users table
        if (user.id) {
            try {
                // Extract name from Google user metadata
                const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
                const firstName = user.user_metadata?.given_name || '';
                const lastName = user.user_metadata?.family_name || '';
                
                // If first/last name not in metadata, split full_name
                let derivedFirstName = firstName;
                let derivedLastName = lastName;
                if (!firstName && fullName) {
                    const parts = fullName.trim().split(/\s+/);
                    derivedFirstName = parts.shift() || '';
                    derivedLastName = parts.join(' ') || '';
                }

                console.log('Creating/updating profile for Google user:', user.id);
                const { data: upsertData, error: upsertError } = await supabase
                    .from('users')
                    .upsert({
                        user_id: user.id,
                        first_name: derivedFirstName,
                        last_name: derivedLastName,
                        email: user.email || '',
                        phone_number: user.phone || ''
                    }, { onConflict: ['user_id'] })
                    .select();

                console.log('Profile upsert response:', { upsertData, upsertError });
                if (upsertError) {
                    console.error('Error upserting Google user profile:', upsertError);
                }
            } catch (err) {
                console.error('Unexpected error while upserting Google user profile:', err);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Google authentication successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    email_confirmed_at: user.email_confirmed_at,
                    created_at: user.created_at,
                    user_metadata: user.user_metadata
                },
                session: {
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                    expires_at: session.expires_at,
                    token_type: session.token_type
                }
            }
        });
    } catch (e) {
        console.error('Unexpected error in handleGoogleCallback:', e);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: e.message
        });
    }
};

export {
    sendOtp,
    verifyOtp,
    signOut,
    getCurrentUser,
    refreshToken,
    signup,
    login,
    passwordResetRequest,
    passwordResetConfirm,
    initiateGoogleAuth,
    handleGoogleCallback,
    emailValidator,
    otpValidator,
    signupValidator
};
