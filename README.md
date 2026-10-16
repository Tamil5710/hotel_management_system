# Namala Tech - Hotel List Management System (StayFinder)

A complete, modern, responsive Hotel Management System built with **React.js**, **Vite**, **Redux Toolkit**, **React Router DOM**, **Leaflet/OpenStreetMap**, and a **Node.js/Express/PostgreSQL** backend API.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, React Router DOM v6, Axios, Leaflet & React-Leaflet, Lucide React, React Helmet Async
- **Backend**: Node.js, Express, PostgreSQL (`pg`), Multer (file uploads), CORS, Helmet, Morgan
- **Database**: PostgreSQL (`stayfinder` database)

---

## 🚀 Quick Start

### 1. Install Dependencies
Run the following in the project root:
```bash
npm run install:all
```
*(Or install individually: `npm install`, `npm --prefix backend install`, and `npm --prefix frontend install`)*

### 2. Start Both Backend & Frontend Concurrently
```bash
npm run dev
```
- **Backend API**: [http://localhost:5001](http://localhost:5001)
- **Frontend App**: [http://localhost:5173](http://localhost:5173)

### Individual Commands
```bash
# Run backend only (port 5001)
npm run dev:backend

# Run frontend only (port 5173)
npm run dev:frontend

# Seed / Reset PostgreSQL dummy hotels (10 hotels)
npm run seed

# Build frontend for production
npm run build
```

---

## 🔧 Fixes & Enhancements Applied

### 1. Image Save Problem Resolved
- **Problem**: Previously, `HotelForm.jsx` assigned ephemeral browser blob URLs (`blob:http://localhost:5173/...`) to `imageUrl`. Browser blob URLs only exist in that browser tab session's volatile memory. Once refreshed or saved to the database, they broke completely.
- **Solution**:
  - Added physical file upload handling via `hotelService.uploadImage(file)`, which sends files to `POST /api/uploads` and stores them in `backend/uploads/` (served at `http://localhost:5001/uploads/...`).
  - Added base64 Data URL persistence fallback for offline / mock mode.
  - In `backend/src/routes/hotels.js`, added server-side validation and decoding of base64 data URLs directly into `/uploads` with strict file size/MIME verification.
  - Eliminated all broken `blob:` URLs from the database and frontend state.

### 2. Connected to PostgreSQL Dummy Backend
- Connected Express backend to PostgreSQL 17 database `stayfinder` via `backend/.env`.
- Seeded 10 high-quality dummy hotels with real Unsplash images, accurate geographic coordinates, pricing, descriptions, and amenities.
- Created `/api/hotels/reset` endpoint and wired Redux `resetHotelsToDefaults` so users can reset back to fresh dummy data anytime.

### 3. Black Color Footer Background
- Changed footer (`.site-footer`) background to pure black (`#000000`).
- Configured clean white typography, muted slate links (`#94a3b8`), subtle dividers (`rgba(255, 255, 255, 0.12)`), and high-contrast newsletter input and button.
