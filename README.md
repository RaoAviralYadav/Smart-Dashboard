# Smart Leads Dashboard - MERN Full Stack Application

A professional, production-ready Lead Management System built with the MERN stack (MongoDB, Express.js, React, Node.js) using TypeScript, featuring JWT authentication, role-based access control, advanced filtering, pagination, and CSV export.

## Features

### Core Features
- ✅ **JWT-Based Authentication** - Secure user registration and login with password hashing (bcryptjs)
- ✅ **Lead Management (CRUD)** - Create, read, update, and delete leads with validation
- ✅ **Advanced Filtering & Search** - Filter by status and source, search by name/email, multiple filters work together
- ✅ **Pagination** - Backend pagination with 10 records per page and pagination metadata
- ✅ **Responsive UI** - Mobile-first design with TailwindCSS
- ✅ **Loading & Error States** - Professional loading indicators and error handling
- ✅ **Debounced Search** - Optimized search with debouncing to reduce API calls
- ✅ **CSV Export** - Export filtered leads as CSV file
- ✅ **Role-Based Access Control** - Admin and Sales User roles with different permissions
- ✅ **Docker Setup** - Complete Docker and Docker Compose configuration for deployment
- ✅ **Dark Mode** - Dark theme UI with slate colors
- ✅ **Form Validation** - Client and server-side validation with express-validator
- ✅ **TypeScript** - Fully typed codebase with proper interfaces and types

## Tech Stack

### Frontend
- React 18.2.0
- React DOM 18.2.0
- TypeScript 5.2.2
- Vite 5.0.0
- TailwindCSS 3.3.0
- Axios 1.5.0
- Lucide React 0.263.1
- PostCSS 8.4.31
- Autoprefixer 10.4.16
- @vitejs/plugin-react 4.1.0
- ESLint (frontend lint script)

### Backend
- Node.js + Express.js
- TypeScript 5.2.2
- tsx 3.14.0
- MongoDB + Mongoose 7.6.3
- JWT (jsonwebtoken 9.0.3)
- bcryptjs 2.4.3
- express-validator 7.0.0
- cors 2.8.5
- dotenv 16.3.1
- papaparse 5.4.1
- ESLint 8.51.0
- @typescript-eslint/parser 6.7.5
- @typescript-eslint/eslint-plugin 6.7.5

### DevOps
- Docker & Docker Compose
- Nginx for frontend serving

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts      # Authentication logic
│   │   │   └── lead.controller.ts      # Lead CRUD and export
│   │   ├── models/
│   │   │   ├── User.ts                 # User schema with roles
│   │   │   └── Lead.ts                 # Lead schema
│   │   ├── routes/
│   │   │   ├── auth.routes.ts          # Auth endpoints
│   │   │   │   └── lead.routes.ts       # Lead endpoints
│   │   ├── middleware/
│   │   │   ├── auth.ts                 # JWT authentication & authorization
│   │   │   └── errorHandler.ts         # Global error handler
│   │   └── server.ts                   # Main server file
│   ├── tsconfig.json
│
├── frontend/
│   ├── .env
│   ├── .gitignore
│   ├── Dockerfile
│   ├── index.html                      # HTML template
│   ├── nginx.conf                      # Nginx configuration
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public/
│   │                                   
│   ├── src/
│   │   ├── App.tsx                     # Main app component with routing
│   │   ├── main.tsx                    # React entry point
│   │   ├── index.css                   # Global styles
│   │   ├── vite-env.d.ts               # Vite environment types
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx           # Auth page with register/login
│   │   │   └── DashboardPage.tsx       # Main dashboard with leads
│   │   ├── services/
│   │   │   └── api.ts                  # API calls with axios
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docker-compose.yml                  # Docker Compose configuration
├── ,gitignore                          # for root
└── README.md                           

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Docker and Docker Compose (for containerized setup)

### Local Development Setup

#### 1. Clone and Setup Backend

```bash
# Clone the repository
git clone <your-repo-url>
cd smart-leads-dashboard/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/smart-leads
# JWT_SECRET=your-super-secret-key

# Start MongoDB (if running locally)
# mongod

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Backend will run on: http://localhost:5000

#### 2. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
# If frontend/.env.example is not available, create frontend/.env manually with:
# VITE_API_URL=http://localhost:5000/api

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend will run on: http://localhost:3000

### Docker Setup (Recommended for Deployment)

```bash
# From project root
docker-compose up -d

# This will:
# - Start MongoDB on port 27017
# - Start Backend API on port 5000
# - Start Frontend on port 3000

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "message": "User registered successfully"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "sales_user"
  }
}
```

### Lead Endpoints (Requires JWT Token)

#### Create Lead
```
POST /leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "status": "new",
  "source": "website"
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "status": "new",
  "source": "website",
  "userId": "507f1f77bcf86cd799439011",
  "createdAt": "2026-05-17T10:30:00Z",
  "updatedAt": "2026-05-17T10:30:00Z"
}
```

#### Get All Leads (with filtering, searching, pagination)
```
GET /leads?page=1&status=new&source=website&search=rahul&sort=latest
Authorization: Bearer <token>

