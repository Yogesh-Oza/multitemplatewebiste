# Subdomain-Based Admin Access Control

This document explains the subdomain-based admin access control system implemented for the gram panchayat website.

## Overview

The system ensures that admin users can only access the admin panel for their specific subdomain. For example:
- Admin for `bopardi.localhost:3000` can only log in to `bopardi.localhost:3000/admin`
- Admin for `village1.localhost:3000` can only log in to `village1.localhost:3000/admin`
- Cross-subdomain access is blocked

## Implementation Details

### 1. Authentication Layer (`src/lib/auth.ts`)

- **Subdomain Validation**: During login, the system extracts the subdomain from the request hostname
- **User-Subdomain Matching**: Validates that the admin user belongs to the specific subdomain
- **JWT Token**: Includes subdomain information in the JWT token for session validation

```typescript
// Key changes:
- Added subdomain extraction from hostname
- Added subdomain validation in authorize function
- Included subdomain in JWT token and session
```

### 2. Middleware Protection (`src/middleware.ts`)

- **Route Protection**: Protects admin routes with authentication
- **Subdomain Validation**: Additional validation for subdomain-specific access
- **Error Handling**: Redirects unauthorized users with appropriate error messages

```typescript
// Key features:
- Validates user belongs to the subdomain they're accessing
- Redirects with error parameter for subdomain mismatch
- Maintains existing route protection logic
```

### 3. Login Form Enhancement (`src/components/admin/admin-login-form.tsx`)

- **Error Handling**: Displays specific error messages for subdomain mismatches
- **User Feedback**: Clear indication when access is denied due to subdomain restrictions

```typescript
// Key features:
- Detects subdomain mismatch errors from URL parameters
- Shows appropriate error messages in Marathi
- Maintains existing login functionality
```

### 4. Admin Layout Protection (`src/app/admin/layout.tsx`)

- **Server-Side Validation**: Validates subdomain access at the layout level
- **Session Verification**: Ensures user has proper permissions before rendering admin interface

```typescript
// Key features:
- Server-side subdomain validation
- Automatic redirect for unauthorized access
- Maintains session context
```

### 5. Helper Functions (`src/lib/subdomain-auth.ts`)

- **Subdomain Extraction**: Utility function to extract subdomain from hostname
- **Access Validation**: Centralized function for subdomain access validation
- **Type Safety**: Proper TypeScript types for subdomain handling

## How It Works

### Login Process

1. **User Access**: Admin tries to access `bopardi.localhost:3000/admin`
2. **Subdomain Detection**: System extracts `bopardi` from hostname
3. **Authentication**: User provides credentials
4. **Validation**: System checks if user belongs to `bopardi` subdomain
5. **Access Grant/Deny**: 
   - ✅ If user belongs to `bopardi` → Access granted
   - ❌ If user belongs to different subdomain → Access denied

### Session Management

1. **JWT Token**: Contains subdomain information
2. **Middleware Check**: Validates subdomain on each request
3. **Layout Validation**: Server-side validation in admin layout
4. **Automatic Redirect**: Unauthorized users redirected to login

### Error Handling

- **Subdomain Mismatch**: Clear error message in Marathi
- **Invalid Credentials**: Standard authentication error
- **Session Expired**: Automatic redirect to login

## Security Features

### 1. Multi-Layer Protection
- Authentication layer validation
- Middleware protection
- Layout-level validation
- Session-based verification

### 2. Subdomain Isolation
- Users can only access their assigned subdomain
- Cross-subdomain access is completely blocked
- No data leakage between subdomains

### 3. Error Messages
- User-friendly error messages in Marathi
- Clear indication of access restrictions
- Proper error handling for all scenarios

## Usage Examples

### Valid Access
```
User: bopardi_admin
Subdomain: bopardi.localhost:3000
Result: ✅ Access granted
```

### Invalid Access
```
User: bopardi_admin
Subdomain: village1.localhost:3000
Result: ❌ Access denied - "आपण या सबडोमेनसाठी अधिकृत नाही"
```

### Cross-Subdomain Protection
```
User: village1_admin
Tries to access: bopardi.localhost:3000/admin
Result: ❌ Automatic redirect to login with error
```

## Configuration

### Environment Variables
No additional environment variables required. Uses existing NextAuth configuration.

### Database Schema
Uses existing `AdminUser` and `Subdomain` models with `subdomainId` relationship.

### Middleware Configuration
No additional configuration required. Works with existing middleware setup.

## Testing

### Manual Testing
1. Create admin user for specific subdomain
2. Try to access admin panel from different subdomain
3. Verify access is denied with appropriate error message
4. Verify access works correctly on assigned subdomain

### Test Scenarios
- ✅ Valid subdomain access
- ❌ Invalid subdomain access
- ❌ Cross-subdomain access attempt
- ✅ Session persistence within subdomain
- ❌ Session access from different subdomain

## Benefits

1. **Security**: Complete isolation between subdomains
2. **User Experience**: Clear error messages and feedback
3. **Scalability**: Supports unlimited subdomains
4. **Maintainability**: Clean, modular implementation
5. **Performance**: Efficient validation with minimal overhead

## Future Enhancements

1. **Audit Logging**: Track subdomain access attempts
2. **Rate Limiting**: Prevent brute force attacks
3. **IP Whitelisting**: Additional security layer
4. **Multi-Factor Authentication**: Enhanced security
5. **Session Management**: Advanced session controls
