# Toyvolt Admin Panel (`toyvolt-admin`)

Dense, high-density industrial neo-brutalist command center for **Toyvolt** e-commerce store operations.

Built as an independent, standalone single-page application (SPA) completely decoupled from the public customer storefront (`toyvolt-frontend`).

---

## ⚡ Tech Stack & Architecture

- **React 18** with **Vite 5**
- **Tailwind CSS 3** with custom Neo-Brutalist design tokens (`#F7F3EB` canvas, `#171717` ink borders, `#315FE8` cobalt blue, `#FFD983` warning yellow, `#FF5638` alert orange)
- **Hard offset shadows** (`3px 3px 0px #171717`, `4px 4px 0px #171717`)
- **React Router 6** with strict server-side protected route boundaries
- **Lucide React** for industrial iconography
- **Recharts** for sales velocity data visualization
- **Axios** with `withCredentials: true` (HTTP-only session cookies) + cross-origin Bearer token fallback

```
toyvolt-admin/
├── public/
│   └── toyvolt-logo.png
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── EmptyState.jsx
│   │   │   ├── PlaceholderPage.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── ToyvoltLogo.jsx
│   │   └── dashboard/
│   │       ├── KpiCardsGrid.jsx
│   │       ├── OperationalAlertBanner.jsx
│   │       ├── OrderFeedTable.jsx
│   │       ├── RevenueVelocityChart.jsx
│   │       ├── SystemAlertsPanel.jsx
│   │       └── WarehouseFastActions.jsx
│   ├── hooks/
│   │   ├── useAdminAuth.jsx
│   │   └── useSystemStatus.js
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── AdminSidebar.jsx
│   │   └── AdminTopBar.jsx
│   ├── pages/
│   │   ├── analytics/AnalyticsPage.jsx
│   │   ├── auth/LoginPage.jsx
│   │   ├── auth/SetupPage.jsx
│   │   ├── catalog/
│   │   │   ├── CategoriesPage.jsx
│   │   │   ├── InventoryPage.jsx
│   │   │   ├── NewProductPage.jsx
│   │   │   └── ProductsPage.jsx
│   │   ├── customers/
│   │   │   ├── CustomersPage.jsx
│   │   │   ├── PromotionsPage.jsx
│   │   │   └── ReviewsPage.jsx
│   │   ├── dashboard/DashboardPage.jsx
│   │   ├── fulfillment/
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── ReturnsPage.jsx
│   │   │   └── ShipmentsPage.jsx
│   │   └── system/
│   │       ├── IntegrationsPage.jsx
│   │       └── SettingsPage.jsx
│   ├── services/
│   │   ├── adminService.js
│   │   └── api.js
│   ├── styles/
│   │   └── index.css
│   ├── utils/
│   │   └── formatters.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

---

## 🚀 Running Locally

```bash
# 1. Navigate to the project directory
cd toyvolt-admin

# 2. Install dependencies
npm install

# 3. Start development server (runs on port 5174)
npm run dev
```

The admin console will be available at:
`http://localhost:5174` (or `http://localhost:5174/dashboard`)

---

## 🔒 First-Time Admin Setup & Security Architecture

1. **Atomic One-Time Setup Route**: `/setup`
   - Checks backend `GET /api/v1/auth/setup-status`.
   - If an admin exists in MongoDB, `/setup` redirects to `/login` with an informational notice: `"Setup already completed. Public registration permanently closed."`
   - If 0 admins exist, the first operator creates their credentials atomically via `POST /api/v1/auth/setup`.
   - The password is hashed using **bcrypt (salt rounds = 12)** on the backend.
   - Once created, public registration is **permanently disabled**.

2. **Admin Login**: `/login`
   - Supports Admin ID / Email + Master Password.
   - Sets secure HTTP-only cookies (`toyvolt_access_token`, `toyvolt_refresh_token`).
   - Verifies server-side authorization: `user.role === 'admin'`.

3. **CLI Alternative**:
   An administrator can also be created directly via the backend CLI script:
   ```bash
   cd toyvolt-backend
   node src/scripts/seedAdmin.js --email=admin@toyvolt.com --password=YourPassword123
   ```

---

## 🌐 Separate Deployment (e.g. Vercel)

The admin panel is completely decoupled and configured with `vercel.json` for SPA rewrites:

```bash
# Using Vercel CLI
vercel

# Environment variables in Vercel project settings:
VITE_API_BASE_URL=https://toyvolt-backend-03.onrender.com/api/v1
VITE_STOREFRONT_URL=https://toyvolt.com
```

Target domain:
`admin.toyvolt.com`
# toyvolt-admin
