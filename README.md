# 🎯 Placement & Internship Tracker

A MERN stack web app to track internship and job applications, statuses, interview schedules, and notes.

## 🚀 How to Run

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/dhyeysitapara/Placement-Internship-Tracker.git
cd Placement-Internship-Tracker
```

### 2. Setup Backend
```bash
cd server
npm install
# Copy and fill in your MongoDB URI
cp .env.example .env
npm run dev
```
> Server runs on http://localhost:5000

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```
> Client runs on http://localhost:5173

---

## 📁 Project Structure

```
Placement-Internship-Tracker/
├── server/
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route logic
│   ├── routes/          # Express routes
│   ├── .env             # Environment variables
│   └── index.js         # Entry point
└── client/
    └── src/
        ├── pages/       # Dashboard, ApplicationList, AddApplication, ApplicationDetail
        ├── components/  # Navbar
        ├── hooks/       # Custom React hooks
        └── App.jsx      # Router setup
```

---

## 🗂️ Data Model

### Application
| Field | Type | Description |
|---|---|---|
| `company` | String | Company name (required) |
| `role` | String | Job/internship role (required) |
| `status` | Enum | `Applied` → `Shortlisted` → `Interview` → `Offer` / `Rejected` |
| `dateApplied` | Date | Date application was submitted |
| `interviewDate` | Date | Scheduled interview date (optional) |
| `jobLink` | String | URL to job posting (optional) |
| `notes` | String | Personal notes & reminders |
| `createdAt` | Date | Auto-generated timestamp |

---

## 🌐 API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/applications` | Get all applications |
| GET | `/api/applications/:id` | Get single application |
| POST | `/api/applications` | Create new application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |

---

## ✅ Features
 
 **Checkpoint 1 (Architecture & Skeleton)**
 - [x] Base MERN project running
 - [x] All 5 main screens with routing
 - [x] Clean, scalable project structure
 - [x] Data model defined and connected
 
 **Checkpoint 2 (Core CRUD)**
 - [x] Full CRUD operations (Add, View, Edit, Delete)
 - [x] Real-time MongoDB persistence
 - [x] Order-preserving status flow
 
 **Checkpoint 3 (UX, Stability & Aesthetics)**
 - [x] **Premium UI**: Black/Burgundy high-end theme
 - [x] **Custom DatePicker**: No more native browser popups
 - [x] **Custom Dropdowns**: Unified selection experience
 - [x] **Toast Notifications**: Modern feedback system (no alerts)
 - [x] **Filters**: Real-time filtering by status, company, and date
 - [x] **Analytics**: Dynamic dashboard summary cards
 - [x] **Validations**: Robust form checking and inline error feedback
 - [x] **Edge Cases**: Empty states and graceful error handling

---

## 👥 Team
- Dhyey Sitapara