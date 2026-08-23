# SANKALP Architecture Documentation

## System Overview

**SANKALP (Societal Innovation Collaboration Platform)** connects citizens who report societal problems with universities that develop solutions, evaluators who validate solutions, industries/startups/CSR organizations that fund/support them, and government/local authorities that facilitate pilot testing and deployment.

```
Citizen → Problem → AI Analysis → Challenge → University → Solution → Evaluation → Industry Partnership → Pilot → Verification → Deployment
```

---

## Architectural Principles

1. **Strict Separation of Concerns**:
   - **Frontend UI**: React components focused solely on presentation and user interaction.
   - **Frontend Services**: Centralized API abstraction using Axios with Firebase ID token injection.
   - **API Routes**: Express route definitions binding endpoints to middleware and controllers.
   - **Middleware Layer**: Firebase Auth verification and granular Role-Based Access Control (RBAC).
   - **Controllers**: Request validation, business flow orchestration, and HTTP response dispatching.
   - **Service Layer**: Reusable business logic, matching algorithms, notification workflows.
   - **AI Layer**: Isolated Gemini API integration returning validated, structured responses.
   - **Data Models**: MongoDB schemas managed via Mongoose.

2. **Authentication Flow (Firebase Auth + MongoDB)**:
   - Frontend performs authentication with Firebase (Google, Email/Password, etc.).
   - Frontend obtains Firebase ID Token and attaches it in the `Authorization: Bearer <token>` header.
   - Express backend passes request through `firebaseAuth` middleware which verifies token using Firebase Admin SDK.
   - `firebaseAuth` looks up or synchronizes the user profile in MongoDB (`req.user = mongoUser`).
   - `roleMiddleware` validates whether `req.user.role` matches the route requirements.
   - Controller handles the request knowing the user identity and role are authenticated and authorized.

```
React (Firebase SDK)
       ↓ (Firebase ID Token)
Express Route
       ↓
firebaseAuth Middleware (verify token with Firebase Admin)
       ↓ (Sync / Fetch MongoDB User)
roleMiddleware (check role: CITIZEN, UNIVERSITY, INDUSTRY, EVALUATOR, GOVERNMENT, ADMIN)
       ↓
Controller
```

3. **AI Architecture (Gemini Isolation)**:
   - Controllers **never** call the Gemini API directly.
   - Controllers invoke domain-specific AI services (`categorization.js`, `prioritization.js`, `deduplication.js`, `matching.js`).
   - Domain AI services call `geminiService.js` which encapsulates Gemini API interactions and prompts.
   - AI service parses and validates structured JSON output before returning it to the controller.

```
Controller
       ↓
AI Domain Service (categorization, prioritization, deduplication, matching)
       ↓
geminiService.js (Gemini API Wrapper)
       ↓
Gemini 2.5/Flash / Pro API
```

---

## Role-Based Access Matrix

| Role | Core Responsibilities |
|---|---|
| **CITIZEN** | Post societal problems, track status, upvote problems, view deployed solutions. |
| **UNIVERSITY** | Form student/faculty teams, view published challenges, submit technical solutions, manage development milestones. |
| **EVALUATOR** | Review and score submitted solutions against feasibility, impact, innovation, and scalability criteria. |
| **INDUSTRY** | Browse high-scoring solutions, offer mentorship, seed funding, CSR grants, or incubation partnerships. |
| **GOVERNMENT** | Approve pilot deployment zones, provide local municipal permissions, monitor deployment metrics. |
| **ADMIN** | Platform moderation, user verification, system configuration, audit logs, analytics. |
