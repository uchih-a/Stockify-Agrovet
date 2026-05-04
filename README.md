# 🌿 AgroVet — Agricultural Inventory Management System

A full-stack agricultural inventory management platform designed for Kenyan agrovet businesses. AgroVet enables farmers to purchase veterinary products and supplies while allowing agrovet shop owners to manage inventory, track sales, and provide AI-powered agricultural guidance.

**Status**: ✅ Production-Ready  
**License**: ISC  
**Author**: AgroVet Development Team

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

AgroVet is a comprehensive inventory management system that bridges the gap between agricultural veterinary product suppliers and farmers in Kenya. The platform provides:

- **For Agrovet Shop Owners**: Real-time inventory tracking, sales management, supplier relationships, AI-powered stock alerts, and business analytics.
- **For Farmers**: An intuitive marketplace to purchase products, track orders, manage transactions, and access agricultural guidance through an AI chatbot.
- **For Both**: Secure authentication, role-based access control, and responsive design for both mobile and desktop.

---

## ✨ Key Features

### Admin/Shop Owner Features
- 📊 **Dashboard** — Real-time sales analytics, revenue tracking, and inventory overview
- 📦 **Inventory Management** — Add, edit, delete, and monitor products with stock levels
- 🚨 **Stock Alerts** — Automated notifications when inventory falls below thresholds
- 👥 **User Management** — Manage farmer accounts and access permissions
- 📝 **Transaction History** — Detailed records of all sales and purchases
- 📈 **Advanced Reports** — Sales trends, product performance, farmer activity
- 🤖 **AI Chatbot** — Powered by Google Gemini for agricultural advice
- 💳 **Payment Management** — Stripe integration for secure transactions
- 🏪 **Supplier Management** — Track supplier information and communication

### Farmer Features
- 🏪 **Shop Interface** — Browse and purchase available products
- 🛒 **Shopping Cart** — Add items and complete purchases securely
- 📦 **Order Tracking** — View order status and delivery information
- 💰 **Transaction History** — Complete purchase records and invoices
- 👤 **Profile Management** — Update personal information and preferences
- 🤖 **AI Guidance** — Get agricultural advice from the AgroBot chatbot
- 📊 **Activity Dashboard** — View purchase history and spending patterns

### Security & Performance
- 🔐 **JWT Authentication** — Secure token-based user sessions
- 🛡️ **Rate Limiting** — API protection against abuse
- 📧 **Email Alerts** — Stock alerts via Nodemailer
- ⚡ **Optimized Performance** — Compression, caching, and efficient queries
- 🔒 **Role-Based Access Control** — Granular permission management

---

## 🏗️ Architecture

AgroVet follows a **full-stack monorepo structure** with separate client and server applications:

```
agrovet/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
└── README.md        # This file
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│  ├─ Pages (Home, Auth, Admin, Farmer Dashboards)      │
│  ├─ Components (Charts, Forms, Chat UI)               │
│  ├─ Hooks (useAuth, useProducts, useChat, etc.)       │
│  ├─ Store (Zustand - Auth, Cart, Alerts)             │
│  └─ API Layer (Axios + React Query)                   │
└─────────────────────────────────────────────────────────┘
                           ↕ (HTTP/REST)
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js)                  │
│  ├─ Routes (Auth, Products, Transactions, etc.)        │
│  ├─ Controllers (Business Logic)                       │
│  ├─ Models (MongoDB - User, Product, Transaction)      │
│  ├─ Middleware (Auth, Error Handling, Rate Limit)      │
│  ├─ Services (Chat, Reports, Alerts)                  │
│  └─ Jobs (Stock Alert Scheduler)                       │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                          │
│  ├─ MongoDB Atlas (Database)                           │
│  ├─ Google Gemini (AI Chatbot)                         │
│  ├─ Cloudinary (Image Storage)                         │
│  ├─ Stripe (Payments)                                  │
│  └─ Gmail/Nodemailer (Email Alerts)                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | UI framework |
| **Vite** | 5.3 | Build tool & dev server |
| **React Router** | 6.24 | Client-side routing |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **Zustand** | 4.5 | Global state management |
| **React Query** | 5.40 | Server state management |
| **React Hook Form** | 7.52 | Form handling |
| **Zod** | 3.23 | Schema validation |
| **Axios** | 1.7 | HTTP client |
| **Recharts** | 2.12 | Data visualization |
| **Framer Motion** | 11.2 | Animations |
| **GSAP** | 3.12 | Advanced animations |
| **Lucide React** | 0.395 | Icon library |
| **Google Generative AI** | 0.24 | AI integration |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20 LTS | JavaScript runtime |
| **Express.js** | 5.0 | Web framework |
| **MongoDB Atlas** | Latest | NoSQL database |
| **Mongoose** | 8.0 | ODM (Object Data Modeling) |
| **JWT** | 9.0 | Authentication |
| **Bcryptjs** | 2.4 | Password hashing |
| **Google Gemini** | 1.5 Pro | AI chatbot |
| **Cloudinary** | 1.41 | Image storage & CDN |
| **Stripe** | 22.0 | Payment processing |
| **Nodemailer** | 6.9 | Email delivery |
| **Winston** | 3.13 | Logging |
| **node-cron** | 3.0 | Scheduled tasks |
| **Helmet** | 7.1 | Security headers |
| **Multer** | 1.4 | File uploads |
| **Express Validator** | 7.1 | Input validation |

---

## 📋 Prerequisites

### System Requirements
- **Node.js** v20 or higher
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

### External Services (Free Tier Available)
1. **MongoDB Atlas** — Database
   - Sign up: https://www.mongodb.com/cloud/atlas
   - Create a cluster and connection string

2. **Google AI Studio** — For Gemini API
   - Sign up: https://aistudio.google.com
   - Get your API key from https://aistudio.google.com/app/apikey

3. **Cloudinary** — For image uploads
   - Sign up: https://cloudinary.com
   - Get your API credentials from the dashboard

4. **Stripe** — For payments (Optional for development)
   - Sign up: https://stripe.com
   - Get your API keys from the dashboard

5. **Gmail Account** — For email alerts
   - Enable 2-factor authentication
   - Generate an App Password (https://myaccount.google.com/apppasswords)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/agrovet/agrovet.git
cd agrovet
```

