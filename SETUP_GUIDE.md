# QuickCourt - Complete Setup Guide

## 🚀 Project Status: FULLY WORKING ✅

### What's Working:
- ✅ Backend API (Node.js + Express)
- ✅ MongoDB Atlas Database
- ✅ Email OTP Verification (Gmail SMTP)
- ✅ User Authentication (JWT)
- ✅ Frontend (Next.js)
- ✅ All API Endpoints

### Current OTP Codes (Valid until expiry):
- `newuser@example.com`: OTP `378591` (Valid)
- `07darshanpokar@gmail.com`: OTP `715194` (Valid)

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

### 2. Test Signup
```powershell
$body = @{
  fullname = "Your Name"
  email = "your-email@gmail.com"
  password = "password123"
  confirmPassword = "password123"
  role = "user"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -ContentType "application/json" -Body $body
```

### 3. Get OTP Code
```powershell
node get-otp.js
```
This will show all OTP codes in the database.

### 4. Verify OTP
```powershell
$verify = @{
  userId = "USER_ID_FROM_SIGNUP"
  otp = "OTP_CODE_FROM_DATABASE"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/verify-otp" -Method Post -ContentType "application/json" -Body $verify
```

### 5. Login
```powershell
$login = @{
  email = "your-email@gmail.com"
  password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body $login
```

## 📧 Email Configuration

### Current SMTP Settings (Working):
- **Host:** smtp.gmail.com
- **Port:** 587
- **User:** 07darshanpokar@gmail.com
- **Pass:** iywngemlpaqxstxk (App Password)

### Why Emails Might Not Be Received:
1. **Check Spam Folder** - OTP emails might be in spam
2. **Gmail App Password** - Make sure you're using App Password, not regular password
3. **2-Factor Authentication** - Must be enabled on Gmail account

## 🎯 Quick Test Commands

### Test Email Functionality:
```powershell
npm run test-email
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

## 🔍 Troubleshooting

### If OTP emails not received:
1. Check backend console for OTP codes
2. Run `node get-otp.js` to see all codes
3. Check spam folder
4. Verify Gmail App Password

### If servers won't start:
1. Make sure you're in the correct directory
2. Run `npm install` in both backend and frontend
3. Check if ports 3000 and 5000 are available

### If database connection fails:
1. Check MongoDB Atlas connection string in `.env`
2. Ensure network access is configured in Atlas
3. Run `npm run test-db` to verify connection

## 📱 API Endpoints

### Authentication:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP

### Health Check:
- `GET /api/health` - Backend health status
- `GET /api/auth/debug-db` - Database info

## 🎉 Success Indicators

✅ Backend shows: "MongoDB Atlas connected successfully!"
✅ Frontend loads without errors
✅ Signup creates user in database
✅ OTP codes are generated and stored
✅ Login returns JWT token
✅ Email test sends successfully

## 📞 Support

If you encounter issues:
1. Check the backend console for error messages
2. Verify all environment variables in `.env`
3. Ensure both servers are running
4. Test individual components using the test scripts

**Project is fully functional and ready for development!** 🚀
