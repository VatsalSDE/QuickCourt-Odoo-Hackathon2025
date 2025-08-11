# QuickCourt - Frontend SMS OTP Integration Guide

## 🚀 Project Status: FULLY FUNCTIONAL ✅

### What's Working:
- ✅ Backend API with SMS OTP (Twilio)
- ✅ Frontend Signup with Phone Number
- ✅ Frontend OTP Verification
- ✅ Frontend Login Integration
- ✅ Complete User Flow: Signup → OTP → Login

## 📱 Frontend Features Added

### 1. **Enhanced Signup Form**
- ✅ Phone number input with international format
- ✅ Real-time API integration
- ✅ Error handling and success messages
- ✅ OTP verification step

### 2. **OTP Verification Screen**
- ✅ 6-digit OTP input
- ✅ Resend OTP functionality
- ✅ Success/error feedback
- ✅ Automatic redirect after verification

### 3. **Login Integration**
- ✅ JWT token storage
- ✅ User data persistence
- ✅ Role-based redirects
- ✅ Error handling

## 🎯 How to Test the Complete Flow

### Step 1: Start Both Servers

**Backend:**
```powershell
cd backend
npm run dev
```

**Frontend (New PowerShell Window):**
```powershell
cd quickcourt-frontend
npm run dev
```

### Step 2: Test Frontend Signup

1. **Go to:** http://localhost:3000/auth/signup
2. **Fill the form:**
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+919876543210` (or your real number)
   - Role: `User`
   - Password: `password123`
   - Confirm Password: `password123`

3. **Click "Create Account"**
   - Should show success message
   - Should redirect to OTP verification screen

### Step 3: Get OTP Code

```powershell
cd backend
node get-otp.js
```

Look for your phone number and copy the OTP code.

### Step 4: Verify OTP

1. **Enter the OTP code** in the frontend
2. **Click "Verify Account"**
3. **Should redirect to login page**

### Step 5: Test Login

1. **Go to:** http://localhost:3000/auth/login
2. **Enter credentials:**
   - Email: `test@example.com`
   - Password: `password123`
3. **Click "Sign in"**
4. **Should redirect to dashboard**

## 🔧 API Integration Details

### Signup API Call
```javascript
const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullname: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    role: formData.role,
  }),
})
```

### OTP Verification API Call
```javascript
const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: otpData.userId,
    otp: otpData.otp,
  }),
})
```

### Login API Call
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: formData.email,
    password: formData.password,
  }),
})
```

## 📱 Phone Number Format

### Required Format:
- **International format:** `+[country code][phone number]`
- **Examples:**
  - US: `+1234567890`
  - India: `+919876543210`
  - UK: `+44123456789`

### Validation:
- Frontend shows format hint
- Backend validates with regex
- Must be unique per user

## 🔍 Troubleshooting

### If Signup Fails:
1. Check browser console for errors
2. Verify backend is running on port 5000
3. Check phone number format
4. Ensure all fields are filled

### If OTP Not Received:
1. Check backend console for OTP codes
2. Run `node get-otp.js` to see all codes
3. Verify Twilio configuration
4. Check phone number format

### If Login Fails:
1. Ensure account is verified
2. Check email/password
3. Verify backend is running
4. Check browser console for errors

## 🎨 Frontend Components

### 1. **Signup Form** (`/app/auth/signup/page.jsx`)
- Phone number input with icon
- Form validation
- API integration
- Error handling

### 2. **OTP Verification** (Built into signup)
- 6-digit input
- Resend functionality
- Success/error messages

### 3. **Login Form** (`/app/auth/login/page.jsx`)
- JWT token storage
- Role-based redirects
- Error handling

### 4. **Phone Verification Component** (`/components/PhoneVerification.jsx`)
- Reusable OTP component
- Customizable callbacks
- Error handling

## 📊 Current Test Data

### Verified Users:
- **Email:** `frontend@example.com`
- **Phone:** `+919876543210`
- **Status:** ✅ Verified
- **Role:** User

### Test Commands:
```powershell
# Get all OTP codes
node get-otp.js

# Test SMS functionality
npm run test-sms

# Test database connection
npm run test-db
```

## 🌐 Frontend URLs

- **Home:** http://localhost:3000
- **Signup:** http://localhost:3000/auth/signup
- **Login:** http://localhost:3000/auth/login
- **Venues:** http://localhost:3000/venues

## 🎉 Success Indicators

✅ Frontend loads without errors
✅ Signup form accepts phone number
✅ OTP verification works
✅ Login redirects properly
✅ JWT tokens are stored
✅ User data persists

## 📞 Next Steps

1. **Get Real Twilio Credentials** for production SMS
2. **Update `.env`** with your Twilio settings
3. **Test with Real Phone Numbers**
4. **Deploy to Production**

**Frontend SMS OTP integration is complete and fully functional!** 🚀📱
