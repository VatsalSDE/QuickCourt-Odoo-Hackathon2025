# Environment Variables Template for QuickCourt

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/quickcourt
MONGODB_DB=quickcourt

# JWT Secret (generate a strong secret for production)
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Razorpay Configuration (for production)
# Get these from your Razorpay dashboard
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_test_key_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here
```

## Notes

- **For Demo/Testing**: The app will work without Razorpay keys using demo mode
- **For Production**: You must provide valid Razorpay credentials
- **MongoDB**: Ensure MongoDB is running locally or provide a cloud connection string
- **JWT Secret**: Generate a strong, random secret for production use

## Getting Razorpay Keys

1. Sign up at [Razorpay](https://razorpay.com)
2. Go to Settings > API Keys
3. Generate a new key pair
4. Use the Key ID as `NEXT_PUBLIC_RAZORPAY_KEY_ID`
5. Use the Key Secret as `RAZORPAY_KEY_SECRET`

## Security

- Never commit `.env.local` to version control
- Use different keys for development and production
- Regularly rotate your JWT secret
- Monitor API usage and set appropriate limits