### 2. Install Dependencies

#### Frontend
```bash
cd client
npm install
cd ..
```

#### Backend
```bash
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

#### Backend Setup (`.env` in `/server`)

Create a `.env` file in the `/server` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrovet?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_EXPIRE=7d

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_app_password_here
ADMIN_EMAIL=admin@agrovet.com

# Logging
LOG_LEVEL=info

# Stock Alert Job
STOCK_ALERT_CRON_SCHEDULE=0 8 * * *
STOCK_THRESHOLD=10
```

#### Frontend Setup (`.env.local` in `/client`)

Create a `.env.local` file in the `/client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_GOOGLE_AI_API_KEY=your_gemini_api_key_here
```

---

## 🚀 Getting Started

### Terminal 1: Start the Backend Server

```bash
cd server
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
✅ Server running on http://localhost:5000 in development mode
✅ Stock alert job scheduled: 0 8 * * *
```

### Terminal 2: Start the Frontend Development Server

```bash
cd client
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Access the Application

- **Frontend**: http://localhost:5173/
- **API Health Check**: http://localhost:5000/api/v1/health
- **API Documentation**: Refer to routes in `/server/routes/`

### Seed the Database (Optional)

To populate the database with sample data:

```bash
cd server
npm run seed
```

---

## 📁 Project Structure

### Frontend Structure (`/client`)
```
client/
├── src/
│   ├── pages/              # Page components
│   │   ├── admin/         # Admin dashboard pages
│   │   ├── farmer/        # Farmer dashboard pages
│   │   └── auth/          # Authentication pages
│   ├── components/        # Reusable React components
│   │   ├── charts/        # Data visualization
│   │   ├── chat/          # Chat UI components
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout wrappers
│   │   └── ui/            # UI primitives
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand state management
│   ├── api/               # API client functions
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── router.jsx         # Route definitions
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

### Backend Structure (`/server`)
```
server/
├── routes/                # API route definitions
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── transactionRoutes.js
│   ├── chatRoutes.js
│   ├── alertRoutes.js
│   ├── supplierRoutes.js
│   ├── reportRoutes.js
│   └── paymentRoutes.js
├── controllers/           # Request handlers
├── models/                # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   ├── Transaction.js
│   ├── Supplier.js
│   ├── Alert.js
│   └── ChatMessage.js
├── middleware/            # Express middleware
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── errorMiddleware.js
│   └── rateLimiter.js
├── services/              # Business logic
│   ├── chatService.js
│   ├── reportService.js
│   ├── alertService.js
│   └── cloudinaryService.js
├── jobs/                  # Scheduled tasks
│   └── stockAlertJob.js
├── config/                # Configuration files
│   ├── db.js
│   └── gemini.js
├── utils/                 # Utility functions
├── scripts/               # Utility scripts
│   └── seed.js
├── app.js                 # Express app setup
├── server.js              # Server entry point
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/register      # Register new user
POST   /api/v1/auth/login         # Login user
POST   /api/v1/auth/logout        # Logout user
POST   /api/v1/auth/refresh       # Refresh JWT token
GET    /api/v1/auth/me            # Get current user
POST   /api/v1/auth/forgot-password  # Initiate password reset
```

### Products
```
GET    /api/v1/products           # List all products
POST   /api/v1/products           # Create product (admin only)
GET    /api/v1/products/:id       # Get product details
PUT    /api/v1/products/:id       # Update product (admin only)
DELETE /api/v1/products/:id       # Delete product (admin only)
GET    /api/v1/products/search    # Search products
```

### Transactions
```
GET    /api/v1/transactions       # List transactions
POST   /api/v1/transactions       # Create transaction
GET    /api/v1/transactions/:id   # Get transaction details
PUT    /api/v1/transactions/:id   # Update transaction
DELETE /api/v1/transactions/:id   # Delete transaction
```

