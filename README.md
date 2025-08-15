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
