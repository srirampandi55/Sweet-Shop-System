# Sweet Shop Management System

A comprehensive full-stack application for managing a sweet shop with inventory management, order processing, and user authentication.

## 🚀 Features

### Frontend (React + TypeScript + Tailwind CSS)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Authentication**: JWT-based login/register system
- **Role-based Access**: Different features for Admin and Staff users
- **Sweet Catalog**: Browse and search sweets with real-time stock updates
- **Shopping Cart**: Add items to cart with quantity management
- **Order Management**: Place orders and view order history
- **User Management**: Admin can manage users and their roles
- **Dashboard**: Overview of inventory, orders, and sales statistics

### Backend (Node.js + Express + TypeScript + PostgreSQL)
- **RESTful API**: Clean API design with proper status codes
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Authentication**: JWT tokens with role-based authorization
- **Validation**: Input validation using Zod
- **Error Handling**: Centralized error handling with meaningful messages
- **CORS**: Configured for frontend-backend communication
- **Database Seeding**: Sample data for quick testing

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma ORM** for database operations
- **JWT** for authentication
- **Zod** for validation
- **bcryptjs** for password hashing

### DevOps
- **Docker** & **Docker Compose** for containerization
- **Hot reload** for development
- **Production-ready** builds

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sweet-shop-management
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Database: localhost:5432

### Manual Setup (Development)

#### Backend Setup
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```


3. **Set up PostgreSQL database**
   ```bash
   # Install PostgreSQL and create database
   createdb sweetshop_db
   ```

4. **Run Prisma migrations**
   ```bash
   npm run db:migrate
   npm run db:generate
   npm run db:seed
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

#### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```


3. **Start the frontend development server**
   ```bash
   npm run dev
   ```

## 🔐 Default Login Credentials

The system comes with pre-seeded users for testing:

- **Admin User**
  - Username: `admin`
  - Password: `admin123`
  - Permissions: Full access to all features

- **Staff User**
  - Username: `staff`
  - Password: `staff123`
  - Permissions: Can view sweets, place orders, but no admin features

## 🗃️ Database Schema

### Users
- `id`: Unique identifier
- `username`: Login username
- `passwordHash`: Hashed password
- `role`: ADMIN or STAFF

### Sweets
- `id`: Unique identifier
- `name`: Sweet name
- `price`: Price per unit
- `stock`: Available quantity
- `description`: Optional description

### Orders
- `id`: Unique identifier
- `customerName`: Customer name
- `totalPrice`: Total order amount
- `createdAt`: Order timestamp

### OrderItems
- `id`: Unique identifier
- `orderId`: Reference to order
- `sweetId`: Reference to sweet
- `quantity`: Ordered quantity
- `price`: Total price for this item

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Sweets
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/:id` - Get sweet by ID
- `POST /api/sweets` - Create sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)

### Orders
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/:id` - Get order by ID (Admin only)
- `POST /api/orders` - Create new order

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## 📁 Project Structure

```
sweet-shop-management/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Main server file
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Database seeding
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main App component
│   │   └── main.tsx         # React entry point
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Docker services configuration
└── README.md               # This file
```

## 🔧 Development

### Available Scripts

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://sweetshop:sweetshop123@localhost:5432/sweetshop_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Production Deployment

### Using Docker
1. Build and start services:
   ```bash
   docker-compose up -d
   ```

2. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Manual Deployment
1. Build backend:
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. Build frontend:
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

## 🧪 Testing

The application comes with sample data including:
- 8 different types of sweets with various prices and stock levels
- Admin and staff user accounts
- Sample orders for testing

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Different access levels for admin and staff
- **Input Validation**: Zod schema validation on all inputs
- **CORS Configuration**: Properly configured for frontend access
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## 📱 Features Overview

### For All Users
- User registration and login
- Browse sweet catalog with search functionality
- Add items to shopping cart
- Place orders with customer information
- Responsive design for mobile and desktop

### For Admin Users
- All staff features plus:
- Manage sweet inventory (add, edit, delete)
- View all orders and order details
- User management (create, edit, delete users)
- Dashboard with business analytics
- Stock level monitoring with low-stock alerts

### For Staff Users
- Browse and search sweets
- Manage shopping cart
- Place customer orders
- View basic dashboard information



