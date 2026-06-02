# FitForge Frontend

React + Vite + TypeScript frontend for the FitForge premium fitness platform.

## Features
- Dark mode default with light mode toggle
- Cinematic landing page
- Workout library and detail pages
- YouTube and Cloudinary video support
- BMI calculator with saved history integration
- Diet plans and food logging
- User dashboard with charts
- Admin dashboard and CRUD-ready resources
- Blog system with SEO metadata
- Community, transformation stories, and challenges
- Mobile-first responsive UI

## Setup
```bash
npm install
npm run dev
```

## Environment
```env
VITE_API_URL=http://localhost:5000/api
```

## Vercel Deployment
1. Import the `frontend` folder into Vercel.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Add `VITE_API_URL` pointing to your Render backend URL plus `/api`.

## Test Accounts
After running backend seed:
- Admin: `admin@fitforge.com` / `admin@123456`
- Member: `member@fitforge.com` / `member@123456`
