# Namala Hotels - Hotel List Management System (Frontend)

A complete, modern, responsive Hotel List Management System built with **React.js**, **Vite**, **Redux Toolkit**, **React Router DOM**, **Axios**, **Leaflet & OpenStreetMap**, and **React Helmet Async**.

The user interface follows the blue-and-white listing layout inspired by the reference design, customized specifically for luxury hotels, boutique resorts, and heritage stays.

---

## 🌟 Key Features

1. **Hotel Directory & Listing**
   - Displays hotels as responsive cards with hover effects and subtle shadows.
   - Dual-view switcher:
     - **List View**: Matches the reference UI layout with thumbnail, title, rating, snippet, price per night, free cancellation badge, and actions.
     - **Grid View**: Multi-column responsive cards (3–4 on desktop, 2 on tablet, 1 on mobile).
   - Reusable **Header** with brand identity, Home link, Add Hotel button, and live Search.
   - Subheader blue banner with breadcrumbs and navigation.
   - Professional multi-column footer with newsletter signup and copyright.

2. **Advanced Search & Filtering**
   - Filter sidebar with collapsible accordion panels.
   - Search by hotel name, city, or description.
   - Minimum and Maximum price range inputs with **Apply Filters** and **Clear Filters**.
   - Property Type / Category checkboxes (Palace & Heritage, Beach Resorts, Business Hotels, Mountain Lodges, Eco Villas).
   - Guest Rating star filter (5+, 4.5+, 4+ stars).

3. **Frontend Pagination**
   - Previous and Next navigation buttons.
   - Dynamic numbered page buttons with ellipsis.
   - Current page indicator.
   - Total hotel count display (e.g. *Showing 1–6 of 10 hotels*).
   - Configurable page size selector (4, 6, 8, 12 per page).

4. **Add and Edit Hotel Form (`HotelForm.jsx`)**
   - Single reusable component for both Add and Edit modes.
   - **Cover Image Upload & Preview**:
     - Image selection from user's local device.
     - Real-time image preview before submission.
     - Replace and Remove image controls.
     - Image file validation (JPEG, PNG, WebP, GIF, max 5MB).
     - One-click sample photo selector for quick testing.
     - Proper cleanup of object URLs (`URL.revokeObjectURL`) to prevent memory leaks.
   - **Coordinate Inputs (Latitude & Longitude)**:
     - Step validation (-90 to 90 for Latitude, -180 to 180 for Longitude).
     - One-click **Use Current Location** button via browser Geolocation API.
   - **Price per Night**:
     - Number validation (> 0).
   - **Title and Description**:
     - Real-time and on-submit error messages with accessible `role="alert"`.
   - Disabled submit button with spinner during processing.
   - Toast feedback upon completion.

5. **Hotel Details Page (`/hotels/:id`)**
   - Hero cover photo and property badges.
   - Complete hotel description and room amenities grid.
   - Pricing display and savings calculation.
   - **Interactive Leaflet & OpenStreetMap Map**:
     - Centered at hotel's latitude & longitude coordinates.
     - Custom brand pin marker with popup.
     - Works reliably out-of-the-box without requiring browser location permissions.
     - Optional **Calculate Distance** feature using browser Geolocation API.
   - Quick action buttons (Edit Hotel, Delete Hotel, Share, Return to Directory).

6. **State Management & Data Architecture**
   - **Redux Toolkit (`@reduxjs/toolkit`)**:
     - Managed slice (`features/hotels/hotelSlice.js`) handling list, selected hotel, search, price filters, sorting, pagination, and toast alerts.
     - `createAsyncThunk` for CRUD operations (`fetchHotels`, `fetchHotelById`, `createHotel`, `updateHotel`, `deleteHotel`).
   - **Service Layer (`services/hotelService.js`)**:
     - Configured with Axios instance ready for future Node.js/PostgreSQL REST endpoints (`/api/hotels`).
     - Includes client-side mock persistence backed by `localStorage` so CRUD changes persist across browser refreshes.
   - **Confirm Dialog & Toast Notifications**:
     - Accessible modal dialog for deletions.
     - Non-blocking auto-dismissing toast alerts.

