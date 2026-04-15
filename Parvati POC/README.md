# Paravati POC

Modern ecommerce proof-of-concept with Amazon-like UI:

- `frontend/`: Next.js + Tailwind CSS premium ecommerce UI
- `backend/`: Express + MongoDB + Zoho Books integration

## Quick Start

### 1. Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

Seed the database with sample products:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

Backend runs on `http://localhost:4000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `ZOHO_CLIENT_ID` | Zoho OAuth client ID |
| `ZOHO_CLIENT_SECRET` | Zoho OAuth client secret |
| `ZOHO_REFRESH_TOKEN` | Zoho OAuth refresh token |
| `ZOHO_ORG_ID` | Zoho organization ID |

### Frontend (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: `http://localhost:4000`) |

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | — | Admin login |
| `GET` | `/api/products` | — | List products (with search, filter, sort, pagination) |
| `GET` | `/api/products/categories` | — | List unique categories |
| `GET` | `/api/products/price-range` | — | Get min/max price |
| `GET` | `/api/products/:id` | — | Get single product |
| `POST` | `/api/products` | Admin | Create product |
| `PUT` | `/api/products/:id` | Admin | Update product |
| `DELETE` | `/api/products/:id` | Admin | Delete product |

### Query Parameters for `GET /api/products`

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Keyword search (name, description, category) |
| `category` | string | Filter by category |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `rating` | number | Minimum rating |
| `availability` | string | `available` or `unavailable` |
| `sort` | string | `newest`, `priceLow`, `priceHigh`, `rating`, `nameAsc`, `nameDesc` |
| `page` | number | Page number |
| `limit` | number | Results per page |

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS 3, Lucide Icons, TypeScript
- **Backend**: Express 4, Mongoose 8, MongoDB Atlas, JWT, Axios
- **Integration**: Zoho Books API (OAuth, CRUD items, rate limiting)
