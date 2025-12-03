# Loukify Backend API

A comprehensive Express.js backend with Supabase integration featuring authorization, file storage, and real-time updates.

## 🚀 Features

- **Role-based Authorization** (admin, seller, customer)
- **File Storage** for product images using Supabase Storage
- **Real-time Updates** using Supabase Realtime
- **ES Modules** with modern JavaScript syntax
- **Comprehensive Error Handling**
- **Postman-ready API endpoints**

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **Supabase Account** with a project created
3. **Postman** (for API testing)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   PORT=3000
   NODE_ENV=development
   ```

### 3. Supabase Setup

#### Create Required Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create profiles table for user roles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'seller', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table for realtime testing
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table for realtime testing
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your use case)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
```

#### Create Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `product-images`
3. Set it to public if you want public access to images

### 4. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 🧪 API Testing with Postman

### Authentication Setup

Before testing protected endpoints, you need to obtain a JWT token:

1. **Create a user** in Supabase Auth (or use existing user)
2. **Get the JWT token** from the user's session
3. **Add the token** to your Postman requests in the Authorization header:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN_HERE
   ```

### Test Endpoints

#### 1. Health Check
- **Method:** GET
- **URL:** `http://localhost:3000/health`
- **Headers:** None required
- **Expected Response:** Server status and timestamp

#### 2. File Storage Endpoints

##### Upload Image
- **Method:** POST
- **URL:** `http://localhost:3000/api/storage/upload-image`
- **Headers:** 
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Body:** form-data
  - Key: `image`, Type: File, Value: Select an image file
- **Expected Response:** Upload success with public URL

##### List Images
- **Method:** GET
- **URL:** `http://localhost:3000/api/storage/images`
- **Headers:** 
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Expected Response:** List of all uploaded images

##### Delete Image
- **Method:** DELETE
- **URL:** `http://localhost:3000/api/storage/images/FILENAME`
- **Headers:** 
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Expected Response:** Deletion confirmation

#### 3. Real-time Endpoints

##### Test Realtime Connection
- **Method:** GET
- **URL:** `http://localhost:3000/api/realtime/realtime-test`
- **Headers:** 
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Expected Response:** Subscription started confirmation
- **Note:** Check server console for real-time updates

##### Trigger Test Update
- **Method:** POST
- **URL:** `http://localhost:3000/api/realtime/trigger-test-update`
- **Headers:** 
  - `Authorization: Bearer YOUR_JWT_TOKEN`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "table": "orders",
    "data": {
      "user_id": "your-user-id",
      "status": "processing",
      "total_amount": 99.99
    }
  }
  ```

##### Check Realtime Status
- **Method:** GET
- **URL:** `http://localhost:3000/api/realtime/realtime-status`
- **Headers:** 
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Expected Response:** Connection status

#### 4. Protected Routes (Role-based)

##### Test Authentication
- **Method:** GET
- **URL:** `http://localhost:3000/api/protected/test-auth`
- **Headers:** 
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Expected Response:** User information and authentication status

##### Admin Only
- **Method:** GET
- **URL:** `http://localhost:3000/api/protected/admin-only`
- **Headers:** 
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Expected Response:** Admin access granted (requires admin role)

##### Seller Only
- **Method:** GET
- **URL:** `http://localhost:3000/api/protected/seller-only`
- **Headers:** 
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Expected Response:** Seller access granted (requires seller or admin role)

##### Customer Only
- **Method:** GET
- **URL:** `http://localhost:3000/api/protected/customer-only`
- **Headers:** 
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Expected Response:** Customer access granted (requires any role)

##### Get Profile
- **Method:** GET
- **URL:** `http://localhost:3000/api/protected/profile`
- **Headers:** 
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Expected Response:** User profile with role and permissions

## 🔄 How Realtime Works

### Understanding Supabase Realtime

1. **PostgreSQL Changes:** Realtime listens to changes in your PostgreSQL database
2. **WebSocket Connection:** Establishes a WebSocket connection to Supabase
3. **Event Broadcasting:** Broadcasts changes to subscribed clients in real-time
4. **Filtered Updates:** You can filter updates by table, operation type, and conditions

### Verifying Realtime in Supabase

1. **Dashboard Monitoring:**
   - Go to your Supabase dashboard
   - Navigate to "Realtime" section
   - You'll see active connections and message counts

2. **Database Changes:**
   - Make changes to `orders` or `inventory` tables
   - Watch the realtime logs in your server console
   - Changes should appear immediately

3. **Testing Steps:**
   ```bash
   # 1. Start realtime subscription
   GET /api/realtime/realtime-test
   
   # 2. In another request, trigger an update
   POST /api/realtime/trigger-test-update
   
   # 3. Check server console for realtime events
   ```

### Realtime Event Types

- **INSERT:** New records added
- **UPDATE:** Existing records modified
- **DELETE:** Records removed

## 🛡️ Authorization System

### Role Hierarchy

1. **Admin:** Full access to all endpoints
2. **Seller:** Access to seller and customer endpoints
3. **Customer:** Access to customer endpoints only

### Permission Matrix

| Endpoint | Admin | Seller | Customer |
|----------|-------|--------|----------|
| `/admin-only` | ✅ | ❌ | ❌ |
| `/seller-only` | ✅ | ✅ | ❌ |
| `/customer-only` | ✅ | ✅ | ✅ |
| `/upload-image` | ✅ | ✅ | ❌ |
| `/images` | ✅ | ✅ | ✅ |

## 🐛 Troubleshooting

### Common Issues

1. **"Missing required Supabase environment variables"**
   - Check your `.env` file has all required variables
   - Ensure no typos in variable names

2. **"Invalid token" errors**
   - Verify your JWT token is valid and not expired
   - Check token format: `Bearer YOUR_TOKEN`

3. **"Upload failed" errors**
   - Ensure the `product-images` bucket exists in Supabase Storage
   - Check file size (5MB limit)
   - Verify file is an image type

4. **Realtime not working**
   - Check if tables are added to realtime publication
   - Verify RLS policies allow access
   - Check Supabase dashboard for connection status

### Debug Mode

Set `NODE_ENV=development` in your `.env` file to see detailed error messages.

## 📁 Project Structure

```
loukify-backend/
├── config/
│   └── supabase.js          # Supabase client configuration
├── middleware/
│   └── auth.js              # Authentication and authorization middleware
├── routes/
│   ├── storage.js           # File storage endpoints
│   ├── realtime.js          # Real-time functionality
│   └── protected.js         # Role-based protected routes
├── server.js                # Main server file
├── package.json             # Dependencies and scripts
├── env.example              # Environment variables template
└── README.md                # This documentation
```

## 🚀 Next Steps

1. **Add more endpoints** for your specific use case
2. **Implement data validation** using libraries like Joi or Yup
3. **Add rate limiting** for API protection
4. **Set up logging** with Winston or similar
5. **Add unit tests** with Jest or Mocha
6. **Deploy to production** using services like Railway, Heroku, or Vercel

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check server console for detailed error messages
