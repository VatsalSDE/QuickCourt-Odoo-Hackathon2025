# QuickCourt - Sports Venue Booking Platform

A modern sports venue booking platform built with Next.js, featuring role-based authentication and MongoDB integration.

## Features

### 🔐 Authentication & Authorization
- **User Registration & Login**: Secure authentication with JWT tokens
- **Role-Based Access Control**: Three user roles with distinct functionalities
  - **Users**: Browse venues, make bookings, manage profile
  - **Facility Owners**: Manage facilities, courts, and bookings
  - **Admins**: Platform management, user oversight, facility approvals

### 🏟️ Core Functionality
- **Venue Discovery**: Search and browse sports facilities
- **Smart Booking System**: Real-time availability and instant booking
- **Role-Specific Dashboards**: Tailored interfaces for each user type
- **Responsive Design**: Mobile-first approach with modern UI components

### 🛠️ Technical Stack
- **Frontend**: Next.js 14 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens with bcrypt password hashing
- **State Management**: React Context for authentication state

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB instance (local or cloud)
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quickcourt-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/quickcourt
   MONGODB_DB=quickcourt
   
   # JWT Secret (generate a strong secret for production)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Next.js
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will automatically create collections on first use

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
quickcourt-frontend/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin-only routes
│   ├── auth/              # Authentication routes
│   ├── owner/             # Facility owner routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.jsx    # Main navigation
│   └── ProtectedRoute.jsx # Route protection component
├── lib/                  # Utility functions and contexts
│   └── auth-context.jsx  # Authentication context
└── public/               # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Protected Routes
- Admin routes: `/admin/*` (admin role only)
- Owner routes: `/owner/*` (facility_owner role only)
- User routes: `/profile`, `/bookings` (authenticated users)

## User Roles & Permissions

### 👤 Regular Users
- Browse and search venues
- Make court bookings
- View booking history
- Manage personal profile

### 🏢 Facility Owners
- Register and manage sports facilities
- Add and configure courts
- Set pricing and availability
- View booking analytics
- Manage time slots

### 👑 Administrators
- Approve facility registrations
- Monitor platform activity
- Manage user accounts
- View system analytics
- Handle reports and moderation

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based sessions
- **Role-Based Access**: Route-level protection
- **Input Validation**: Server-side validation for all inputs
- **Secure Headers**: CSRF protection and secure cookies

## Development

### Adding New Features
1. Create new components in `components/` directory
2. Add new pages in `app/` directory
3. Update navigation in `components/navigation.jsx`
4. Add API routes in `app/api/` directory

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow shadcn/ui component patterns
- Maintain consistent spacing and typography
- Ensure responsive design for all screen sizes

### Database Schema
The application uses MongoDB collections:
- `users`: User accounts and profiles
- `facilities`: Sports venue information
- `courts`: Individual court details
- `bookings`: Reservation records
- `timeSlots`: Available time slots

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all environment variables are set in production:
- `MONGODB_URI`: Production MongoDB connection string
- `JWT_SECRET`: Strong, unique JWT secret
- `NEXT_PUBLIC_APP_URL`: Production application URL

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or AWS Amplify
- **Database**: MongoDB Atlas or self-hosted MongoDB
- **Environment**: Node.js 18+ runtime

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**QuickCourt** - Making sports venue booking simple and accessible for everyone! 🏸⚽🎾
