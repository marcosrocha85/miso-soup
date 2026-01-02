# Copilot Instructions for Miso Soup Project

## Overview
Miso Soup is an anime recommender web app using a psychological questionnaire. Backend (Nest.js) fetches anime data from Crunchyroll API and stores in SQLite via TypeORM. Frontend (Next.js) collects user answers and displays recommendations.

## Architecture
- **Monorepo Structure**: `backend/` (Nest.js) and `frontend/` (Next.js) in root.
- **Data Flow**: Frontend → POST answers to `/anime/recommend` → Backend maps answers to keywords → Query DB/API for anime with matching genres/keywords → Return recommendations.
- **Key Components**:
  - `Anime` entity: `src/anime/entities/anime/anime.ts` with `title`, `genres[]`, `keywords[]`.
  - Service: `src/anime/anime.service.ts` handles API calls and DB queries.
  - Controller: `src/anime/anime.controller.ts` exposes `/anime/recommend` POST endpoint.
  - Frontend: `app/page.tsx` client-side form using axios to backend.

## Workflows
- **Backend Dev**: `cd backend && npm run start:dev` (watches changes, runs on port 3003).
- **Frontend Dev**: `cd frontend && npm run dev` (runs on port 3002).
- **Build/Test**: No custom scripts; use standard Nest/Next commands. DB auto-syncs on start.
- **Debugging**: Check backend logs for TypeORM errors; frontend console for axios failures.

## Conventions
- **Modules**: Nest modules in `src/{module}/` (e.g., `src/anime/` for anime-related code).
- **Entities**: Use TypeORM decorators; `simple-array` for genres/keywords.
- **API Integration**: Use `crunchyroll-js-api` for fetching catalog; categorize by genres/tags.
- **Frontend**: Client components in `app/`; use Tailwind for styling; axios for backend calls.
- **CORS**: Enabled in `src/main.ts` for local dev.

## Patterns
- **Keyword Mapping**: Answers map to keywords (e.g., 'Energetic' → 'action'). Implement in controller's `mapAnswersToKeywords`.
- **Recommendations**: Query DB first; fallback to API if not cached. Save new anime to DB.
- **Error Handling**: Basic try/catch in frontend; Nest handles validation.

## TypeScript and Best Practices
- Never use typecast with `any`; observe the DRY principle.
- All texts and codes must be in English to allow for future internationalization.
- **Frontend Specific**:
  - `useState` hook should be typed. Define an interface for the anime object (with `id`, `title`, `genres` properties) and use, e.g., `useState<AnimeType[]>([])` for type safety.
  - Event parameter should be typed as `React.FormEvent<HTMLFormElement>` to maintain type safety.
  - Hardcoded API URL `'http://localhost:3003'` should be moved to an environment variable (e.g., `NEXT_PUBLIC_API_URL`) for better configuration management.
  - Error handling should display user feedback, not just console.log, when requests fail.
  - Select elements need accessible labels: add `id` to select and `htmlFor` on label for screen readers.
  - Map callback parameters like `anime` must be properly typed based on API response structure.

## Examples
- Add question: Update `questions` array in `frontend/app/page.tsx`.
- Extend entity: Modify `Anime` class and run migrations if needed (though synchronize=true).
- API Call: In service, use `Crunchyroll.getCatalog()` to fetch and parse genres.