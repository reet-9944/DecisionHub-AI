# DecisionHub AI — Team Setup Guide

## First Time Setup

### 1. Clone the repo
```bash
git clone <repo-url>
cd DecisionHub-AI
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```
Then open `backend/.env` and fill in:
- `GROQ_API_KEY` → Get free at https://console.groq.com (each dev gets their own)
- `JWT_SECRET` → Any random string e.g. `mysecret123`

### 3. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env
```
Then open `frontend/.env` and fill in Firebase config → **ask team lead for these values**

### 4. Run the project
Terminal 1 (backend):
```bash
cd backend
node server.js
```
Terminal 2 (frontend):
```bash
cd frontend
npm run dev
```
Open http://localhost:5173

---

## API Keys Summary

| Key | Where to get | Who needs it |
|-----|-------------|--------------|
| `GROQ_API_KEY` | https://console.groq.com | Every developer (free) |
| Firebase config | Ask team lead | Every developer (shared, safe) |
| `JWT_SECRET` | Make up any string | Every developer |
