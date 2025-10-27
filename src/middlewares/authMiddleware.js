const supabase = require('../config/supabaseClient');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing or malformed'
            });
        }

        const token = authHeader.substring(7);

        // Compatibility: support both supabase-js v1 (supabase.auth.api.getUser)
        // and v2 (supabase.auth.getUser)
        let user;
        let err;
        try {
            if (supabase.auth && supabase.auth.api && typeof supabase.auth.api.getUser === 'function') {
                const result = await supabase.auth.api.getUser(token);
                user = result?.data?.user;
                err = result?.error;
            } else if (supabase.auth && typeof supabase.auth.getUser === 'function') {
                const result = await supabase.auth.getUser(token);
                user = result?.data?.user || result?.user || undefined;
                err = result?.error || null;
            } else {
                console.error('Supabase client auth.getUser not available on this SDK version');
                return res.status(501).json({ success: false, message: 'Server does not support token introspection with current Supabase SDK version' });
            }
        } catch (e) {
            console.error('Error calling supabase getUser in middleware:', e);
            return res.status(500).json({ success: false, message: 'Failed to validate token', error: e.message });
        }

        if (err || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
                error: err?.message || undefined
            });
        }

        req.user = {
            id: user.id,
            email: user.email,
            email_confirmed_at: user.email_confirmed_at,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at
        };
        next();
    } catch (error) {
        console.error("Unexpected error in authMiddleware:", error);
        res.status(500).json({
            success: false,
            message: 'Unexpected server error',
            error: error.message
        });
    }
};

const requireEmailVerified = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
    }

    if (!req.user.email_confirmed_at) {
        return res.status(403).json({
            success: false,
            message: 'Email not verified'
        });
    }

    next();
};

module.exports = {
    authenticateToken,
    requireEmailVerified
};
