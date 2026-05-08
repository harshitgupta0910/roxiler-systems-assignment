# Store Rating Platform

A full-stack Store Rating Platform built with React, Express, and PostgreSQL. It supports role-based access for system admins, store owners, and normal users.

## Tech Stack

**Frontend**
- React + React Router
- Tailwind CSS
- React Hook Form + Zod
- Framer Motion
- React Hot Toast

**Backend**
- Node.js + Express
- JWT Auth
- Prisma ORM
- PostgreSQL

## Features

- JWT authentication with role-based routing
- Admin dashboard with user/store management
- Store rating workflow for users
- Store owner analytics view
- Responsive UI with polished tables, cards, and states

## Project Structure

```
frontend/
backend/
```

## Getting Started

### 1) Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### 2) Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `https://roxiler-systems-assignment-nine.vercel.app` and backend at `https://roxiler-systems-assignment-qab2.onrender.com`.

## Default Seed Accounts

- **Admin:** admin@storerate.com / Password@123
- **Owner:** owner@storerate.com / Password@123
- **User:** user@storerate.com / Password@123

## API Overview

- POST `/auth/register`
- POST `/auth/login`
- GET `/users`
- GET `/users/:id`
- POST `/users`
- PUT `/users/password`
- GET `/stores`
- POST `/stores`
- GET `/stores/:id`
- POST `/ratings`
- PUT `/ratings/:id`
- GET `/ratings/store/:storeId`

## Deployment Notes

### Frontend (Vercel)
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `VITE_API_URL`

### Backend (Render/Railway)
- Start command: `npm run start`
- Environment variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `PORT`
  - `CLIENT_URL`

## Validation Rules

- Name: 20-60 characters
- Address: max 400 characters
- Password: 8-16 characters, 1 uppercase, 1 special character
- Email: valid email format
