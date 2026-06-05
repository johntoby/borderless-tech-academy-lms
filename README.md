# Borderless Academy — LMS

A full-stack Learning Management System for a DevOps training school. Built with Next.js 14, Prisma, PostgreSQL, and NextAuth.

---

## Default Credentials

| Role  | Email                        | Password   |
|-------|------------------------------|------------|
| Admin | admin@borderlesstech.com     | Admin@123  |
| Student | alice@example.com          | Student@123 |
| Student | bob@example.com            | Student@123 |
| Student | carol@example.com          | Student@123 |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v4 with JWT
- **Styling**: Tailwind CSS (dark theme)
- **Icons**: Lucide React
- **Toasts**: React Hot Toast

---

## Setup Instructions

### 1. Prerequisites

- Node.js v18+ (v20.12+ recommended)
- PostgreSQL database running locally (or a hosted DB like Neon/Supabase)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/borderless_academy"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Create the Database

Create a PostgreSQL database named `borderless_academy`:
```sql
CREATE DATABASE borderless_academy;
```

### 5. Run Database Migrations

```bash
npm run db:push
```

Or using migrations:
```bash
npm run db:migrate
```

### 6. Generate Prisma Client

```bash
npm run db:generate
```

### 7. Seed the Database

```bash
npx prisma db seed
```

This creates:
- 1 admin account (admin@borderlesstech.com / Admin@123)
- 3 sample students
- 2 courses with content links
- 2 assignments
- 1 announcement

### 8. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
/app
  /api              — API routes
    /auth           — NextAuth + register
    /admin          — Admin-only routes
    /courses        — Course CRUD
    /assignments    — Assignment CRUD
    /submissions    — Submission management
    /announcements  — Announcements
    /upload         — File upload endpoint
    /student        — Student-specific data
  /login            — Login page
  /register         — Registration page
  /admin            — Admin panel pages
    /dashboard
    /students
    /courses/[id]/content
    /assignments/[id]
    /announcements
  /dashboard        — Student portal pages
    /courses/[id]
    /assignments/[id]
    /announcements
/components
  /ui               — Reusable UI (Button, Input, Modal, Badge...)
  /layout           — Admin & Student sidebars
/lib
  /auth.ts          — NextAuth config
  /prisma.ts        — Prisma client singleton
  /utils.ts         — Date and utility helpers
/prisma
  schema.prisma     — Database schema
  seed.ts           — Seed data script
```

---

## Features

### Admin Panel
- Dashboard with stats (students, courses, pending reviews)
- Student management (view, approve, suspend)
- Course management (create, edit, publish/unpublish)
- Course content (add notes/videos/resource links)
- Assignment creation with deadlines
- Assignment grading (score + feedback)
- Announcements

### Student Portal
- Dashboard with upcoming deadlines + announcements feed
- Course browser grouped by cohort
- Course detail with lecture notes, videos, and resource links
- Assignment list with filter by status
- Assignment submission (text + file upload)
- View grades and feedback
- Announcements feed

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to DB |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Run seed script |
| `npm run db:studio` | Open Prisma Studio |
