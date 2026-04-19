# 🚀 Alona Web — Full-Stack Software Company Website

A production-ready full-stack website for a software company featuring a public-facing site and a full admin dashboard.

---

## 🗂️ Project Structure

```
alona-web/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js   # MySQL pool + auto-migration + seeding
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── messageController.js
│   │   │   ├── serviceController.js
│   │   │   └── projectController.js
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT middleware
│   │   ├── routes/
│   │   │   └── index.js      # All API routes
│   │   └── server.js         # Express app entry point
│   ├── .env
│   └── package.json
│
└── frontend/                 # Next.js + Tailwind + Framer Motion
    ├── src/
    │   ├── components/
    │   │   ├── Layout.js       # Public layout (Navbar + Footer)
    │   │   ├── Navbar.js       # Sticky animated navbar
    │   │   ├── Footer.js
    │   │   ├── AdminLayout.js  # Admin sidebar layout
    │   │   └── withAuth.js     # Protected route HOC
    │   ├── pages/
    │   │   ├── index.js        # Homepage
    │   │   ├── services.js     # Services page (dynamic)
    │   │   ├── projects.js     # Portfolio with filter
    │   │   ├── contact.js      # Contact form → DB
    │   │   ├── about.js        # About page
    │   │   ├── 404.js
    │   │   └── admin/
    │   │       ├── login.js    # Admin login
    │   │       ├── index.js    # Dashboard + stats
    │   │       ├── messages.js # Messages + reply system
    │   │       ├── services.js # Services CRUD
    │   │       └── projects.js # Projects CRUD
    │   ├── store/
    │   │   ├── authStore.js         # Zustand auth state
    │   │   └── notificationStore.js # Unread badge + polling
    │   ├── utils/
    │   │   └── api.js          # Axios with JWT interceptor
    │   └── styles/
    │       └── globals.css     # Design system
    ├── .env.local
    └── package.json
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 18+
- MySQL 8.0+

### 2. Database Setup
```sql
CREATE DATABASE alona_web;
```
> Tables are auto-created on first backend start. Default admin and seed data are inserted automatically.

### 3. Backend Setup
```bash
cd backend
npm install

# Edit .env with your MySQL credentials:
# DB_PASSWORD=your_mysql_password

npm run dev
# → Running on http://localhost:5000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# → Running on http://localhost:3000
```

---

## 🔐 Default Admin Credentials

| Field    | Value     |
|----------|-----------|
| Username | `admin`   |
| Password | `admin123`|

> Change these immediately in production via the MySQL `admins` table.

---

## 🌐 Pages

| Route               | Description                              |
|---------------------|------------------------------------------|
| `/`                 | Homepage with hero, services, CTA        |
| `/services`         | Services page (loaded from DB)           |
| `/projects`         | Portfolio with tech stack filter         |
| `/about`            | About page with team + values            |
| `/contact`          | Contact form (saves to DB)               |
| `/admin/login`      | Admin login                              |
| `/admin`            | Dashboard with stats                     |
| `/admin/messages`   | Messages + reply system + pagination     |
| `/admin/services`   | Add / Edit / Delete services             |
| `/admin/projects`   | Add / Edit / Delete projects             |

---

## 📡 API Endpoints

### Public
| Method | Route         | Description              |
|--------|--------------|--------------------------|
| POST   | `/contact`    | Submit contact message   |
| GET    | `/services`   | Get all services         |
| GET    | `/projects`   | Get all projects         |
| POST   | `/auth/login` | Admin login (JWT)        |

### Admin (JWT Required)
| Method | Route                    | Description             |
|--------|--------------------------|-------------------------|
| GET    | `/messages`              | List messages (paginated, searchable) |
| GET    | `/messages/stats`        | Dashboard stats         |
| PATCH  | `/messages/:id/read`     | Mark as read            |
| PATCH  | `/messages/:id/unread`   | Mark as unread          |
| POST   | `/reply`                 | Save reply to message   |
| DELETE | `/messages/:id`          | Delete message          |
| POST   | `/services`              | Create service          |
| PUT    | `/services/:id`          | Update service          |
| DELETE | `/services/:id`          | Delete service          |
| POST   | `/projects`              | Create project          |
| PUT    | `/projects/:id`          | Update project          |
| DELETE | `/projects/:id`          | Delete project          |

---

## 🛠️ Tech Stack

**Frontend:** Next.js 13, React 18, Tailwind CSS, Framer Motion, Zustand, Axios, React Hot Toast

**Backend:** Node.js, Express, MySQL2, JWT, bcryptjs

**Database:** MySQL 8 (`alona_web`)

---

## 🎨 Design System

- **Theme:** Dark (#0a0a0f background)
- **Accent:** Acid green (`#00ff88`)
- **Secondary:** Electric indigo (`#6366f1`)
- **Display Font:** Syne (Google Fonts)
- **Body Font:** DM Sans
- **Mono Font:** JetBrains Mono
- **Effects:** Glass morphism, grid backgrounds, gradient text, clip-path buttons

---

## 🔔 Admin Features

- **Dashboard** — Real-time stats (messages, projects, services, unread)
- **Messages** — Paginated list, search, filter (all/read/unread/replied), inline reply
- **Notifications** — Unread badge in sidebar + top bar, 30-second polling, sound alert on new message
- **Services CRUD** — Create, edit, delete services with icon selection
- **Projects CRUD** — Create, edit, delete with image URL, tech stack, demo/GitHub links

---

## 🚀 Production Deployment

1. Set strong `JWT_SECRET` in backend `.env`
2. Change default admin password in the database
3. Update `NEXT_PUBLIC_API_URL` in frontend `.env.local` to your production API URL
4. Build frontend: `npm run build && npm start`
5. Use PM2 or Docker for backend process management
"# cd-alona-web" 
