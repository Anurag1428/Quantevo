# Facial Recognition Sign-in/Sign-up Integration - Setup Guide

## ✅ What's Been Implemented

### 1. **Sign-In Page** (`app/(auth)/sign-in/page.tsx`)
- ✅ Email/Password sign-in form
- ✅ Automatic detection of facial profile
- ✅ Switch between email and facial login modes
- ✅ Real-time face verification
- ✅ Toast notifications for user feedback

### 2. **Sign-Up Page** (`app/(auth)/sign-up/page.tsx`)
- ✅ Complete registration form with password strength indicator
- ✅ Two-step process: Account creation → Optional facial registration
- ✅ Facial registration is optional (users can skip)
- ✅ Stores facial descriptor after account creation

### 3. **Database Integration** (`lib/db/facial-data.ts`)
- ✅ Prisma ORM setup with PostgreSQL
- ✅ FacialProfile model with all required fields
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Stats and admin functions

### 4. **API Routes**
- ✅ `POST /api/facial/register` - Register facial profile
- ✅ `GET /api/facial/register` - Check if profile exists
- ✅ `POST /api/facial/verify` - Verify facial descriptor

### 5. **Services**
- ✅ `lib/actions/facial-signin.ts` - Sign-in logic
- ✅ `lib/actions/facial-signup.ts` - Sign-up facial registration
- ✅ `lib/facial-utils.ts` - Client-side utilities

### 6. **Components**
- ✅ FacialLogin component (already existed, now integrated)

---

## 🚀 Quick Start (After Database Setup)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database

**Create `.env.local`** in project root:

**Option A: Local PostgreSQL**
```
DATABASE_URL="postgresql://user:password@localhost:5432/quantevo"
```

**Option B: Free Cloud (Recommended)**

1. Go to [Neon](https://neon.tech) (free tier)
2. Create account and database
3. Copy connection string
4. Paste into `.env.local`:
```
DATABASE_URL="postgresql://user:password@host.neon.tech:5432/quantevo?sslmode=require"
```

### Step 3: Run Migrations
```bash
npx prisma migrate dev --name init
```

This will:
- Create database tables
- Generate Prisma Client
- Ready for use!

### Step 4: Test the Flow

**Sign Up:**
1. Go to `/sign-up`
2. Fill in form
3. Accept terms
4. You'll be prompted to register facial profile (optional)
5. Position face in camera
6. Click "Capture & Verify"
7. Done! Profile stored in database

**Sign In:**
1. Go to `/sign-in`
2. Enter email
3. System checks if facial profile exists
4. If yes, you can choose "Use Facial Recognition"
5. Capture face
6. If match (similarity > 60%), you're signed in!
7. If no match, you can retry or use email/password

---

## 📊 Database Schema

```prisma
model FacialProfile {
  id              String   @id @default(cuid())
  email           String   @unique
  fullName        String
  faceDescriptor  String   // Base64 encoded
  registeredAt    DateTime @default(now())
  lastUsedAt      DateTime?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 🔍 How Facial Verification Works

1. **Registration**
   - User captures face using camera
   - Face-API.js extracts 128-dimensional descriptor (Float32Array)
   - Descriptor converted to Base64 for storage
   - Stored in PostgreSQL database

2. **Verification**
   - User captures face during login
   - New descriptor extracted
   - Euclidean distance calculated between stored & current descriptor
   - Distance < 0.6 = Match ✅
   - Distance ≥ 0.6 = No Match ❌

3. **Similarity Score**
   - Similarity % = max(0, 1 - distance / 0.6) × 100
   - 100% = Perfect match
   - 60% = At threshold
   - Below 60% = No match

---

## 🛡️ Security Notes

- Face descriptors are stored as Base64 strings (not encrypted by default)
- TODO: Add encryption for facial descriptors
- TODO: Add liveness detection to prevent spoofing
- TODO: Rate limiting on verification attempts
- TODO: Audit logging for facial logins

---

## 📱 Testing Checklist

- [ ] Can create account with form
- [ ] Facial profile registration shows after sign-up
- [ ] Can capture face during registration
- [ ] Face data saved to database
- [ ] Can log in with email/password
- [ ] System detects existing facial profile
- [ ] Can switch to facial login mode
- [ ] Facial verification works (match case)
- [ ] Facial verification rejects non-match
- [ ] Can retry after failed facial match
- [ ] Can fall back to email/password

---

## 🐛 Debugging

**Check facial profiles:**
```bash
npx prisma studio
# Navigate to FacialProfile table
```

**View logs:**
```bash
# Prisma logs queries to console in development
# Look for [Facial DB] messages
```

**Test API directly:**
```bash
# Check if profile exists
curl "http://localhost:3000/api/facial/register?email=test@example.com"

# Register profile
curl -X POST http://localhost:3000/api/facial/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","faceDescriptor":"base64string","fullName":"Test User"}'
```

---

## 📚 File Structure

```
app/(auth)/
  sign-in/page.tsx           ← Email/Facial sign-in
  sign-up/page.tsx           ← Form + Facial registration
  
app/api/facial/
  register/route.ts          ← POST/GET register
  verify/route.ts            ← POST verify

lib/
  actions/
    authaction.ts            ← Auth actions
    facial-signin.ts         ← Sign-in logic
    facial-signup.ts         ← Sign-up facial logic
  db/
    facial-data.ts           ← Database operations
  facial-utils.ts            ← Client utilities
  prisma.ts                  ← Prisma singleton

prisma/
  schema.prisma              ← Database schema

components/
  FacialLogin.tsx            ← Face capture component
```

---

## 🎯 Next Phase TODOs

1. **Session Management**
   - Generate JWT token after facial verification
   - Set secure session cookie
   - Verify token on protected routes

2. **User Settings**
   - Allow users to manage facial profiles
   - Add/Remove facial profiles
   - Privacy controls

3. **Advanced Security**
   - Liveness detection (eye blink, head movement)
   - Spoof detection
   - Rate limiting on failed attempts
   - Audit logs for facial logins

4. **Optional Features**
   - Multiple facial profiles per user
   - Fallback profile if primary fails
   - Biometric unlock for sensitive operations
   - Facial recognition for transactions

---

## 💡 Tips

- **For Development:** Use localhost PostgreSQL or Neon free tier
- **For Testing:** Create test account, register face, try sign in
- **Good Lighting:** Ensure good lighting when capturing face
- **Face Position:** Keep face centered in camera frame
- **No Accessories:** Remove hats, sunglasses for best results

---

**Questions?** Check the FACIAL_RECOGNITION_INTEGRATION.md document for more details!
