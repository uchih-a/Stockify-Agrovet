# 🌿 AgroVet Inventory System — Backend API

A comprehensive REST API for managing agricultural veterinary inventory, sales, and farmer engagement in Kenya. Built with Node.js, Express, MongoDB, Mongoose, Google Gemini 1.5 Pro AI, and Cloudinary.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 20 LTS | JavaScript runtime |
| **Express.js** | 5.0+ | Web framework |
| **MongoDB Atlas** | Latest | NoSQL database |
| **Mongoose** | 8.0+ | ODM (Object Data Modeling) |
| **Google Gemini** | 1.5 Pro | AI chatbot for agricultural advice |
| **JWT** | 9.0+ | Authentication & authorization |
| **Cloudinary** | 2.2+ | Image storage & CDN |
| **Nodemailer** | 6.9+ | Email delivery |
| **Winston** | 3.13+ | Logging |
| **node-cron** | 3.0+ | Scheduled tasks |

---

## Prerequisites

- **Node.js** v20 or higher
- **MongoDB Atlas** account (free tier available)
- **Google AI Studio** account (for Gemini API key)
- **Cloudinary** account (for image management)
- **Gmail account** with App Password enabled (for email alerts)

---

## Installation & Setup — Step by Step

### Step 1: Clone and Navigate

```bash
git clone <your-repo-url>
cd agrovet-server
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including Express, Mongoose, Gemini SDK, Cloudinary, and others.

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials. See detailed instructions below for each variable group.

### Step 4: Get Your Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **"Get API key"** → **"Create API key in new project"**
4. Copy the key and paste into `.env` as `GEMINI_API_KEY`

### Step 5: Set up MongoDB Atlas

1. Go to [MongoDB Cloud](https://cloud.mongodb.com)
2. Create a free **M0 Sandbox** cluster
3. Create a database user:
   - Click **Security** → **Database Access**
   - Add a user with a secure password
4. Whitelist your IP (use **0.0.0.0/0** for development):
   - Click **Security** → **Network Access**
5. Get your connection string:
   - Click **Overview** → **Connect** → **Drivers**
   - Select **Node.js** and copy the URI
6. Replace `<username>` and `<password>` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/agrovetdb
   ```

### Step 6: Set up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com) and create a free account
2. On your **Dashboard**, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Paste these into `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Step 7: Set up Gmail App Password

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Search for **"App passwords"**
4. Select **"Mail"** → **"Windows Computer"** (or your OS)
5. Copy the 16-character password
6. Paste into `.env` as `EMAIL_PASS`

### Step 8: Generate JWT Secrets

Generate two random 64-character hex strings for JWT signing:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this twice and paste the outputs into `.env`:
```
JWT_SECRET=<first_output>
JWT_REFRESH_SECRET=<second_output>
```

### Step 9: Seed the Database

Populate the database with test data (users, products, suppliers, transactions):

```bash
node scripts/seed.js
```

This creates:
- 5 users (1 admin, 1 staff, 3 farmers)
- 3 suppliers
- 10 products with varying stock levels
- 4 sample transactions

### Step 10: Start the Server

**Development (with hot reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Expected output:

```
✅ MongoDB connected: cluster0.xxxxx.mongodb.net
✅ Server running on http://localhost:5000 in development mode
✅ Stock alert job scheduled: 0 7 * * *
```

---

## Default Login Credentials (After Seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@agrovet.co.ke | Admin@1234 |
| Staff | staff@agrovet.co.ke | Staff@1234 |
| Farmer #1 | farmer1@gmail.com | Farmer@1234 |
| Farmer #2 | farmer2@gmail.com | Farmer@1234 |
| Farmer #3 | farmer3@gmail.com | Farmer@1234 |

---

## Testing the API

### 1. Health Check

```bash
curl http://localhost:5000/api/v1/health
```

Expected: `{"success":true,"message":"API is healthy",...}`

### 2. Register a New User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "password":"SecurePass@123",
    "phone":"+254712345678"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@agrovet.co.ke",
    "password":"Admin@1234"
  }'
```

Copy the returned `accessToken` for authenticated requests.

### 4. Get All Products (Authenticated)

```bash
curl -X GET http://localhost:5000/api/v1/products \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### 5. Chat with AgroBot

```bash
curl -X POST http://localhost:5000/api/v1/chat \
  -H "Authorization: Bearer <YOUR_FARMER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "message":"My maize leaves have white streaks. What could be wrong?"
  }'