7. **SEO & Accessibility**
   - `react-helmet-async` on every page for dynamic page titles, descriptions, and OpenGraph tags.
   - Semantic HTML5 structure (`<header>`, `<nav>`, `<main>`, `<aside>`, `<article>`, `<footer>`).
   - Accessible form labels, aria attributes, and keyboard focus states.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Frontend library |
| **Vite** | Modern, fast build tooling and dev server |
| **Redux Toolkit & React-Redux** | Global state management and async thunks |
| **React Router DOM v6** | Single Page Application (SPA) routing |
| **Axios** | HTTP API integration client |
| **Leaflet & React-Leaflet** | Interactive maps and OpenStreetMap tiles |
| **React Helmet Async** | Dynamic SEO metadata management |
| **Lucide React** | Clean, modern UI icon set |
| **CSS3** | Responsive layouts, CSS variables, transitions |

---

## 📁 Folder Structure

```
hotel-frontend/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── app/
    │   └── store.js                   # Redux Toolkit store configuration
    ├── components/
    │   ├── ConfirmDialog.jsx          # Accessible delete confirmation modal
    │   ├── EmptyState.jsx             # Empty search / no results view
    │   ├── FilterSidebar.jsx          # Price range & category filters
    │   ├── Footer.jsx                 # Multi-column branded footer
    │   ├── Header.jsx                 # Site header, search, and nav links
    │   ├── HotelCard.jsx              # Reusable hotel card (list & grid views)
    │   ├── HotelForm.jsx              # Reusable Add / Edit hotel form
    │   ├── HotelMap.jsx               # Leaflet map with coordinates pin
    │   ├── LoadingSpinner.jsx         # Accessible loading animation
    │   ├── Pagination.jsx             # Numbered pagination with page size
    │   ├── SearchBar.jsx              # Search input with clear button
    │   └── Toast.jsx                  # Auto-dismissing notification toasts
    ├── data/
    │   └── hotels.js                  # 10 initial sample hotels & localStorage persistence
    ├── features/
    │   └── hotels/
    │       └── hotelSlice.js          # Redux slice with async thunks and reducers
    ├── hooks/
    │   └── useHotels.js               # Custom hook for Redux store interaction
    ├── layouts/
    │   └── MainLayout.jsx             # Common layout (Header, Content, Footer, Toast)
    ├── pages/
    │   ├── AddHotelPage.jsx           # Register new hotel route
    │   ├── EditHotelPage.jsx          # Edit existing hotel route
    │   ├── HomePage.jsx               # Hotel directory, search, filter, pagination
    │   ├── HotelDetailsPage.jsx       # Hotel details & interactive map (/hotels/:id)
    │   └── NotFoundPage.jsx           # 404 Not Found route
    ├── services/
    │   └── hotelService.js            # Axios client & mock data service layer
    ├── styles/
    │   ├── components.css             # Component-specific styles
    │   ├── global.css                 # CSS reset, utilities, buttons, badges
    │   └── variables.css              # Design tokens (colors, shadows, radius)
    ├── utils/
    │   ├── formatters.js              # Currency, coordinate & distance helpers
    │   ├── leafletIcons.js            # Leaflet icon Vite bundler fixes
    │   └── validators.js              # Hotel form and image upload validation
    ├── App.jsx                        # Route configuration
    └── main.jsx                       # App entrypoint (Redux + Helmet + Router)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0 or higher recommended, verified on v22)
- **npm** (v9.0 or higher)

### Installation & Run

1. Open your terminal in the project directory:
   ```bash
   cd hotel-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

To test the production build:
```bash
npm run build
npm run preview
```

---

## 🔌 Future Backend Integration (Node.js & PostgreSQL)

The application has been architected so that connecting to a live backend requires **zero UI refactoring**:

1. In `src/services/hotelService.js`, configure `VITE_API_BASE_URL` in an `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_USE_BACKEND=true
   ```
2. The `apiClient` Axios instance is already pre-configured to handle:
   - `GET /api/hotels?search=...&minPrice=...&maxPrice=...&page=...`
   - `GET /api/hotels/:id`
   - `POST /api/hotels`
   - `PUT /api/hotels/:id`
   - `DELETE /api/hotels/:id`

---

## 📄 License

Developed for Namala Tech India Private Limited.
