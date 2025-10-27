# Loukify Backend - Supabase OTP Authentication

A Node.js Express backend with Supabase authentication supporting OTP-based signup/login via email.
# Loukify Backend — Supabase OTP Authentication

This repository is a lightweight Node.js + Express backend that integrates with Supabase Auth to provide passwordless (OTP/magic link) authentication and optional password-based sign in.

The README below is focused on what you need to run and test the project locally, plus quick troubleshooting notes.

---

## Quick start

Requirements
- Node.js 16+
- npm
- A Supabase project (you'll need the project URL and a key)

Install and run:

```powershell
npm install
Copy-Item .env.example .env
# edit .env and set SUPABASE_URL and SUPABASE_KEY (or SUPABASE_ANON_KEY)
npm run dev
```

The server defaults to the `PORT` in `.env` (see `.env.example`).

---

## Required environment variables

- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_KEY` — anon or service key (keep secret)
- `FRONTEND_URL` — optional (CORS)
- `EMAIL_REDIRECT_URL` — optional (magic link redirect)

Keep real secrets out of git; commit only `.env.example`.

---

## Endpoints (base: `/api/auth`)

- POST `/send-otp` — send OTP or magic link to an email
  - Body: { "email": "user@example.com" }
- POST `/verify-otp` — verify token (OTP or magic link token)
  - Body: { "email": "user@example.com", "token": "123456" }
- POST `/signup` — (Supabase-managed) sign up with email + password
  - Body: { "email": "user@example.com", "password": "P@ssw0rd!" }
- POST `/login` — (Supabase-managed) login with email + password
  - Body: { "email": "user@example.com", "password": "P@ssw0rd!" }
- POST `/refresh-token` — exchange refresh token for a new session
  - Body: { "refresh_token": "<refresh_token>" }
- GET `/me` — return user info from access token
  - Header: Authorization: Bearer <access_token>
- POST `/sign-out` (alias `/signout`) — sign out the session
  - Header: Authorization: Bearer <access_token>
- GET `/health` — health check (no auth)

## Password reset (OTP) endpoints

- POST `/password-reset` — request a password reset OTP (Supabase will send an email)
  - Body: { "email": "user@example.com" }
  - Response: 200 when Supabase accepted the request.

- POST `/password-reset/confirm` — verify OTP and set a new password
  - Body: { "email": "user@example.com", "token": "123456", "newPassword": "NewPass1!" }
  - Notes:
    - The endpoint verifies the OTP with Supabase and then updates the user's password using the Supabase Admin API.
    - To perform the password update the server must have a service role key available as `SUPABASE_SERVICE_KEY` (or `SUPABASE_KEY` set to a service role key) in env.
    - The server enforces the same password policy used for signup: minimum 8 characters and at least one uppercase letter.

Responses generally include a consistent shape: `{ success, message, data }`. On successful OTP verify/login you should receive `data.session` containing `access_token` and `refresh_token`.

---

## Example requests

Send OTP (PowerShell):

```powershell
$body = @{ email = 'you@example.com' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/send-otp' -Method Post -Body $body -ContentType 'application/json'
```

Verify OTP (PowerShell):

```powershell
$body = @{ email='you@example.com'; token='123456' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/verify-otp' -Method Post -Body $body -ContentType 'application/json'
```

Login with password (PowerShell):

```powershell
$body = @{ email='you@example.com'; password='P@ssw0rd!' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method Post -Body $body -ContentType 'application/json'
```

Refresh token (curl):

```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"your_refresh_token"}'
```

Get current user (curl):

```bash
curl -H "Authorization: Bearer <access_token>" http://localhost:3000/api/auth/me
```

---

## Troubleshooting & tips

- No email received:
  - Check Supabase Authentication > Settings > Email provider is configured (SMTP)
  - Check spam/junk folders
  - Look at the server console for Supabase error logs

- `TypeError: Cannot read properties of undefined (reading 'getUser')`:
  - Different `@supabase/supabase-js` versions expose different APIs. This project contains compatibility checks, but verifying installed version helps:
    ```powershell
    npm list @supabase/supabase-js
    ```

- Debugging locally:
  - The controllers log helpful debugging info in development. Run `node src/server.js` and watch the terminal when you call endpoints.

---

## Production notes

- Never expose service keys to the browser. Use service role keys only on the server.
- Use HTTPS in production and store refresh tokens securely (e.g., httpOnly cookies).
- Add monitoring for failed auth attempts and rate limit sensitive endpoints.

---

If you'd like, I can also:
- Export a Postman collection with tests that automatically store `access_token` and `refresh_token`.
- Add stronger password validation middleware and unit tests for auth handlers.

Tell me which you'd like next and I will add it.

## Authentication Flow

1. **Send OTP**: User enters email, receives OTP via email
2. **Verify OTP**: User enters OTP code, receives access and refresh tokens
3. **Access Protected Routes**: Use access token in Authorization header
4. **Token Refresh**: Use refresh token to get new access token when expired

## Middleware

### `authenticateToken`
Verifies JWT token and adds user to request object.

### `requireEmailVerified`
Ensures user's email is verified before accessing protected routes.

### `optionalAuth`
Adds user to request if token is valid, but doesn't fail if no token provided.

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **OTP endpoints**: 3 requests per minute
- **Auth endpoints**: 5 requests per 15 minutes

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

## Security Features

- Helmet.js for security headers
- CORS protection
- Rate limiting
- Input validation
- Secure token handling
- Environment variable protection

## Project Structure

```
src/
├── app.js                 # Express app configuration
├── server.js              # Server startup
├── config/
│   └── supabaseClient.js  # Supabase client configuration
├── controllers/
│   └── authController.js  # Authentication logic
├── middlewares/
│   └── authMiddleware.js  # Authentication middleware
├── routes/
│   └── authRoutes.js      # Authentication routes
├── services/
│   └── otpService.js      # OTP service functions
└── utils/
    ├── generateToken.js   # Token utilities
    └── hashPassword.js    # Password utilities
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3001) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | No |
| `EMAIL_REDIRECT_URL` | Email redirect URL | No |
| `JWT_SECRET` | JWT secret for custom tokens | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support, please contact the development team or create an issue in the repository.
- ✅ Protected routes with authentication middleware
- ✅ Token refresh functionality
- ✅ Supabase integration

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `JWT_SECRET`: A strong secret for JWT signing

3. **Supabase Setup:**
   - Create a new Supabase project
   - Enable email authentication in Authentication settings
   - Optionally configure email templates

4. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication Routes

#### 1. Sign Up with OTP

**Step 1: Send OTP**
```http
POST /api/auth/signup/send-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Step 2: Verify OTP and Create Account**
```http
POST /api/auth/signup/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password",
  "otp": "123456"
}
```

#### 2. Login with Password

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

#### 3. Login with OTP

**Step 1: Send OTP**
```http
POST /api/auth/login/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Step 2: Verify OTP and Login**
```http
POST /api/auth/login/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### 4. Get User Profile (Protected)

```http
GET /api/auth/profile
Authorization: Bearer <your_jwt_token>
```

#### 5. Logout (Protected)

```http
POST /api/auth/logout
Authorization: Bearer <your_jwt_token>
```

#### 6. Refresh Token

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refresh_token": "your_refresh_token"
}
```

### Response Format

**Success Response:**
```json
{
  "message": "Operation successful",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "email_verified": true
  },
  "token": "jwt_token",
  "session": "supabase_session"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## Project Structure

```
src/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── config/
│   └── supabaseClient.js  # Supabase client configuration
├── controllers/
│   └── authController.js  # Authentication logic
├── middlewares/
│   └── authMiddleware.js  # JWT authentication middleware
├── routes/
│   └── authRoutes.js      # Authentication routes
├── services/
│   └── otpService.js      # OTP generation and verification
└── utils/
    ├── generateToken.js   # JWT utilities
    └── hashPassword.js    # Password hashing utilities
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- OTP with expiration and attempt limits
- Rate limiting for OTP requests
- Email validation
- Password strength validation

## Development Notes

- OTPs are currently logged to console for development
- In production, implement email sending service
- Consider using Redis for OTP storage in production
- Implement rate limiting for API endpoints
- Add request validation middleware

## Testing

You can test the API using tools like Postman or curl. The OTP will be displayed in the console during development.

Example test flow:
1. Send signup OTP request
2. Check console for OTP
3. Verify OTP and complete signup
4. Use the returned token for protected routes