### Chat
```
POST   /api/v1/chat/send          # Send chat message
GET    /api/v1/chat/history       # Get chat history
POST   /api/v1/chat/upload        # Upload attachment
```

### Alerts
```
GET    /api/v1/alerts             # List alerts
POST   /api/v1/alerts             # Create alert
PUT    /api/v1/alerts/:id         # Update alert
DELETE /api/v1/alerts/:id         # Delete alert
```

### Suppliers
```
GET    /api/v1/suppliers          # List suppliers
POST   /api/v1/suppliers          # Create supplier
GET    /api/v1/suppliers/:id      # Get supplier details
PUT    /api/v1/suppliers/:id      # Update supplier
DELETE /api/v1/suppliers/:id      # Delete supplier
```

### Reports
```
GET    /api/v1/reports/sales      # Sales report
GET    /api/v1/reports/inventory  # Inventory report
GET    /api/v1/reports/farmer-activity  # Farmer activity report
```

### Payments
```
POST   /api/v1/payments/create-intent     # Create payment intent
POST   /api/v1/payments/confirm           # Confirm payment
POST   /api/v1/payments/webhook           # Stripe webhook
```

### Users
```
GET    /api/v1/users              # List users (admin only)
GET    /api/v1/users/:id          # Get user details
PUT    /api/v1/users/:id          # Update user
DELETE /api/v1/users/:id          # Delete user (admin only)
```

For detailed API documentation, refer to individual route files in `/server/routes/`.

---

## ⚙️ Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development`, `production` |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT signing | `your_secret_key_32_chars_min` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `CLOUDINARY_NAME` | Cloudinary account name | `your_account` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc123def456` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `EMAIL_USER` | Gmail address for alerts | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Gmail app password | `xxxx xxxx xxxx xxxx` |
| `ADMIN_EMAIL` | Admin email address | `admin@agrovet.com` |
| `STOCK_THRESHOLD` | Min stock level for alerts | `10` |
| `STOCK_ALERT_CRON_SCHEDULE` | Cron schedule for alerts | `0 8 * * *` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` |
| `VITE_GOOGLE_AI_API_KEY` | Google Gemini API key | `AIzaSy...` |

---

## 💻 Development

### Running Linters

#### Frontend
```bash
cd client
npm run lint
```

#### Backend
```bash
cd server
npm run lint
```

### Building for Production

#### Frontend
```bash
cd client
npm run build
npm run preview  # Preview production build locally
```

#### Backend
No build step required. Install dependencies and run.

### Testing

#### Backend (when configured)
```bash
cd server
npm test
```

### Database Seeding

To populate the database with sample data for development:

```bash
cd server
npm run seed
```

This creates sample users, products, suppliers, and transactions.

---

## 🚀 Deployment

### Deployment Checklist

- [ ] All environment variables configured in hosting provider
- [ ] MongoDB Atlas cluster created and accessible
- [ ] Cloudinary account configured
- [ ] Google Gemini API key added
- [ ] Stripe keys configured (for production environment)
- [ ] Frontend build optimized and minified
- [ ] Backend dependencies installed in production mode
- [ ] Error logging configured (Winston)
- [ ] Rate limiting enabled
- [ ] CORS properly configured for your domain

### Frontend Deployment (Vercel, Netlify, etc.)

```bash
cd client
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Heroku, Railway, Render, etc.)

```bash
cd server
npm install
npm start
```

Set all environment variables in your hosting provider's dashboard.

---

## 🤝 Contributing

We welcome contributions! To contribute to AgroVet:

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Write clear commit messages
   - Test your changes thoroughly

3. **Commit and push**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Ensure all tests pass

### Code Style Guidelines

- **Frontend**: Follow ESLint configuration in `/client/eslint.config.js`
- **Backend**: Follow ESLint configuration in `/server`
- **Naming**: Use camelCase for variables/functions, PascalCase for components/classes
- **Comments**: Document complex logic and business rules
- **Commits**: Use clear, descriptive commit messages

### Reporting Issues

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, etc.)

---

## 📚 Additional Resources

### Documentation
- [Frontend README](./client/README.md)
- [Backend README](./server/README.md)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)

### External Services
- [Google Gemini API](https://ai.google.dev)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Nodemailer Guide](https://nodemailer.com)

### Tools & Libraries
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

---

## 📝 License

This project is licensed under the **ISC License**. See the LICENSE file for details.

---

## 👥 Team

**AgroVet Development Team**

For questions or support, please reach out to the development team or create an issue on the repository.

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Ensure MongoDB Atlas connection string is correct in `.env`

**Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
Solution: Change PORT in `.env` or kill the process using port 5000

**CORS Error**
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
Solution: Ensure `CLIENT_URL` in `.env` matches your frontend URL

**Gemini API Key Invalid**
```
Error: API key not valid
```
Solution: Verify API key in Google AI Studio and update `.env`

**Cloudinary Upload Fails**
```
Error: Invalid Cloudinary credentials
```
Solution: Verify Cloudinary credentials in `.env`

For more troubleshooting, check the individual README files in `/client` and `/server`.

---

**Last Updated**: May 2026  
**Version**: 1.0.0
