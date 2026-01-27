/**
 * FACIAL RECOGNITION FLOW INTEGRATION
 * ====================================
 * 
 * This document describes the facial recognition integration across the sign-up and sign-in flows.
 */

// ============= SIGN-UP FLOW =============
// File: app/(auth)/sign-up/page.tsx
// 
// Step 1: User fills form (email, password, preferences)
// Step 2: Account is created via signUpWithEmail()
// Step 3: User is prompted to register facial profile (OPTIONAL)
// Step 4: If registered, facial data is stored in database
// Step 5: User redirected to dashboard
//
// Services Used:
// - signUpWithEmail() - from lib/actions/authaction.ts
// - registerFaceOnSignUp() - from lib/actions/facial-signup.ts
// - registerFacialProfile() - from lib/facial-utils.ts
// - FacialLogin component with mode="register"

// ============= SIGN-IN FLOW =============
// File: app/(auth)/sign-in/page.tsx
//
// Option A: Email/Password Sign-in
// Step 1: User enters email and password
// Step 2: System checks if user has facial profile registered
// Step 3: If yes, offer facial recognition as option
// Step 4: Sign in with email/password
// Step 5: Redirect to dashboard
//
// Option B: Facial Recognition Sign-in (if profile exists)
// Step 1: User enters email
// Step 2: System detects facial profile exists
// Step 3: Switch to facial login mode
// Step 4: User captures face
// Step 5: Face is verified against stored descriptor
// Step 6: If match, user is signed in
// Step 7: Redirect to dashboard
//
// Services Used:
// - signInWithEmail() - from lib/actions/authaction.ts
// - canUseFacialSignIn() - from lib/actions/facial-signin.ts
// - signInWithFacial() - from lib/actions/facial-signin.ts
// - verifyFacialProfile() - from lib/facial-utils.ts
// - FacialLogin component with mode="login"

// ============= DATABASE LAYER =============
// File: lib/db/facial-data.ts
//
// Prisma Model: FacialProfile
// - id: unique identifier
// - email: unique email (linked to user account)
// - fullName: user's name
// - faceDescriptor: Base64 encoded Float32Array from face-api.js
// - registeredAt: when facial profile was created
// - lastUsedAt: last time facial recognition was used for login
// - isActive: whether profile is enabled
//
// Methods:
// - registerFace(email, descriptor, fullName) - create/update facial profile
// - getFacialProfile(email) - retrieve profile
// - verifyFace(storedDescriptor, currentDescriptor) - check match
// - updateLastUsed(email) - update last login timestamp
// - deleteFace(email) - remove facial profile
// - hasFaceRegistered(email) - check if profile exists
// - disableFace(email) - soft delete
// - getStats() - admin stats

// ============= API ROUTES =============
// POST /api/facial/register
// - Register or update facial descriptor
// - Body: { email, faceDescriptor, fullName }
// - Returns: success, profile details
//
// GET /api/facial/register?email=user@example.com
// - Check if user has facial profile
// - Returns: { email, hasFacialProfile: boolean }
//
// POST /api/facial/verify
// - Verify facial descriptor against stored profile
// - Body: { email, faceDescriptor }
// - Returns: { isMatch, similarity, confidence, distance, message }

// ============= COMPONENTS =============
// File: components/FacialLogin.tsx
//
// Props:
// - onSuccess(faceDescriptor: string) - called when face captured successfully
// - onError(error: string) - called on error
// - mode: 'register' | 'login' - determines UI messages
//
// Features:
// - Real-time face detection with canvas overlay
// - Loading states for models and capture
// - Error handling and user feedback
// - Face descriptor captured as Base64

// ============= UTILITIES =============
// File: lib/facial-utils.ts
//
// - registerFacialProfile(data) - client-side registration
// - verifyFacialProfile(data) - client-side verification
// - checkFacialProfileExists(email) - check if profile exists
//
// File: lib/actions/facial-signin.ts
//
// - signInWithFacial(email, descriptor) - server-side verification
// - canUseFacialSignIn(email) - check if user can use facial login
//
// File: lib/actions/facial-signup.ts
//
// - registerFaceOnSignUp(email, descriptor, fullName) - server-side registration

// ============= FLOW DIAGRAMS =============
//
// SIGN-UP WITH FACIAL:
// User Form -> Create Account -> [Optional] Register Face -> Dashboard
//                                      ↓
//                            Store Face Descriptor
//                                      ↓
//                              Enable Facial Login
//
// SIGN-IN WITH FACIAL:
// Enter Email -> Check Facial Exists -> Option to Use Facial
//                     ↓
//               Yes: Facial Mode
//                     ↓
//               Capture Face -> Verify -> Match -> Login
//                                ↓
//                           No Match -> Retry/Email
//
//                     No: Email/Password Mode
//                     ↓
//               Enter Password -> Login

// ============= DISTANCE THRESHOLD =============
// Face-API.js uses Euclidean distance for comparison
// Threshold: 0.6
// - distance < 0.6: Match (user can log in)
// - distance >= 0.6: No match (try again)
//
// Similarity % = max(0, 1 - distance / 0.6) * 100
// Confidence = similarity % (0-100)

// ============= TODO: FUTURE ENHANCEMENTS =============
// 1. JWT/Session token generation after successful facial login
// 2. Rate limiting on facial verification attempts
// 3. Liveness detection (prevent spoofing with photos)
// 4. Support for multiple facial profiles per user
// 5. Backup facial profiles
// 6. Admin dashboard for facial recognition stats
// 7. Facial profile management in user settings
// 8. Optional two-factor auth with facial recognition
// 9. Biometric security for sensitive operations
// 10. Privacy-preserving facial comparison (client-side only option)
