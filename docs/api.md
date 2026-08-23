# SANKALP API Endpoints Documentation

Base URL: `/api`

All protected endpoints require the HTTP header:
```
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

---

## 1. Authentication & Users (`/api/auth`, `/api/users`)
- `POST /api/auth/sync` - Sync or register Firebase authenticated user with MongoDB profile.
- `GET /api/auth/me` - Get current authenticated user profile and roles.
- `PUT /api/users/profile` - Update user profile information.

## 2. Problems (`/api/problems`)
- `GET /api/problems` - List societal problems (with filtering, pagination, search).
- `GET /api/problems/:id` - Get problem details.
- `POST /api/problems` - Submit a new problem (Citizen / Authenticated user).
- `POST /api/problems/:id/upvote` - Upvote a problem.
- `POST /api/problems/:id/analyze` - Trigger AI analysis (Categorization, Prioritization, Deduplication).

## 3. Challenges (`/api/challenges`)
- `GET /api/challenges` - List active innovation challenges.
- `GET /api/challenges/:id` - Get challenge details.
- `POST /api/challenges` - Create a challenge from problem(s) (Admin / AI).

## 4. Solutions (`/api/solutions`)
- `GET /api/solutions` - List solutions (filter by challenge, status, university).
- `GET /api/solutions/:id` - Get solution details.
- `POST /api/solutions` - Submit solution for a challenge (University).
- `PUT /api/solutions/:id` - Update solution details/milestones (University).

## 5. Evaluations (`/api/evaluations`)
- `GET /api/evaluations` - List evaluations.
- `POST /api/evaluations` - Submit score and feedback for a solution (Evaluator).
- `GET /api/evaluations/solution/:solutionId` - Get evaluation summary for a solution.

## 6. University (`/api/universities`)
- `GET /api/universities` - List registered universities.
- `GET /api/universities/:id` - Get university profile and showcase.
- `PUT /api/universities/:id` - Update university profile.

## 7. Industry (`/api/industries`)
- `GET /api/industries` - List industry partners and CSR opportunities.
- `POST /api/industries/sponsor` - Create sponsorship offer / expression of interest.

## 8. Projects & Pilots (`/api/projects`, `/api/pilots`)
- `GET /api/projects` - List active innovation projects.
- `GET /api/pilots` - List pilot testing deployments.
- `POST /api/pilots` - Register pilot deployment zone and parameters (Government / Admin).
- `PUT /api/pilots/:id/status` - Update pilot progress and verification results.