```

---

## API Endpoints Reference

### Authentication
| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/auth/register` | ❌ | Public | Register new user |
| POST | `/auth/login` | ❌ | Public | Login |
| POST | `/auth/logout` | ✅ | Any | Logout |
| POST | `/auth/refresh-token` | ❌ | Public | Refresh access token |
| POST | `/auth/forgot-password` | ❌ | Public | Send reset email |
| PUT | `/auth/reset-password/:token` | ❌ | Public | Reset password |
| GET | `/auth/me` | ✅ | Any | Get current user |

### Users
| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/users` | ✅ | Admin/Staff | List all users |
| GET | `/users/:id` | ✅ | Admin/Staff | Get user |
| POST | `/users` | ✅ | Admin/Staff | Create user |
| PUT | `/users/:id` | ✅ | Admin/Staff | Update user |
| DELETE | `/users/:id` | ✅ | Admin | Delete user |
| POST | `/users/:id/profile-pic` | ✅ | Any | Upload profile pic |
| GET | `/users/:id/stats` | ✅ | Admin/Staff | Get farmer stats |

### Products
| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/products` | ✅ | Any | List products |
| GET | `/products/low-stock` | ✅ | Admin/Staff | Low-stock products |
| GET | `/products/expiring` | ✅ | Admin/Staff | Expiring products |
| GET | `/products/:id` | ✅ | Any | Get product |
| POST | `/products` | ✅ | Admin/Staff | Create product |
| PUT | `/products/:id` | ✅ | Admin/Staff | Update product |
| DELETE | `/products/:id` | ✅ | Admin | Delete product |
| POST | `/products/:id/images` | ✅ | Admin/Staff | Upload images (up to 5) |

### Transactions
| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/transactions` | ✅ | Admin/Staff | List all transactions |
| GET | `/transactions/my` | ✅ | Any | My transactions |
| GET | `/transactions/:id` | ✅ | Any | Get transaction |
| POST | `/transactions` | ✅ | Admin/Staff | Create transaction |

### Chat
| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/chat` | ✅ | Any | Send message to AgroBot |
| GET | `/chat/history` | ✅ | Any | Chat history |
| GET | `/chat/session/:id` | ✅ | Any | Get session messages |
| POST | `/chat/rate/:id` | ✅ | Any | Rate message |
| POST | `/chat/bookmark/:id` | ✅ | Any | Bookmark message |
| DELETE | `/chat/session/:id` | ✅ | Any | Delete session |

### Alerts
| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/alerts` | ✅ | Admin/Staff | List alerts |
| GET | `/alerts/:id` | ✅ | Admin/Staff | Get alert |
| PUT | `/alerts/mark-read` | ✅ | Admin/Staff | Mark as read |
| PUT | `/alerts/:id/resolve` | ✅ | Admin/Staff | Resolve alert |
| DELETE | `/alerts/:id` | ✅ | Admin | Delete alert |

### Reports
| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/reports/sales` | ✅ | Admin/Staff | Sales summary |
| GET | `/reports/inventory` | ✅ | Admin/Staff | Inventory snapshot |
| GET | `/reports/farmers` | ✅ | Admin/Staff | Farmer activity |
| GET | `/reports/chatbot` | ✅ | Admin/Staff | Chatbot stats |
| GET | `/reports/insights` | ✅ | Admin | AI-generated insights |

---

## Common Errors & Troubleshooting

| Error | Likely Cause | Fix |
|---|---|---|
| `MongooseServerSelectionError` | MongoDB connection failed | Check `MONGODB_URI` and whitelist your IP in MongoDB Atlas |
| `GEMINI_API_KEY is undefined` | Missing API key | Run seed script or restart server |
| `401 Unauthorized` | Invalid/expired token | Login again and use new token |
| `413 Payload Too Large` | File upload exceeds 5MB | Ensure file is under 5MB |
| `ENOTFOUND localhost:5000` | Server not running | Run `npm run dev` |
| `Email not sent` | Gmail app password incorrect | Regenerate app password and update `.env` |

---