Response: 200 OK
{
  "leads": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Rahul Kumar",
      "email": "rahul@example.com",
      "status": "new",
      "source": "website",
      "userId": "507f1f77bcf86cd799439011",
      "createdAt": "2026-05-17T10:30:00Z",
      "updatedAt": "2026-05-17T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### Get Single Lead
```
GET /leads/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "status": "new",
  "source": "website",
  "userId": "507f1f77bcf86cd799439011",
  "createdAt": "2026-05-17T10:30:00Z",
  "updatedAt": "2026-05-17T10:30:00Z"
}
```

#### Update Lead
```
PUT /leads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Rahul Kumar",
  "email": "rahul.kumar@example.com",
  "status": "contacted",
  "source": "instagram"
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Rahul Kumar",
  "email": "rahul.kumar@example.com",
  "status": "contacted",
  "source": "instagram",
  "userId": "507f1f77bcf86cd799439011",
  "createdAt": "2026-05-17T10:30:00Z",
  "updatedAt": "2026-05-17T11:00:00Z"
}
```

#### Delete Lead
```
DELETE /leads/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Lead deleted successfully"
}
```

#### Export Leads as CSV
```
GET /leads/export/csv?status=qualified&source=instagram&search=rahul
Authorization: Bearer <token>

Response: 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename=leads.csv

Name,Email,Status,Source,Created At
Rahul Kumar,rahul@example.com,qualified,instagram,05/17/2026
```

### Query Parameters

**Pagination:**
- `page` (default: 1) - Page number

**Filtering:**
- `status` - Filter by lead status: new, contacted, qualified, lost
- `source` - Filter by lead source: website, instagram, referral

**Search:**
- `search` - Search by name or email (case-insensitive)

**Sorting:**
- `sort` - Sort order: latest (default) or oldest

**Combined Example:**
```
GET /leads?page=2&status=qualified&source=instagram&search=rahul&sort=oldest
```

## Lead Status Options
- `new` - New lead, not yet contacted
- `contacted` - Lead has been contacted
- `qualified` - Lead is qualified for sales
- `lost` - Lead was lost to competition

## Lead Source Options
- `website` - Lead came from website
- `instagram` - Lead came from Instagram
- `referral` - Lead came through referral

## User Roles
- `admin` - Full access to all features
- `sales_user` - Can manage leads (default role)

## Deployment Instructions

### Deploy to Heroku/Railway/Render

#### Backend Deployment Steps:

1. Create an account on your chosen platform
2. Connect your GitHub repository
3. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_secret_key
   FRONTEND_URL=your_frontend_url
   NODE_ENV=production
   ```
4. Deploy

#### Frontend Deployment Steps:

1. Deploy to Vercel, Netlify, or similar
2. Set environment variables:
   ```
   VITE_API_URL=your_backend_api_url
   ```
3. Deploy

### Alternative: Deploy with Docker

```bash
# Build images
docker-compose build

# Push to Docker Hub or container registry
docker tag smart-leads-backend:latest your-registry/smart-leads-backend:latest
docker push your-registry/smart-leads-backend:latest

# Deploy using docker-compose on your server
docker-compose pull
docker-compose up -d
```

## Test Accounts

After setup, create test accounts:
- Admin: admin@test.com / password123
- Sales User: sales@test.com / password123

## Code Quality & Standards

### TypeScript Strict Mode
- All files use strict TypeScript with proper interface definitions
- No usage of `any` type without justification
- Proper error handling and type safety

### Validation
- Client-side form validation
- Server-side request validation using express-validator
- Database schema validation using Mongoose

### Security
- JWT tokens with 24-hour expiration
- Passwords hashed with bcryptjs
- CORS configured for allowed origins
- Environment variables for sensitive data

### Performance
- Debounced search to reduce API calls
- Backend pagination to handle large datasets
- MongoDB indexes for fast queries
- Efficient API response format

## Common Issues & Troubleshooting

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running locally or update MONGODB_URI to your MongoDB Atlas connection string
```

### CORS Error
```
Solution: Update FRONTEND_URL in backend .env to match your frontend URL
```

### Port Already in Use
```
Solution: Kill process on port or change PORT in .env
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Frontend can't connect to API
```
Solution: Check VITE_API_URL in frontend .env matches backend URL
```

### Docker Issues
```
Solution: Clear Docker cache and rebuild
docker-compose down
docker system prune -a
docker-compose up -d --build
```

## File Structure Details

### Backend Controllers
- **auth.controller.ts**: Handles user registration, login, JWT token generation
- **lead.controller.ts**: Handles CRUD operations, filtering, searching, CSV export

### Frontend Components
- **LoginPage.tsx**: Authentication page with register/login forms
- **DashboardPage.tsx**: Main dashboard with lead table, filters, CRUD operations
- **App.tsx**: Main component with routing and user state management
- **api.ts**: API service with axios instance and all endpoints

### Database Models
- **User**: Stores user information with encrypted passwords and roles
- **Lead**: Stores lead information with userId reference for data isolation

## Submission Checklist

- [x] Clean, well-structured code
- [x] README.md with setup instructions
- [x] .env.example files (no secrets committed)
- [x] API Documentation
- [x] Proper TypeScript usage
- [x] JWT Authentication
- [x] Role-Based Access Control
- [x] Advanced Filtering & Search
- [x] Pagination
- [x] CSV Export
- [x] Docker Setup
- [x] Responsive UI
- [x] Error Handling
- [x] Loading States
- [x] Debounced Search

## Git Commit Messages

Good commit messages following conventional commits:
```
feat: add lead filtering by status and source
fix: resolve JWT token expiration issue
refactor: improve lead controller structure
docs: update API documentation
style: format code with prettier
test: add authentication tests
chore: update dependencies
```

## Future Enhancements

- Email notifications for lead status changes
- Lead comments and notes
- Advanced analytics and dashboards
- Bulk lead import
- Lead assignment to team members
- Activity logs
- Integration with CRM systems
- Real-time notifications with WebSockets

## Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check server logs: `docker-compose logs backend`
4. Review browser console for frontend errors

## License

This project is provided for educational and evaluation purposes.

---