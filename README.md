# 💰 Expense Tracker

A modern, full-stack expense tracking application built with **React**, **Node.js**, and **PostgreSQL**. Track your daily expenses, analyze spending patterns, and predict future expenditures.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![Tech Stack](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat&logo=node.js)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-Neon_DB-4169E1?style=flat&logo=postgresql)
![Tech Stack](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Statistics Queries](#-statistics-queries)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)

---

## ✨ Features

### 🎨 Frontend (React.js)
| Feature | Description |
|---------|-------------|
| 📊 Dashboard | Add, edit, and delete expenses with user, category, date, and amount |
| 🔍 Advanced Filters | Filter expenses by user, category, or date range |
| 📄 Pagination | Paginated expense list with customizable page size |
| 🎯 Form Validation | Client-side validation using Zod schema |
| 📱 Responsive Design | Works seamlessly on desktop and mobile devices |
| ⚡ React Query | Efficient data fetching, caching, and synchronization |

### 🔧 Backend (Node.js)
| Feature | Description |
|---------|-------------|
| 🔐 RESTful API | Clean and well-structured API endpoints |
| ✅ Input Validation | Server-side validation using express-validator |
| 📈 Statistic 1 | Find each user's top 3 days by total expenditure |
| 📉 Statistic 2 | Calculate percentage change from previous month |
| 🔮 Statistic 3 | Predict next month's expenditure (3-month average) |

### 🗄️ Database (PostgreSQL)
| Table | Description |
|-------|-------------|
| `users` | User information (id, name, email, status) |
| `categories` | Expense categories (id, name) |
| `expenses` | Expense records with foreign key relationships |

---

## 🛠 Tech Stack

### Frontend
```
├── React 19          → UI Library
├── TypeScript        → Type Safety
├── Vite              → Build Tool
├── Tailwind CSS 4    → Styling
├── shadcn/ui         → UI Components (Radix UI)
├── TanStack Query    → Data Fetching & Caching
├── React Hook Form   → Form Management
├── Zod               → Schema Validation
└── Lucide Icons      → Icons
```

### Backend
```
├── Node.js           → Runtime Environment
├── Express 5         → Web Framework
├── TypeScript        → Type Safety
├── pg                → PostgreSQL Client
├── express-validator → Request Validation
└── CORS              → Cross-Origin Support
```

### Database
```
└── PostgreSQL (Neon DB) → Cloud Database (No ORM - Raw SQL)
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | v18 or higher | `node --version` |
| npm | v9 or higher | `npm --version` |
| Git | Latest | `git --version` |

You'll also need:
- 🐘 PostgreSQL database (We recommend [Neon](https://neon.tech) - Free tier available)

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd pet-pooja
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@your-host.neon.tech/dbname?sslmode=require

# Server Configuration
PORT=4200
NODE_ENV=development
APP_NAME=Expense Tracker API
```

> ⚠️ **Important**: Replace the `DATABASE_URL` with your actual Neon PostgreSQL connection string.

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

---

## 🗄 Database Setup

You have two options to set up the database:

### Option A: Using Seed Script (Recommended)

```bash
# From backend directory
cd backend

# Run the seed script
npm run db:seed
```

This will:
- ✅ Create all tables (users, categories, expenses)
- ✅ Create indexes for optimized queries
- ✅ Insert sample users (5 users)
- ✅ Insert categories (10 categories)
- ✅ Insert sample expenses (35+ records for testing)

### Option B: Using SQL File Manually

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project → **SQL Editor**
3. Copy contents of `backend/database/schema.sql`
4. Paste and click **Run**

---

## ▶️ Running the Application

### Start Backend Server

```bash
# From backend directory
cd backend
npm run dev
```

✅ Backend will start at: `http://localhost:4200`

You'll see:
```
npm run dev

> Pet Pooja Backend@1.0.0 dev
> nodemon src/server.ts

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src\**\*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node src/server.ts src/server.ts`
[dotenv@17.2.3] injecting env (3) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
Server is running on port 4200
```

### Start Frontend Server

```bash
# From frontend directory (in a new terminal)
cd frontend
npm run dev
```

✅ Frontend will start at: `http://localhost:3000`

---

## 📡 API Documentation

### Base URL
```
http://localhost:4200/api/v1
```

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | Get all users |
| GET | `/api/v1/users/active` | Get active users only |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | Get all categories |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/expenses` | Get paginated expenses |
| GET | `/api/v1/expenses/:id` | Get expense by ID |
| POST | `/api/v1/expenses` | Create new expense |
| PUT | `/api/v1/expenses/:id` | Update expense |
| DELETE | `/api/v1/expenses/:id` | Delete expense |

#### Query Parameters for GET /expenses

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 10, max: 100) | `?limit=20` |
| `user_id` | number | Filter by user ID | `?user_id=1` |
| `category_id` | number | Filter by category ID | `?category_id=3` |
| `start_date` | string | Filter from date (YYYY-MM-DD) | `?start_date=2024-01-01` |
| `end_date` | string | Filter to date (YYYY-MM-DD) | `?end_date=2024-12-31` |

#### Create Expense Request Body

```json
{
    "user_id": 1,
    "category_id": 1,
    "amount": 250.50,
    "date": "2024-01-15",
    "description": "Lunch at restaurant"
}
```

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/statistics` | Get all statistics at once |
| GET | `/api/v1/statistics/top-days` | Top 3 spending days per user |
| GET | `/api/v1/statistics/monthly-change` | Monthly percentage change |
| GET | `/api/v1/statistics/prediction` | Predicted next month expenditure |

---

## 🗃 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USERS     │       │  EXPENSES   │       │ CATEGORIES  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ user_id(FK) │       │ id (PK)     │
│ name        │       │ category_id │──────►│ name        │
│ email       │       │ amount      │       │ created_at  │
│ status      │       │ date        │       └─────────────┘
│ created_at  │       │ description │
│ updated_at  │       │ created_at  │
└─────────────┘       │ updated_at  │
                      └─────────────┘
```

### SQL Schema

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses Table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);
```

---

## 📊 Statistics Queries

### Statistic 1: Top 3 Days by Expenditure (Per User)

Find each user's highest spending days.

```sql
WITH daily_totals AS (
    SELECT user_id, date, SUM(amount) as total_amount
    FROM expenses
    GROUP BY user_id, date
),
ranked_days AS (
    SELECT user_id, date, total_amount,
           ROW_NUMBER() OVER (
               PARTITION BY user_id 
               ORDER BY total_amount DESC
           ) as rank
    FROM daily_totals
)
SELECT * FROM ranked_days 
WHERE rank <= 3 
ORDER BY user_id, total_amount DESC;
```

### Statistic 2: Monthly Percentage Change

Calculate spending change from previous month.

```sql
WITH monthly_totals AS (
    SELECT user_id, DATE_TRUNC('month', date) as month, SUM(amount) as total
    FROM expenses 
    GROUP BY user_id, DATE_TRUNC('month', date)
)
SELECT 
    user_id, 
    month,
    total as current_month_total,
    LAG(total) OVER (PARTITION BY user_id ORDER BY month) as prev_month_total,
    ROUND(
        ((total - LAG(total) OVER (PARTITION BY user_id ORDER BY month)) / 
        LAG(total) OVER (PARTITION BY user_id ORDER BY month) * 100
    )::numeric, 2) as percentage_change
FROM monthly_totals;
```

### Statistic 3: Next Month Prediction

Predict expenditure based on last 3 months average.

```sql
WITH last_3_months AS (
    SELECT user_id, DATE_TRUNC('month', date) as month, SUM(amount) as monthly_total
    FROM expenses
    WHERE date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
      AND date < DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY user_id, DATE_TRUNC('month', date)
)
SELECT 
    user_id, 
    ROUND(AVG(monthly_total)::numeric, 2) as predicted_next_month
FROM last_3_months
GROUP BY user_id;
```

---

## 📁 Project Structure

```
pet-pooja/
│
├── 📂 backend/
│   ├── 📂 database/
│   │   └── schema.sql              # Database schema & seed data
│   ├── 📂 src/
│   │   ├── 📂 config/
│   │   │   ├── database.ts         # PostgreSQL connection pool
│   │   │   └── env.ts              # Environment variables
│   │   ├── 📂 controllers/
│   │   │   ├── expense.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── category.controller.ts
│   │   │   └── statistics.controller.ts
│   │   ├── 📂 middleware/
│   │   │   └── validate.ts         # Validation middleware
│   │   ├── 📂 routes/
│   │   │   ├── index.ts            # Route aggregator
│   │   │   ├── expense.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── category.routes.ts
│   │   │   └── statistics.routes.ts
│   │   ├── 📂 scripts/
│   │   │   └── seed.ts             # Database seeding script
│   │   ├── 📂 types/
│   │   │   └── index.ts            # TypeScript interfaces
│   │   ├── 📂 validators/
│   │   │   └── expense.validator.ts
│   │   └── server.ts               # Application entry point
│   ├── .env                        # Environment variables (create this)
│   ├── package.json
│   └── tsconfig.json
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📂 expense/
│   │   │   │   ├── ExpenseForm.tsx     # Add/Edit expense dialog
│   │   │   │   ├── ExpenseFilters.tsx  # Filter controls
│   │   │   │   └── ExpenseList.tsx     # Paginated expense list
│   │   │   ├── 📂 statistics/
│   │   │   │   ├── TopDaysCard.tsx
│   │   │   │   ├── MonthlyChangeCard.tsx
│   │   │   │   ├── PredictionCard.tsx
│   │   │   │   └── StatisticsPanel.tsx
│   │   │   ├── 📂 ui/                  # shadcn/ui components
│   │   │   └── Dashboard.tsx           # Main dashboard component
│   │   ├── 📂 hooks/
│   │   │   ├── useUsers.ts
│   │   │   ├── useCategories.ts
│   │   │   ├── useExpenses.ts
│   │   │   └── useStatistics.ts
│   │   ├── 📂 lib/
│   │   │   ├── api.ts              # Axios API client
│   │   │   ├── queryClient.ts      # React Query configuration
│   │   │   └── utils.ts            # Utility functions
│   │   ├── 📂 schemas/
│   │   │   └── expense.schema.ts   # Zod validation schemas
│   │   ├── 📂 types/
│   │   │   └── index.ts            # TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
└── 📄 README.md
```

---

## 📸 Screenshots

### Expenses Dashboard
<img width="1906" height="908" alt="image" src="https://github.com/user-attachments/assets/2acef86f-2621-4387-9bf5-3c57cce1e515" />

### Add Expense Dialog
<img width="565" height="442" alt="image" src="https://github.com/user-attachments/assets/e18fd53e-7bc5-407a-9e4b-6301ec6f69a7" />

### Statistics Panel
<img width="1910" height="906" alt="image" src="https://github.com/user-attachments/assets/4b13c2c0-e7a4-4506-8c0b-50f6955ad375" />

---

## 🔧 Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:seed` | Seed database with sample data |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Error: Connection refused
```
➡️ Check if your `DATABASE_URL` in `.env` is correct and includes `?sslmode=require`

**2. CORS Error in Browser**
```
Access-Control-Allow-Origin error
```
➡️ Make sure backend is running on port 4200 and frontend on port 3000

**3. Port Already in Use**
```
Error: EADDRINUSE
```
➡️ Change the port in `.env` or kill the process using that port

---

## 👨‍💻 Author

**Shoaib Akhtar**

---

## 📄 License

This project is licensed under the MIT License.

---
