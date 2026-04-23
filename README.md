# Full Stack Authentication System (JWT + RBAC)

A complete full-stack authentication system with JWT (JSON Web Tokens) and Role-Based Access Control (RBAC) built with React, Node.js, Express, and MongoDB.

## 📋 Project Overview

This project implements a secure authentication system with the following features:

- **User Registration** with email, name, password, and role selection
- **User Login** with JWT token generation
- **Role-Based Access Control (RBAC)** with Admin and User roles
- **Protected Routes** using JWT middleware
- **Skip Login Functionality** for quick demo access
- **Responsive UI** with Bootstrap styling
- **MongoDB Integration** for data persistence
- **Password Hashing** using bcryptjs

## 🏗️ Architecture

```
auth-system/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth & role middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   └── server.js           # Express server
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # API utilities
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML template
│   └── vite.config.js      # Vite configuration
└── screenshots/            # Screenshots for submission
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd exp-8
   ```

2. **Install all dependencies using the root script** (recommended):
   ```bash
   npm run install-all
   ```
   Or install separately:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Start MongoDB**
   - Ensure MongoDB is running locally on `mongodb://localhost:27017`
   - Or update `backend/config/db.js` with your MongoDB connection string

### Running the Application

#### Option 1: Run Backend & Frontend Separately

1. **Start the backend server** (from project root):
   ```bash
   cd backend
   npm start
   ```
   Backend will run on `http://localhost:5000`

2. **Start the frontend development server** (from project root):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

#### Option 2: Run with Concurrently (Recommended)

Create a `package.json` in the root directory with scripts to run both:

```json
{
  "scripts": {
    "start": "concurrently \"npm run start-backend\" \"npm run start-frontend\"",
    "start-backend": "cd backend && npm start",
    "start-frontend": "cd frontend && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Then run:
```bash
npm install
npm start
```

## 🔐 Authentication Flow

1. **Registration**: Users can register with email, name, password, and role (user/admin)
2. **Login**: Users receive a JWT token upon successful authentication
3. **Token Storage**: JWT token stored in localStorage
4. **Protected Routes**: Dashboard accessible only with valid token
5. **Role-Based Access**:
   - **Admin**: Can view all users
   - **User**: Can view only their own profile

## 🛠️ API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | API information | Public |
| GET | `/health` | Health check (server & DB status) | Public |
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user profile | Private |
| GET | `/api/auth/users` | Get all users (admin only) | Admin |
| GET | `/api/auth/users/:id` | Get user by ID | Private |
| GET | `/api/auth/user-dashboard` | User dashboard | Private |
| GET | `/api/auth/admin-dashboard` | Admin dashboard | Admin |

## 📸 Screenshots Required

Place the following screenshots in the `/screenshots` folder:

1. **Registration Page** – User filling the form
2. **Login Page** – Successful login
3. **User Dashboard** – User-specific content
4. **Admin Dashboard** – Admin viewing all users
5. **Protected Route** – Unauthorized access blocked
6. **MongoDB Data** – Stored user data

## 🧪 Testing the Application

### Demo Accounts

The application includes demo accounts for quick testing:

- **Admin**: `admin@example.com` / `password123`
- **User**: `user@example.com` / `password123`

### Skip Login Feature

Click the "Skip Login (Use Demo Admin)" button on the login page to automatically:
1. Create a demo admin account (if not exists)
2. Login with admin credentials
3. Redirect to dashboard

### Testing Protected Routes

1. Try accessing `/dashboard` without logging in (should redirect to login)
2. Login as regular user and verify you can only see your profile
3. Login as admin and verify you can see all users

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth_system
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

### Frontend Configuration

Update API base URL in `frontend/src/utils/api.js` if needed.

## 📁 Project Structure Details

### Backend

- **`backend/server.js`** – Main Express server with CORS and middleware setup
- **`backend/config/db.js`** – MongoDB connection configuration
- **`backend/models/User.js`** – User schema with password hashing
- **`backend/controllers/authController.js`** – Authentication logic
- **`backend/middleware/authMiddleware.js`** – JWT verification middleware
- **`backend/middleware/roleMiddleware.js`** – Role-based access control
- **`backend/routes/authRoutes.js`** – All authentication routes

### Frontend

- **`frontend/src/App.jsx`** – Main application with routing
- **`frontend/src/pages/Login.jsx`** – Login page with skip login feature
- **`frontend/src/pages/Register.jsx`** – Registration page
- **`frontend/src/pages/Dashboard.jsx`** – Role-based dashboard
- **`frontend/src/components/ProtectedRoute.jsx`** – Route protection component
- **`frontend/src/utils/api.js`** – Axios instance with interceptors

## 🧠 Key Concepts Implemented

### JWT Authentication
- Token generation upon login
- Token verification middleware
- Token storage in localStorage
- Automatic token injection in API requests

### Role-Based Access Control (RBAC)
- Two roles: `admin` and `user`
- Role-based route protection
- Conditional UI rendering based on role
- Admin-only endpoints

### Security Features
- Password hashing with bcryptjs
- JWT token expiration (24 hours)
- Protected routes with middleware
- Input validation

### Frontend Features
- Responsive Bootstrap UI
- Form validation
- Error handling
- Loading states
- Dynamic navigation based on authentication state

## 🐛 Troubleshooting

### MongoDB Connection Issues
1. Ensure MongoDB is running: `mongod --version`
2. Check connection string in `backend/config/db.js`
3. Try connecting via MongoDB Compass

### CORS Errors
- Backend is configured to accept requests from `http://localhost:5173`
- Update CORS origin in `backend/server.js` if using different frontend URL

### JWT Errors
- Ensure consistent JWT_SECRET between middleware and controller
- Check token format in Authorization header

### Mongoose Middleware Errors
- If you encounter "next is not a function" error, update the User model's pre-save middleware:
  - Remove the `next` parameter and callback usage
  - Use async/await without calling `next()` (compatible with Mongoose 7+)
- Example fix in `backend/models/User.js`:
  ```javascript
  UserSchema.pre('save', async function() {
      if (!this.isModified('password')) return;
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
  });
  ```

### Server Debugging
- Use the health endpoint at `GET /health` to check server and database status
- Check server logs for detailed error messages

## 📝 Submission Requirements

1. Complete source code with all required features
2. Screenshots in `/screenshots` folder
3. Working application with all endpoints functional
4. Clean, modular, and well-documented code

## 📄 License

This project is created for educational purposes as part of a full-stack development experiment.

## 👨‍💻 Author

Full Stack Authentication System - Experiment 8
JWT + RBAC Implementation