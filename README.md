# SANKALP — Societal Innovation Collaboration Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v5+-646CFF.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28.svg)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%20API-4285F4.svg)](https://ai.google.dev/)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5.svg)](https://cloudinary.com/)
[![Geoapify](https://img.shields.io/badge/Geocoding-Geoapify-00C853.svg)](https://www.geoapify.com/)

**SANKALP** is an end-to-end multi-stakeholder ecosystem connecting citizens reporting localized societal challenges with universities developing technical innovations, expert evaluators validating solution feasibility, industry/CSR organizations providing funding and incubation, and government bodies/field officers managing pilot testing and on-ground verification.

---

## Core Lifecycle

```text
[Citizen Problem Report]
       │ (Geocoding & Cloudinary Upload)
       ▼
[AI Analysis & Deduplication] ────► [Challenge Formulation]
                                          │
                                          ▼
                                [University R&D & Solution]
                                          │
                                          ▼
                                [Expert Evaluation & Scoring]
                                          │
                                          ▼
                                [Industry / CSR Sponsorship]
                                          │
                                          ▼
                                [Government Pilot Permit]
                                          │
                                          ▼
                                [Field Officer Verification]
                                          │
                                          ▼
                                [Large-Scale Deployment]
```

---

## Key Features & Platform Stakeholders

| Stakeholder Persona | Core Capabilities & Workflows |
|---|---|
| 🌆 **Citizens** | Post real-world societal problems with geotagging (Geoapify reverse geocoding) and image uploads (Cloudinary). Track resolution progress, upvote community issues, and view deployed solutions. |
| 🎓 **Universities & Student R&D** | Explore AI-curated innovation challenges, submit technical solutions complete with budget/tech stack details, track solution statuses, and request government pilot deployment zones. |
| 🏢 **Industry & CSR Sponsors** | Discover top-evaluated technical solutions, express interest, pledge CSR grants/seed funding, and offer incubation or co-development support. |
| 🏛️ **Government Bodies** | Manage jurisdiction oversight (State, District, Departmental), review university pilot requests, issue official deployment permits, and monitor municipal impact metrics. |
| 👮 **Government Field Officers** | Conduct on-ground site inspections for pilot projects, record field verification notes, validate telemetry/KPIs, and confirm pilot deployment readiness. |
| 📑 **Evaluators & Domain Experts** | Perform multi-criteria solution evaluation across novelty, technical feasibility, scalability, budget compliance, and societal impact. |
| ⚙️ **Platform Admins** | Oversee platform governance, user verification, system audit logs, challenge moderation, and cross-sector analytics. |

---

## Technical Architecture

```text
                                 ┌─────────────────────────────────┐
                                 │       React 18 + Vite Web       │
                                 └────────────────┬────────────────┘
                                                  │ (Firebase ID Token)
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │     Express.js API Gateway      │
                                 └────────┬──────────────┬─────────┘
                                          │              │
                    ┌─────────────────────┘              └──────────────────────┐
                    ▼                                                           ▼
    ┌───────────────────────────────┐                           ┌───────────────────────────────┐
    │     firebaseAuth Middleware   │                           │     Multer Upload Middleware  │
    └───────────────┬───────────────┘                           └───────────────┬───────────────┘
                    │                                                           │
                    ▼                                                           ▼
    ┌───────────────────────────────┐                           ┌───────────────────────────────┐
    │  MongoDB User & Role Sync     │                           │   Cloudinary Media Storage    │
    └───────────────┬───────────────┘                           └───────────────────────────────┘
                    │
                    ├───────────────────────────────┬───────────────────────────────┐
                    ▼                               ▼                               ▼
    ┌───────────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────────┐
    │      AI Domain Services       │ │    Geoapify Geocoding     │ │      Domain Controllers       │
    │  (Categorization/Prioritization│ │   Reverse Geocode API     │ │ (Pilot, Challenge, Solution,  │
    │   /Deduplication/Matching)    │ └───────────────────────────┘ │  Government, Industry, etc.)  │
    └───────────────┬───────────────┘                               └───────────────┬───────────────┘
                    │                                                               │
                    ▼                                                               ▼
    ┌───────────────────────────────┐                               ┌───────────────────────────────┐
    │      Google Gemini API        │                               │       MongoDB Database        │
    └───────────────────────────────┘                               └───────────────────────────────┘
```

### Architectural Highlights

1. **Strict Service Layer Isolation**: AI integration is entirely encapsulated within `server/src/services/ai/`. Controllers call domain services which interface with `geminiService.js`.
2. **Unified Firebase & MongoDB RBAC**: Firebase Authentication handles authentication, while Express middleware (`firebaseAuth.js` and `roleMiddleware.js`) validates ID tokens and enforces role permissions against synced MongoDB user profiles.
3. **Cloud Media Pipeline**: File uploads (problem images, project documents) stream securely through Multer memory buffers directly into Cloudinary.
4. **Automated Location Resolution**: Coordinates provided during problem submission are resolved into structured address components (City, District, State, Pincode) using the Geoapify Reverse Geocoding API.

---

## Tech Stack

- **Frontend:** React 18, Vite 5, React Router v6, Axios, Lucide Icons, Pure CSS Design System
- **Backend:** Node.js, Express.js, CORS, Helmet, Morgan, Multer
- **Database:** MongoDB, Mongoose ORM
- **Authentication:** Firebase Authentication (Client Web SDK + Server Admin SDK)
- **AI Engine:** Google Gemini API (Categorization, Prioritization, Deduplication, Auto Challenge Generation, Industry Matching)
- **Cloud Media Storage:** Cloudinary SDK
- **Geocoding & Location:** Geoapify Reverse Geocoding API

---

## Repository Structure

```text
sankalp/
├── client/                             # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── assets/                     # Static media & image assets
│   │   ├── components/                 # Reusable UI component library
│   │   │   ├── cards/                  # ProblemCard, ChallengeCard
│   │   │   ├── common/                 # Button, Badge, Card, Header
│   │   │   ├── forms/                  # ProblemForm, SolutionForm
│   │   │   └── navbar/                 # Dynamic Navigation Bar & Layout
│   │   ├── context/                    # AuthContext (Firebase auth state)
│   │   ├── firebase/                   # Firebase Web SDK initialization
│   │   ├── hooks/                      # Custom hooks (useAuth, etc.)
│   │   ├── pages/                      # Stakeholder Workspaces & Portals
│   │   │   ├── Admin/                  # System administration
│   │   │   ├── Citizen/                # CitizenHome, CitizenDashboard, CitizenReports
│   │   │   ├── Evaluator/              # Solution scoring views
│   │   │   ├── Government/             # GovernmentOfficerDashboard, GovernmentBodyDashboard
│   │   │   ├── Industry/               # IndustryDashboard & CSR matching
│   │   │   ├── Landing/                # Public landing page & platform statistics
│   │   │   ├── Login/                  # Authentication entry
│   │   │   ├── Register/               # Role registration (Citizen, University, Industry)
│   │   │   └── University/             # UniversityDashboard, ChallengeDetails, SubmitSolution,
│   │   │                               # UniversitySubmission, ApplyPilotModal
│   │   ├── routes/                     # AppRoutes & ProtectedRoute wrapper
│   │   ├── services/                   # Axios API service bindings (auth, problem, solution, pilot, etc.)
│   │   ├── utils/                      # Constants, helper utilities
│   │   ├── App.jsx                     # Application routing & layout
│   │   ├── main.jsx                    # React entry point
│   │   └── index.css                   # Global CSS theme & design tokens
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                             # Backend Service (Node.js + Express)
│   ├── src/
│   │   ├── config/                     # Database (Mongoose), Firebase Admin, Cloudinary configuration
│   │   ├── controllers/                # Request handlers & flow orchestration
│   │   │   ├── authController.js
│   │   │   ├── problemController.js
│   │   │   ├── problemAnalysisController.js
│   │   │   ├── challengeController.js
│   │   │   ├── universityController.js
│   │   │   ├── solutionController.js
│   │   │   ├── industryController.js
│   │   │   ├── industryInterestController.js
│   │   │   ├── governmentBodyController.js
│   │   │   ├── governmentOfficerController.js
│   │   │   ├── governmentProblemController.js
│   │   │   ├── pilotController.js
│   │   │   ├── pilotRequestController.js
│   │   │   ├── pilotEvaluationController.js
│   │   │   └── pilotVerificationController.js
│   │   ├── middleware/                 # firebaseAuth, roleMiddleware, uploadMiddleware
│   │   ├── models/                     # Mongoose Schemas (User, Problem, Challenge, Solution, Evaluation,
│   │   │                               # University, Industry, IndustryInterest, GovernmentBody,
│   │   │                               # GovernmentOfficer, Pilot, PilotRequest, PilotEvaluation)
│   │   ├── routes/                     # Express REST API routes
│   │   ├── services/                   # Business & Integration services
│   │   │   ├── ai/                     # Gemini AI services (geminiService, generateChallenge, etc.)
│   │   │   ├── aggregationService.js
│   │   │   ├── challengeService.js
│   │   │   ├── cloudinaryService.js    # Cloudinary stream uploader
│   │   │   ├── geocodingService.js     # Geoapify reverse geocoder
│   │   │   ├── industryMatchingService.js
│   │   │   ├── matchingService.js
│   │   │   └── notificationService.js
│   │   ├── utils/                      # Constants, response formatters
│   │   ├── app.js                      # Express middleware & route declarations
│   │   └── server.js                   # Application server bootstrap & MongoDB connection
│   ├── .env.example
│   └── package.json
│
├── docs/                               # System Documentation
│   ├── api.md                          # Endpoint declarations
│   ├── architecture.md                 # System architecture overview
│   └── lifecycle.md                    # 11-stage solution lifecycle
│
├── .env.example                        # Global Environment Variables Template
├── .gitignore
└── README.md
```

---

## API Reference Blueprint

Base Path: `/api`

### 1. Authentication (`/api/auth`)
- `POST /api/auth/sync` — Synchronize Firebase user token with MongoDB profile
- `GET /api/auth/me` — Retrieve current authenticated user profile & permissions

### 2. Problems & AI Analysis (`/api/problems`, `/api/problems/analyze`)
- `GET /api/problems` — List societal problems with search, filtering, and pagination
- `POST /api/problems` — Submit a problem (supports image upload & auto reverse-geocoding)
- `GET /api/problems/:id` — Retrieve problem details
- `POST /api/problems/:id/upvote` — Upvote a citizen problem
- `POST /api/problems/analyze` — Trigger AI categorization, impact scoring & deduplication

### 3. Challenges (`/api/challenges`)
- `GET /api/challenges` — List active innovation challenges
- `GET /api/challenges/:id` — Get detailed challenge requirements
- `POST /api/challenges` — Create/auto-generate challenge from problem(s)

### 4. University Solutions (`/api/solutions`, `/api/university`)
- `GET /api/solutions` — Filter and view university technical solutions
- `POST /api/solutions` — Submit a technical solution for an active challenge
- `GET /api/university` — Get registered university directory and showcase

### 5. Industry & CSR Partnerships (`/api/industry`, `/api/industry-interests`)
- `GET /api/industry` — List registered industry partners & CSR portfolios
- `POST /api/industry-interests` — Express sponsorship interest, pledge grants, or offer incubation

### 6. Government Bodies & Officers (`/api/government-bodies`, `/api/government-officers`, `/api/government/problems`)
- `GET /api/government-bodies` — List departmental government authorities
- `GET /api/government-officers` — View officer profiles & field assignments
- `GET /api/government/problems` — View jurisdiction-specific problems

### 7. Pilots, Requests & Field Verifications (`/api/pilots`, `/api/pilot-requests`, `/api/pilot-verifications`, `/api/pilot-evaluations`)
- `GET /api/pilots` — Track pilot deployments and status progression
- `POST /api/pilot-requests` — Request deployment permits from local government bodies
- `POST /api/pilot-verifications` — Record on-ground field inspection reports & evidence

---

## Environment Configuration

Create `.env` files in both `server/` and `client/` directories based on the templates below.

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/sankalp

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_client_email@example.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Geoapify Geocoding API
GEOAPIFY_API_KEY=your_geoapify_api_key
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api

# Firebase Web SDK
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Running locally or via MongoDB Atlas
- **Firebase Project**: Configured with Authentication
- **Google Gemini API Key**: Obtained from Google AI Studio
- **Cloudinary Account**: Cloud name, API key & secret
- **Geoapify API Key**: For reverse geocoding support

### 1. Server Setup
```bash
cd server
cp .env.example .env
# Fill in your environment credentials in .env
npm install
npm run dev
```
The backend API server will start on `http://localhost:5000`.

### 2. Client Setup
```bash
cd client
cp .env.example .env
# Fill in your Firebase web configuration in .env
npm install
npm run dev
```
The Vite development server will run on `http://localhost:5173`.

---

## Demo Test Credentials

Use the following pre-configured credentials to log in and test role-specific portals across the platform:

| Role Persona | Email Address | Password | Workspace Portal |
|---|---|---|---|
| 🌆 **Citizen** | `citizen@sankalp.demo` | `Sankalp@12345` | `/citizen` (Problem Portal & Reports) |
| 🎓 **University** | `university@sankalp.demo` | `Sankalp@12345` | `/university` (R&D Workspace & Solutions) |
| 🏢 **Industry / CSR** | `industry@sankalp.demo` | `Sankalp@12345` | `/industry` (Sponsorship & Incubation) |
| 👮 **Government Officer** | `officer@sankalp.demo` | `Sankalp@12345` | `/government/officer` (Field Verifications) |
| 🏛️ **Government Body** | `body@sankalp.demo` | `Sankalp@12345` | `/government/body` (Department Permits & Oversight) |

---

## License

This project is licensed under the [MIT License](LICENSE).

