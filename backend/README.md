# QuickCourt Backend API

A full-stack sports facility booking platform built with Node.js, Express, and MongoDB Atlas.

## 🚀 Features

- **Authentication System**: JWT-based auth with OTP verification
- **Role-Based Access**: User, Facility Owner, and Admin roles
- **Facility Management**: CRUD operations for sports facilities
- **Court Management**: Manage individual courts within facilities
- **Time Slot Management**: Set availability and block maintenance slots
- **Booking System**: Create, view, and cancel court bookings
- **Admin Panel**: Approve facilities, manage users, view statistics
- **File Upload**: Support for facility images and user avatars

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Email**: Nodemailer (for OTP)
- **Validation**: Mongoose schemas

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB Atlas
```bash
npm run setup
```
Follow the guide in `MONGODB_ATLAS_SETUP.md`

### 3. Create Environment File
Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/quickcourt?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

### 4. Test Database Connection
```bash
npm run test-db
```

### 5. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP

### Users
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Facilities
- `GET /api/facilities` - List approved facilities
- `GET /api/facilities/:id` - Get facility details
- `POST /api/facilities` - Create facility (Owner/Admin)
- `GET /api/facilities/me/list` - Get my facilities (Owner)
- `PUT /api/facilities/:id` - Update facility (Owner/Admin)

### Courts
- `POST /api/courts` - Create court (Owner/Admin)
- `GET /api/courts/facility/:facilityId` - Get courts by facility
- `PUT /api/courts/:id` - Update court (Owner/Admin)

### Time Slots
- `GET /api/timeslots` - Get availability
- `POST /api/timeslots` - Set availability (Owner/Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/me` - Get my bookings
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/owner/overview` - Owner booking overview

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/facilities/pending` - Pending facility approvals
- `POST /api/admin/facilities/:id/approve` - Approve facility
- `POST /api/admin/facilities/:id/reject` - Reject facility
- `GET /api/admin/users` - List all users
- `POST /api/admin/users/:id/ban` - Ban user
- `POST /api/admin/users/:id/unban` - Unban user

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

### User
- Book courts
- View facilities
- Manage profile and bookings

### Facility Owner
- Create and manage facilities
- Manage courts and time slots
- View booking overview

### Admin
- Approve/reject facilities
- Manage all users
- View system statistics
- Ban/unban users

## 📁 Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Auth and role middleware
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── uploads/         # File upload directory
├── app.js           # Express app configuration
├── server.js        # Server entry point
└── package.json     # Dependencies and scripts
```

## 🧪 Testing

```bash
# Test database connection
npm run test-db

# Test health endpoint
curl http://localhost:5000/health
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb://localhost:27017/quickcourt` |
| `JWT_SECRET` | JWT signing secret | `supersecretkey` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |

## 🚨 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation with Mongoose
- CORS enabled
- File upload restrictions

## 📝 License

This project is part of the QuickCourt Odoo Hackathon 2025.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions, please check the troubleshooting section in `MONGODB_ATLAS_SETUP.md`.
