# Project Management (Django + GraphQL + React)

## Stack

Backend: Django 4.2, Graphene, Postgres (Docker)  
Frontend: React 18, TypeScript, Apollo, Tailwind

## Quick start

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
docker compose up -d
docker port backend-db-1 5432   # copy host port to .env
cp .env.example .env && vim .env
python manage.py migrate
python manage.py shell -c "from core.models import Organization; Organization.objects.get_or_create(slug='acme', defaults={'name':'Acme','contact_email':'ops@acme.test'})"
python manage.py runserver 0.0.0.0:8000
```

### Frontend

```bash
cd frontend
npm i
echo 'VITE_API_URL=http://localhost:8000/graphql' > .env
npm run dev
```

### GraphQL

Header: X-Org-Slug: acme

### Queries:

projects(search: String): [Project]

projectTasks(projectId: ID!): [Task]

projectStats(projectId: ID!): JSON

### Mutations:

createProject(name!, description, status, dueDate)

updateProject(id!, name, description, status, dueDate)

createTask(projectId!, title!, description, status, assigneeEmail, dueDate)

updateTaskStatus(id!, status!)

addTaskComment(taskId!, content!, authorEmail!)

## Technical Summary

### Decisions & Trade-offs:

GraphQL only (no DRF): Requirements center on GraphQL; omitting REST reduces duplication and maintenance.

Header-based tenancy: Fast to implement and test; acceptable for demo. In production, prefer signed tokens (JWT) with org claim.

Offset pagination: Simpler for both client and server; acceptable for modest datasets.

Assignee by email: Meets UI needs without a full auth system; easy to migrate later to a User FK.

### Future Improvements

Auth & tenancy: JWT with org claim; role-based permissions; audit trail on mutations.

Real-time: Django Channels + Redis; subscriptions for TaskUpdated and CommentAdded.

Pagination: Move to cursor-based; add total counts; expose sort parameters.

Search & filters: Trigram/text search; multi-filter chips; saved views.

A11y: Focus management library or headless UI; keyboard DnD; color-contrast tokens and dark mode.

Testing: Frontend unit/integration tests with MSW; snapshot tests for GraphQL ops; load tests for hot queries.

Observability: Sentry (api/web), structured logs, basic request timing middleware; DB query counters in logs.

CI/CD: Lint steps, frontend tests, Docker image publishing, deploy job to chosen host.


## Screenshots:

### Project listing page
<img width="1871" height="700" alt="image" src="https://github.com/user-attachments/assets/e7c885ef-fbd9-4ff9-b8fc-98a79dc375c1" />

### Create Project
<img width="1833" height="1335" alt="image" src="https://github.com/user-attachments/assets/56bfb822-9fb3-49c1-b1de-78cba177f927" />


