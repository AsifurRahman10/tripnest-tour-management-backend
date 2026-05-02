# TripNest Travel Management System Backend

A robust Node.js backend API for managing tours, bookings, payments, and user applications in a comprehensive travel management platform.

## Features

- **User Management** - Registration, authentication, and profile management
- **Tour Management** - Create, update, and manage tour packages with divisions/locations
- **Booking System** - Complete booking workflow with status tracking
- **Payment Processing** - SSLCommerz integration for secure payments
- **Authentication** - JWT-based auth with refresh tokens and Google OAuth
- **Guide Applications** - Manage guide application submissions and approvals
- **OTP Verification** - Email-based OTP for secure verification
- **Analytics & Stats** - Track bookings, revenue, and platform statistics
- **File Uploads** - Cloudinary integration for image and file management
- **Email Notifications** - Automated email sending via SMTP with EJS templates
- **Session Management** - Redis-based session storage for scalability

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Passport.js (Local & Google OAuth)
- **Caching:** Redis
- **File Storage:** Cloudinary
- **Payment Gateway:** SSLCommerz
- **Email:** Nodemailer
- **Validation:** Zod
- **PDF Generation:** PDFKit

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tripnest-tour-management-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build the project**

   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URL=mongodb://username:password@host:port/database

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRE=30d

# Bcrypt
BCRYPT_SALT_ROUND=10

# Super Admin
SUPER_ADMIN_EMAIL=admin@tripnest.com
SUPER_ADMIN_PASSWORD=securepassword

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

# SSLCommerz Payment
STORE_ID=your_store_id
STORE_PASS=your_store_password
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSL_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
SSL_BACKEND_SUCCESS_URL=http://localhost:3000/api/v1/payment/success
SSL_BACKEND_FAIL_URL=http://localhost:3000/api/v1/payment/fail
SSL_BACKEND_CANCEL_URL=http://localhost:3000/api/v1/payment/cancel
SSL_IPN_URL=http://localhost:3000/api/v1/payment/ipn

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Redis
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_HOST=localhost
REDIS_PORT=6379
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh JWT token
- `GET /api/v1/auth/google` - Google OAuth login
- `POST /api/v1/auth/logout` - Logout user

### Users

- `GET /api/v1/user` - Get all users
- `GET /api/v1/user/:id` - Get user by ID
- `PATCH /api/v1/user/:id` - Update user profile
- `DELETE /api/v1/user/:id` - Delete user

### Tours

- `GET /api/v1/tour` - List all tours
- `POST /api/v1/tour` - Create new tour
- `GET /api/v1/tour/:id` - Get tour details
- `PATCH /api/v1/tour/:id` - Update tour
- `DELETE /api/v1/tour/:id` - Delete tour

### Bookings

- `GET /api/v1/booking` - List all bookings
- `POST /api/v1/booking` - Create booking
- `GET /api/v1/booking/:id` - Get booking details
- `PATCH /api/v1/booking/:id` - Update booking status

### Payments

- `POST /api/v1/payment/init` - Initialize payment
- `POST /api/v1/payment/success` - Payment success callback
- `POST /api/v1/payment/fail` - Payment failure callback

### Guide Applications

- `GET /api/v1/guide` - List guide applications
- `POST /api/v1/guide` - Submit guide application
- `PATCH /api/v1/guide/:id/approve` - Approve application
- `PATCH /api/v1/guide/:id/reject` - Reject application

### OTP

- `POST /api/v1/otp/send` - Send OTP
- `POST /api/v1/otp/verify` - Verify OTP

### Stats

- `GET /api/v1/stats/dashboard` - Get dashboard statistics

## Scripts

| Command         | Description                               |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start development server with auto-reload |
| `npm start`     | Start production server                   |
| `npm run build` | Compile TypeScript to JavaScript          |
| `npm run lint`  | Run ESLint to check code quality          |
| `npm test`      | Run tests (if configured)                 |

## License

ISC
