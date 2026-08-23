# SANKALP — Societal Innovation Collaboration Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v5+-646CFF.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28.svg)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%20API-4285F4.svg)](https://ai.google.dev/)

**SANKALP** connects citizens who report societal problems with universities that can develop solutions, evaluators who validate solutions, industries/startups/CSR organizations that can support them, and government/local authorities that facilitate pilot testing and deployment.

---

## Core Lifecycle

```text
Citizen → Problem → AI Analysis → Challenge → University → Solution → Evaluation → Industry Partnership → Pilot → Verification → Deployment
```

---

## Tech Stack

- **Frontend:** React, Vite, Axios, React Router, Lucide Icons, Pure CSS Design System
- **Backend:** Node.js, Express.js, Cors, Helmet, Morgan
- **Database:** MongoDB, Mongoose
- **Authentication:** Firebase Authentication (Client Web SDK + Server Admin SDK)
- **AI Engine:** Google Gemini API (Isolated Service Architecture)

---

## Repository Structure

```text
sankalp/
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/             # Static media assets
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Buttons, Badges, Headers, Loaders
│   │   │   ├── navbar/         # Navigation bar & layout header
│   │   │   ├── cards/          # Problem, Challenge, Solution cards
│   │   │   └── forms/          # Submission & intake forms
│   │   ├── pages/              # Role-specific & platform views
│   │   │   ├── Landing/        # Platform introduction & stats
│   │   │   ├── Login/          # Firebase Authentication
│   │   │   ├── Register/       # Role registration & onboarding
│   │   │   ├── Citizen/        # Citizen problem portal
│   │   │   ├── University/     # University R&D workspace
│   │   │   ├── Industry/       # Industry & CSR sponsorship
│   │   │   ├── Evaluator/      # Expert solution scoring
│   │   │   └── Admin/          # System moderation & oversight
│   │   ├── services/           # Axios HTTP client & API bindings
│   │   ├── context/            # AuthContext & global state
│   │   ├── hooks/              # Custom React hooks (useAuth, etc.)
│   │   ├── routes/             # Protected and public routes
│   │   ├── utils/              # Helper functions & constants
│   │   ├── firebase/           # Firebase Web SDK initialization
│   │   ├── App.jsx             # Main Application Component
│   │   ├── index.css           # Global Theme & Design Tokens
│   │   └── main.jsx            # React DOM entry point
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/             # DB, Environment & Firebase Admin configs
│   │   ├── models/             # Mongoose schemas (User, Problem, Challenge, etc.)
│   │   ├── routes/             # Express API route declarations
│   │   ├── controllers/        # Request handling & flow orchestration
│   │   ├── services/           # Business logic & AI isolation layer
│   │   │   ├── ai/             # Gemini API services (categorization, matching, etc.)
│   │   │   ├── matchingService.js
│   │   │   └── notificationService.js
│   │   ├── middleware/         # Firebase Auth, RBAC & Upload handlers
│   │   ├── utils/              # Constants & response formatters
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server entry point & DB startup
│   ├── .env.example
│   └── package.json
│
├── docs/                       # Architecture & Lifecycle documentation
│   ├── architecture.md
│   ├── api.md
│   └── lifecycle.md
│
├── .env.example                # Global Environment Variables Template
├── .gitignore
└── README.md
```

---

## Authentication Architecture

Firebase Authentication handles user identity and token issuance. MongoDB manages application profiles and RBAC.

```text
React (Client)
      ↓ (Firebase ID Token)
Express (Backend)
      ↓
firebaseAuth Middleware (Validates token with Firebase Admin)
      ↓
MongoDB User Profile (Fetches / synchronizes role)
      ↓
roleMiddleware (CITIZEN | UNIVERSITY | INDUSTRY | EVALUATOR | GOVERNMENT | ADMIN)
      ↓
Controller
```

---

## AI Architecture

Google Gemini API integration is completely isolated in the AI Service Layer:

```text
Controller
      ↓
AI Service Layer (categorization, prioritization, deduplication, matching)
      ↓
geminiService.js (Gemini API Wrapper)
      ↓
Google Gemini API
```

---

## Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB running locally or MongoDB Atlas connection string
- Firebase Project configured for Authentication
- Google Gemini API Key

### 1. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB, Firebase, and Gemini credentials
npm install
npm run dev
```

The backend server will run on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd client
cp .env.example .env
# Edit .env with your Firebase web configuration
npm install
npm run dev
```

The frontend client will run on `http://localhost:5173`.

---

## License

This project is licensed under the MIT License.