## Deployment — Render.com

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial server setup"
git push origin main
```

### 2. Create Render Account & App

1. Go to [Render.com](https://render.com)
2. Sign in with GitHub
3. Click **New** → **Web Service**
4. Select your repository and branch
5. Configure:
   - **Name:** agrovet-server
   - **Runtime:** Node
   - **Build:** `npm install`
   - **Start:** `npm start`
   - **Region:** Closest to Kenya (e.g., Frankfurt, EU)

### 3. Set Environment Variables in Render Dashboard

Copy each variable from your local `.env`:
- `NODE_ENV=production`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- (All other variables from `.env`)

### 4. Deploy

Click **Deploy** and wait for the build to complete. Your API will be available at:
```
https://agrovet-server.onrender.com/api/v1/health
```

---

## Features

✅ **Complete Inventory Management**
- Product CRUD with stock tracking
- SKU uniqueness
- Batch numbers and expiry dates
- Low-stock and expiry alerts

✅ **Role-Based Access Control (RBAC)**
- Admin: Full system access
- Staff: Inventory and transaction management
- Farmer: View products and chat

✅ **AI-Powered Chatbot (AgroBot)**
- Powered by Google Gemini 1.5 Pro
- Specialized agricultural advice for Kenya
- Session-based conversation history
- Rating and bookmarking

✅ **Automated Alerts**
- Low-stock detection
- Expiry warning notifications
- Nightly cron job (configurable)

✅ **Analytics & Reporting**
- Sales summaries
- Inventory snapshots
- Farmer activity tracking
- Chatbot usage stats

✅ **Image Management**
- Cloudinary integration
- Product images with CDN delivery
- Auto-optimization

✅ **Security**
- JWT authentication
- Password hashing with bcryptjs
- CORS enabled
- HTTP headers with Helmet
- Rate limiting

---

## Development Guide

### Adding a New Controller

1. Create function in `/controllers/myFeature.js`
2. Wrap with `asyncHandler()`
3. Use `ApiResponse` for responses
4. Import and use in `/routes/myFeatureRoutes.js`

### Adding a New Model

1. Create schema in `/models/MyModel.js`
2. Add `mongoose-paginate-v2` plugin
3. Add indexes for performance
4. Use in controllers

### Adding a New Route

1. Create in `/routes/myRoutes.js`
2. Import controller functions
3. Chain middleware: `protect`, `authorise()`
4. Mount in `app.js`

---

## Environment Variables Explained

```bash
# Server configuration
NODE_ENV=development                    # development|production
PORT=5000                              # Server listen port
CLIENT_URL=http://localhost:5173       # Frontend origin for CORS

# MongoDB connection
MONGODB_URI=mongodb+srv://...          # Atlas connection string

# JWT tokens
JWT_SECRET=...                          # 64-char hex from openssl
JWT_EXPIRES_IN=15m                     # Access token lifetime
JWT_REFRESH_SECRET=...                 # Another 64-char hex
JWT_REFRESH_EXPIRES_IN=7d              # Refresh token lifetime

# Gemini AI
GEMINI_API_KEY=...                     # From aistudio.google.com
GEMINI_MODEL=gemini-1.5-pro           # Model version

# Cloudinary  
CLOUDINARY_CLOUD_NAME=...              # From cloudinary.com
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com              # Gmail SMTP server
EMAIL_PORT=587                          # TLS port
EMAIL_USER=your-email@gmail.com       # Your Gmail
EMAIL_PASS=xxxx xxxx xxxx xxxx        # 16-char app password
EMAIL_FROM=AgroVet <noreply@...>      # Sender display name

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000            # 15 minutes
RATE_LIMIT_MAX=100                     # Max requests per window

# Chat limits
CHAT_MESSAGES_PER_DAY_FARMER=20        # Farmer daily limit
CHAT_MESSAGES_PER_DAY_ADMIN=100       # Admin daily limit

# Alert scheduling
STOCK_ALERT_CRON_SCHEDULE=0 7 * * *   # Daily at 7 AM
EXPIRY_ALERT_DAYS_BEFORE=30           # Alert 30 days before expiry
```

---

## License

ISC

---

## Author

AgroVet Development Team

---

## Support

For issues or questions:
1. Check the **Troubleshooting** section above
2. Review logs in `/logs/` directory
3. Consult MongoDB and Gemini documentation
4. Open an issue on GitHub

---

**Last Updated:** April 2026  
**Version:** 1.0.0
