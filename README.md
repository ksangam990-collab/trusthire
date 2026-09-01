# TrustHire — India's Verified Job Board

A MERN-stack job portal where every employer is verified against official MCA/GST government records, and fraud reports are public — so job seekers know exactly who they're applying to.

---

## Project Structure

```
trusthire/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/           # DB, Cloudinary
│   │   ├── controllers/      # Auth, Jobs, Employers, Applications, Fraud
│   │   ├── middleware/        # Auth JWT, Error handler, Rate limiter
│   │   ├── models/           # User, Employer, JobListing, Application, FraudReport, Alert
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # Email, Verification (MCA/GST)
│   │   ├── utils/            # JWT helpers
│   │   └── server.js         # Entry point
│   └── .env.example
│
└── frontend/                 # React + Vite + Tailwind
    ├── src/
    │   ├── api/              # Axios client + endpoint functions
    │   ├── components/       # Navbar, Footer, JobCard, UI kit
    │   ├── pages/            # Public, Auth, JobSeeker, Employer
    │   ├── store/            # Zustand auth store
    │   └── App.jsx           # Router
    └── .env.example
```

---

## Quick Start

### 1. Clone and install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Fill in your MongoDB URI, JWT secrets, Cloudinary, SendGrid keys

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Environment variables

**Backend `.env`** (required before running):
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_HOST=smtp.sendgrid.net
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_key
EMAIL_FROM=noreply@trusthire.in
CLIENT_URL=http://localhost:5173
```

**Frontend `.env`**:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev       # starts on http://localhost:5000

# Terminal 2 — Frontend  
cd frontend
npm run dev       # starts on http://localhost:5173
```

---

## Key Features

| Feature | Details |
|---------|---------|
| **Employer Verification** | CIN → MCA21 API · GSTIN → GST API · auto-computed trust score |
| **Verified-Only Filter** | Toggle to see only MCA/GST-verified employers |
| **Public Fraud Board** | Anonymized, categorized, browsable fraud reports |
| **Auto-Suspend** | Listings auto-suspended after 3+ same-type fraud reports |
| **Trust Score** | 0–100 score per employer based on verification + report history |
| **JWT Auth** | Access token + httpOnly refresh cookie, role-based (jobseeker/employer/admin) |
| **File Uploads** | Evidence files for fraud reports → Cloudinary (JPEG/PNG/PDF, max 5MB) |
| **Email Alerts** | Verification, application notifications, password reset via Nodemailer |
| **Rate Limiting** | Auth: 10/15min · API: 100/min · Fraud reports: 5/day |

---

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

GET    /api/jobs                    # Search/filter jobs
GET    /api/jobs/:id                # Single job + employer trust data
POST   /api/jobs                    # Create job (employer only)
POST   /api/jobs/:id/apply          # Apply (jobseeker only)
POST   /api/jobs/:id/save           # Save/unsave job

GET    /api/employers/:id/profile   # Public employer trust profile
POST   /api/employers/verify        # Verify CIN or GSTIN
GET    /api/employers/me            # My employer profile

GET    /api/applications/mine       # Job seeker's applications
GET    /api/applications/job/:id    # Employer views applicants

POST   /api/fraud-reports           # Submit report (with file upload)
GET    /api/fraud-reports/employer/:id  # Public fraud summary
GET    /api/fraud-reports/admin/all     # Admin: all reports
PATCH  /api/fraud-reports/admin/:id     # Admin: review report
```

---

## Deployment

| Service | Platform | Cost |
|---------|----------|------|
| Frontend | Vercel | Free |
| Backend | Render | Free |
| Database | MongoDB Atlas M0 | Free |
| File storage | Cloudinary | Free (25GB) |
| Email | SendGrid | Free (100/day) |
| Domain | Any registrar | ~₹800/year |

**Deploy backend to Render:**
1. Connect GitHub repo
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables

**Deploy frontend to Vercel:**
1. Connect GitHub repo
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Add `VITE_API_URL=https://your-render-url.onrender.com/api`

---

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, TanStack Query, Zustand, React Hook Form, Zod, Lucide React
- **Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs, Zod, Nodemailer, Multer, Cloudinary
- **Database:** MongoDB Atlas
- **External APIs:** MCA21 (CIN verification), GST Portal (GSTIN verification)
- **Security:** Helmet, CORS, express-rate-limit, input sanitization, httpOnly cookies

---

## Development Notes

- In `NODE_ENV=development`, employer verification uses a **simulator** (no real API keys needed). Even CINs verify; odd fail.
- Seed the DB with `npm run seed` (create this script once you have real data)
- Admin account: manually set `role: "admin"` in MongoDB for your user document

---

Built by Sangam Kumar — RVS College of Engineering & Technology, CSE Final Year Project
