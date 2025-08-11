# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Build a Database"

## Step 2: Create Cluster
1. Select "FREE" tier (M0)
2. Choose your preferred cloud provider (AWS, Google Cloud, or Azure)
3. Select a region close to you
4. Click "Create"

## Step 3: Set Up Database Access
1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

## Step 4: Set Up Network Access
1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP addresses
5. Click "Confirm"

## Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<dbname>` with your values

## Step 6: Create .env File
Create a `.env` file in the backend directory with:

```env
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/quickcourt?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

## Step 7: Test Connection
1. Start your backend server: `npm run dev`
2. You should see: "✅ MongoDB Atlas connected successfully!"
3. Test the health endpoint: `http://localhost:5000/health`

## Troubleshooting
- **Connection failed**: Check username, password, and network access
- **Authentication failed**: Verify database user credentials
- **Network timeout**: Check if your IP is whitelisted
- **Cluster not found**: Ensure cluster name in connection string is correct

## Security Notes
- Never commit `.env` files to version control
- Use strong passwords for database users
- Restrict network access in production
- Rotate JWT secrets regularly
