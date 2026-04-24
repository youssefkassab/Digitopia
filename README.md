# Digitopia

> **Enterprise Knowledge Management Platform** — A full-stack educational content ecosystem with AI-powered assistance, multi-tenant architecture, and enterprise-grade security.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## 🏗️ Architectural Overview

Digitopia is a **modular microservices-oriented monolith** designed for educational institutions and knowledge management. The architecture separates concerns into distinct layers while maintaining deployment simplicity.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  React 19   │  │  Vite HMR   │  │  Tailwind CSS v4 + GSAP │  │
│  │  Frontend   │  │  Dev Server │  │  Framer Motion UI       │  │
│  └──────┬──────┘  └─────────────┘  └─────────────────────────┘  │
│         │                                                        │
│         ▼ HTTPS / CORS                                           │
├─────────────────────────────────────────────────────────────────┤
│                        API GATEWAY LAYER                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Express.js + Helmet + Rate Limiting + Compression         │ │
│  │  JWT Authentication + Role-Based Access Control (RBAC)       │ │
│  │  Content Security Policy (CSP) + Request Logging            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│         │                                                        │
│         ▼                                                        │
├─────────────────────────────────────────────────────────────────┤
│                      SERVICE LAYER                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  User    │ │  Course  │ │  Admin   │ │  Message │          │
│  │  Service │ │  Service │ │  Service │ │  Service │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       └─────────────┴─────────────┴─────────────┘                │
│                         │                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │   Ask    │ │  Search  │ │  Upload  │ │   Game   │             │
│  │  (AI)    │ │  Service │ │  Service │ │  Service │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                      DATA LAYER                                │
│  ┌─────────────────┐  ┌─────────────────────────────────────┐  │
│  │   MySQL 8       │  │           MongoDB 6                   │  │
│  │  (Relational)   │  │      (Document/Embedding Storage)     │  │
│  │  • Users        │  │      • AI Embeddings                │  │
│  │  • Courses      │  │      • Generated Content            │  │
│  │  • Messages     │  │      • Session Data                 │  │
│  └─────────────────┘  └─────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           Cloudinary (Media Asset Storage)               │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Backend
| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js 20+ | Server runtime |
| Framework | Express.js 4.18 | REST API framework |
| ORM | Sequelize 6.37 | MySQL object mapping |
| Database | MySQL 8.0 | Primary relational data |
| Database | MongoDB 6.0 | Document & embedding storage |
| Auth | JWT + bcrypt | Stateless authentication |
| Security | Helmet, HPP, express-rate-limit | Security middleware |
| AI | @google/genai | Generative AI integration |
| Upload | Multer + Cloudinary | File handling & CDN |
| Logging | Winston 3.18 | Structured logging |

### Frontend
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | React 19.1 | UI library |
| Build Tool | Vite 7.1 | Fast development & bundling |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Animation | Framer Motion + GSAP | UI animations |
| Icons | Lucide React | Icon library |
| i18n | react-i18next | Internationalization |
| Router | React Router v7 | Client-side routing |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- MySQL 8.0+
- MongoDB 6.0+
- Cloudinary account (for media uploads)

### 1. Clone & Install

```bash
git clone https://github.com/youssefkassab/Digitopia.git
cd Digitopia

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

```bash
# Backend (.env)
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=digitopia
MONGODB_URI=mongodb://localhost:27017/digitopia
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_AI_API_KEY=your_google_ai_key
```

```bash
# Frontend (.env.production)
cd frontend
# Already configured for localhost:3001 proxy
```

### 3. Database Setup

```bash
# MySQL - create database
cd backend
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all  # if seeds exist

# MongoDB - runs automatically with connection string
```

### 4. Run Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## 📁 Project Structure

```
Digitopia/
├── backend/                    # Express.js API Server
│   ├── app.js                  # Main application entry
│   ├── server.js               # Server bootstrap
│   ├── config/                 # Configuration files
│   ├── controller/             # 10+ Business logic controllers
│   │   ├── user.controller.js
│   │   ├── course.controller.js
│   │   ├── admin.controller.js
│   │   ├── ask.controller.js   # AI integration
│   │   └── ...
│   ├── middleware/             # Auth, validation, logging
│   ├── router/                 # API route definitions
│   ├── utils/                  # Logger, helpers
│   ├── db/                     # Database migrations & models
│   └── .env.example            # Environment template
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── App.jsx             # Main app component
│   │   ├── components/         # Reusable UI components
│   │   ├── AdminComponents/    # Admin dashboard
│   │   ├── AdminServices/      # Admin API services
│   │   ├── services/           # Frontend API clients
│   │   ├── locales/            # i18n translations
│   │   └── assets/             # Static assets
│   ├── index.html
│   └── vite.config.js
├── booksdb/                    # Book database assets
└── start.bat                   # Windows quick-start script
```

---

## 🔒 Security Features

- **Helmet.js** - Secure HTTP headers
- **express-rate-limit** - DDoS protection
- **HPP** - HTTP Parameter Pollution prevention
- **CORS** - Configurable cross-origin policies
- **JWT** - Stateless authentication with refresh token pattern
- **bcrypt** - Password hashing (6 rounds)
- **CSP Headers** - Content Security Policy for game content
- **Input Validation** - Joi schema validation
- **SQL Injection Protection** - Parameterized queries via Sequelize

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **AI Assistant** | Google Generative AI integration for educational Q&A |
| **Course Management** | Full CRUD for educational content with hierarchy |
| **User Roles** | Multi-level RBAC (Student, Teacher, Admin) |
| **File Uploads** | Cloudinary-backed media storage with optimization |
| **Real-time Search** | Full-text search with embedding-based recommendations |
| **Game Hosting** | CSP-configured game content delivery |
| **i18n Support** | Arabic & English localization |
| **Responsive UI** | Mobile-first design with smooth animations |
| **Structured Logging** | Winston-based request/audit logging |

---

## 📝 API Documentation

API routes are organized by domain:

```
/api/users          # User management & profiles
/api/courses        # Course CRUD & enrollment
/api/admin          # Administrative functions
/api/messages       # Messaging system
/api/ask            # AI assistant queries
/api/search         # Full-text search
/api/upload         # File uploads
/api/games          # Game content
/api/embedding      # Vector embeddings
/api/structure      # AI-generated content structures
```

For detailed API specs, see inline JSDoc comments in controllers.

---

## 🚢 Deployment

See deployment guides:
- [CloudPanel Deployment](CLOUDPANEL-DEPLOYMENT.md)
- [cPanel Deployment](CPANEL-DEPLOYMENT.md)
- [Render Deployment](RENDER_DEPLOYMENT.md)

### Docker (Recommended)

```dockerfile
# Dockerfile coming soon
# Multi-stage build with Node 20 Alpine
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

ISC License - see LICENSE file for details.

---

## 👤 Author

**Youssef Kassab**
- GitHub: [@youssefkassab](https://github.com/youssefkassab)
- LinkedIn: [Your LinkedIn]

---

> Built with precision for educational excellence.
