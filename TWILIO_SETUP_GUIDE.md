# QuickCourt - Twilio SMS OTP Setup Guide

## 🚀 Project Status: SMS OTP VERIFICATION READY ✅

### What's Working:
- ✅ Backend API (Node.js + Express)
- ✅ MongoDB Atlas Database
- ✅ SMS OTP Verification (Twilio)
- ✅ User Authentication (JWT)
- ✅ Frontend (Next.js)
- ✅ All API Endpoints

## 📱 Twilio SMS Configuration

### Step 1: Create Twilio Account
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for a free account
3. Get your Account SID and Auth Token from the dashboard

### Step 2: Get a Twilio Phone Number
1. In Twilio Console, go to "Phone Numbers" → "Manage" → "Buy a number"
2. Choose a phone number for SMS
3. Note down the phone number

### Step 3: Update Environment Variables
Add these to your `backend/.env` file:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://raj:raj%401906@learning.wgs34qb.mongodb.net/quickcourt?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=jkjhihkhkjklbjk

# Server Configuration
PORT=5000
NODE_ENV=development

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## 📋 How to Run the Project

### Step 1: Start Backend Server
```powershell
cd backend
npm run dev
```
**Backend will run on:** http://localhost:5000

### Step 2: Start Frontend Server (New PowerShell Window)
```powershell
cd quickcourt-frontend
npm run dev
```
**Frontend will run on:** http://localhost:3000

## 🔧 Testing the Application

### 1. Test Backend Health
```powershell
curl http://localhost:5000/health
```
Should return: `{"status":"ok"}`

### 2. Test SMS Functionality
```powershell
npm run test-sms
```

### 3. Test Signup with Phone Number
```powershell
$body = @{
  fullname = "Test User"
  email = "test@example.com"
  phone = "+1234567890"
  password = "password123"
  confirmPassword = "password123"
  role = "user"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -ContentType "application/json" -Body $body
```

### 4. Get OTP Code
```powershell
node get-otp.js
```
This will show all OTP codes in the database.

### 5. Verify OTP
```powershell
$verify = @{
  userId = "USER_ID_FROM_SIGNUP"
  otp = "OTP_CODE_FROM_DATABASE"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/verify-otp" -Method Post -ContentType "application/json" -Body $verify
```

### 6. Login
```powershell
$login = @{
  email = "test@example.com"
  password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body $login
```

### 7. Resend OTP
```powershell
$resend = @{
  phone = "+1234567890"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/resend-otp" -Method Post -ContentType "application/json" -Body $resend
```

## 📱 API Endpoints

### Authentication:
- `POST /api/auth/signup` - User registration (requires phone)
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP (by email or phone)

### Health Check:
- `GET /api/health` - Backend health status
- `GET /api/auth/debug-db` - Database info

## 🔍 Troubleshooting

### If SMS not received:
1. Check backend console for OTP codes
2. Run `node get-otp.js` to see all codes
3. Verify Twilio credentials in `.env`
4. Check Twilio console for SMS logs
5. Ensure phone number is in international format (+1234567890)

### If Twilio not configured:
1. SMS will be simulated in backend console
2. OTP codes will be logged for testing
3. No actual SMS will be sent

### If servers won't start:
1. Make sure you're in the correct directory
2. Run `npm install` in both backend and frontend
3. Check if ports 3000 and 5000 are available

## 📞 Twilio Free Trial Notes

- **Free Trial:** 15 days with $15-20 credit
- **SMS Cost:** ~$0.0075 per SMS (US numbers)
- **Phone Number:** ~$1/month
- **Verification:** Phone number verification required for production

## 🎯 Quick Test Commands

### Test SMS Functionality:
```powershell
npm run test-sms
```

### Test Database Connection:
```powershell
npm run test-db
```

### Get Current OTP Codes:
```powershell
node get-otp.js
```

## 🌐 Frontend URLs

- **Home:** http://localhost:3000
- **Signup:** http://localhost:3000/auth/signup
- **Login:** http://localhost:3000/auth/login
- **Venues:** http://localhost:3000/venues

## 🎉 Success Indicators

✅ Backend shows: "MongoDB Atlas connected successfully!"
✅ Frontend loads without errors
✅ Signup creates user in database with phone number
✅ OTP codes are generated and stored
✅ SMS test runs successfully
✅ Login returns JWT token

## 📞 Support

If you encounter issues:
1. Check the backend console for error messages
2. Verify all environment variables in `.env`
3. Ensure both servers are running
4. Test individual components using the test scripts
5. Check Twilio console for SMS delivery status

**Project is ready for SMS OTP verification!** 🚀
