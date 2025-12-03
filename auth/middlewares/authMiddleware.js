import { supabaseAdmin } from '../../config/supabase.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing or malformed'
            });
        }

        const token = authHeader.substring(7);

        // Use supabase admin client to verify the token
        let user;
        let err;
        try {
            const result = await supabaseAdmin.auth.getUser(token);
            user = result?.data?.user;
            err = result?.error;
        } catch (e) {
            console.error('Error calling supabase getUser in middleware:', e);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to validate token', 
                error: e.message 
            });
        }

        if (err || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
                error: err?.message || undefined
            });
        }

        // Fetch user profile data including role
        try {
            const { data: profile, error: profileError } = await supabaseAdmin
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                console.error('Error fetching user profile:', profileError);
                // Continue without role info rather than failing
            }

            req.user = {
                id: user.id,
                email: user.email,
                email_confirmed_at: user.email_confirmed_at,
                created_at: user.created_at,
                last_sign_in_at: user.last_sign_in_at,
                role: profile?.role || 'customer' // default to customer if no profile
            };
        } catch (error) {
            console.error('Error in profile lookup:', error);
            req.user = {
                id: user.id,
                email: user.email,
                email_confirmed_at: user.email_confirmed_at,
                created_at: user.created_at,
                last_sign_in_at: user.last_sign_in_at,
                role: 'customer' // default fallback
            };
        }

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

export const requireEmailVerified = (req, res, next) => {
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

export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }

    next();
};

export const requireSeller = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
    }

    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Seller or admin access required'
        });
    }

    next();
};

export const requireCustomer = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
    }

    if (!['customer', 'seller', 'admin'].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'Customer access or higher required'
        });
    }

    next();
};
