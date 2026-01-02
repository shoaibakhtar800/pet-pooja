# 🎨 Expense Tracker - Frontend

Modern React frontend for the Expense Tracker application built with **React 19**, **TypeScript**, **Vite**, and **shadcn/ui**.

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Library |
| TypeScript | Type Safety |
| Vite | Build Tool & Dev Server |
| Tailwind CSS 4 | Styling |
| shadcn/ui | UI Component Library |
| TanStack Query | Data Fetching & Caching |
| React Hook Form | Form Management |
| Zod | Schema Validation |
| Axios | HTTP Client |
| Lucide Icons | Icons |

---

## 📦 Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Backend server running on `http://localhost:4200`

---

## 🚀 Installation

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Environment File

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:4200/api/v1
```

> ⚠️ **Note**: Change the URL if your backend is running on a different port.

---

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

✅ App will start at: `http://localhost:3000`

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
frontend/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 📂 expense/
│   │   │   ├── ExpenseForm.tsx      # Add/Edit expense dialog
│   │   │   ├── ExpenseFilters.tsx   # Filter controls
│   │   │   └── ExpenseList.tsx      # Paginated expense list
│   │   ├── 📂 statistics/
│   │   │   ├── TopDaysCard.tsx      # Top 3 days statistic
│   │   │   ├── MonthlyChangeCard.tsx # Monthly change statistic
│   │   │   ├── PredictionCard.tsx   # Prediction statistic
│   │   │   └── StatisticsPanel.tsx  # Statistics container
│   │   ├── 📂 ui/                   # shadcn/ui components
│   │   └── Dashboard.tsx            # Main dashboard
│   ├── 📂 hooks/
│   │   ├── useUsers.ts              # Users API hook
│   │   ├── useCategories.ts         # Categories API hook
│   │   ├── useExpenses.ts           # Expenses CRUD hooks
│   │   └── useStatistics.ts         # Statistics API hook
│   ├── 📂 lib/
│   │   ├── api.ts                   # Axios API client
│   │   ├── queryClient.ts           # React Query config
│   │   └── utils.ts                 # Utility functions
│   ├── 📂 schemas/
│   │   └── expense.schema.ts        # Zod validation schemas
│   ├── 📂 types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── .env                             # Environment variables
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🎯 Features

- ✅ Add, Edit, Delete expenses
- ✅ Filter by user, category, date range
- ✅ Pagination with customizable page size
- ✅ Real-time form validation
- ✅ Statistics dashboard
- ✅ Responsive design
- ✅ Beautiful dark theme UI
- ✅ Skeleton loading states
- ✅ Toast notifications

---

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4200/api/v1` |

---

## 📝 Notes

- Make sure the backend server is running before starting the frontend
- The app uses React Query for caching - data is cached for 5 minutes
- All form validations are done using Zod schemas
