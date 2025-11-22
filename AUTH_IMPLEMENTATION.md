# Authentication System Implementation

This document describes the authentication system implemented for the AFYA Wellness platform.

## Overview

The authentication system is built using NextAuth.js v5 (Auth.js) with a credentials provider, providing secure user authentication, session management, password reset, and account setup flows.

## Features Implemented

### 1. NextAuth.js v5 Configuration
- **Location**: `lib/auth/`
- Credentials provider for email/password authentication
- JWT-based session management (30-minute timeout)
- Role-based access control (USER, ADMIN, SUPER_ADMIN)
- Secure password hashing with bcrypt (cost factor 12)
- Activity logging for authentication events

### 2. Login System
- **Location**: `app/(auth)/login/`
- Email and password login form
- Form validation using Zod
- Error handling with user-friendly messages
- Redirect to dashboard on successful login
- Link to password reset flow
- Success messages for account setup and password reset

### 3. Password Reset Flow
- **Location**: `app/(auth)/reset-password/`
- Two-step password reset process:
  1. Request reset (email input)
  2. Set new password (token-based)
- Secure token generation (32-byte random hex)
- 1-hour token expiration
- Email enumeration protection
- Activity logging

### 4. Account Setup Flow
- **Location**: `app/(auth)/setup/[token]/`
- Token-based account activation
- User profile completion (name, password)
- Password confirmation validation
- Automatic account activation on completion
- Token validation and expiration handling

## File Structure

```
lib/auth/
├── config.ts          # NextAuth configuration
└── index.ts           # Auth exports

app/
├── (auth)/            # Authentication routes
│   ├── login/
│   ├── reset-password/
│   │   └── [token]/
│   └── setup/[token]/
├── (portal)/          # Protected portal routes
│   └── dashboard/
├── actions/
│   └── auth.ts        # Server actions for auth
└── api/auth/[...nextauth]/
    └── route.ts       # NextAuth API handler

components/
├── forms/             # Form components
│   ├── login-form.tsx
│   ├── reset-request-form.tsx
│   ├── reset-password-form.tsx
│   └── setup-account-form.tsx
└── ui/                # Base UI components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── label.tsx

middleware.ts          # Route protection middleware
types/next-auth.d.ts   # TypeScript type definitions
```

## Security Features

1. **Password Security**
   - Bcrypt hashing with cost factor 12
   - Minimum 8-character password requirement
   - Password confirmation validation

2. **Token Security**
   - Cryptographically secure random tokens
   - Time-limited expiration (1 hour)
   - Single-use tokens (cleared after use)

3. **Session Security**
   - JWT-based sessions
   - 30-minute session timeout
   - Secure HTTP-only cookies
   - CSRF protection

4. **Route Protection**
   - Middleware-based authentication
   - Role-based access control
   - Automatic redirects for unauthorized access

5. **Activity Logging**
   - Login events
   - Password reset requests
   - Account setup completion
   - IP address tracking

## Environment Variables Required

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
DATABASE_URL="postgresql://..."
```

## Usage

### For Users

1. **Login**: Navigate to `/login` and enter credentials
2. **Password Reset**: Click "Forgot password?" on login page
3. **Account Setup**: Use the link from setup email

### For Admins

Admins can create user accounts which will:
1. Generate a setup token
2. Send setup email to the user
3. User completes setup via `/setup/[token]`
4. Account becomes active

## Next Steps

The following features are planned for future implementation:
- Email service integration (Resend/SendGrid)
- Two-factor authentication
- OAuth providers (Google, GitHub)
- Remember me functionality
- Account lockout after failed attempts
- Email verification for new accounts

## Testing

To test the authentication system:

1. Ensure database is running and migrated
2. Create a test user via admin panel (future) or seed script
3. Test login flow at `/login`
4. Test password reset at `/reset-password`
5. Test account setup with a valid token

## Notes

- Password reset emails are currently logged to console (production will use email service)
- Setup tokens are stored in the database with expiration
- All authentication actions are server-side for security
- Client components use React Hook Form for form management
