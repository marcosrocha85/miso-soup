# Anime Recommender based on Questionnaire

## Overview
Simple website: User answers psychological-style questions → Backend fetches anime from Crunchyroll using unofficial API → Recommends anime based on answers.

Stack:  
- Backend: Nest.js  
- Frontend: Next.js  

No user registration. No persistent user data.  
(Optional) Cache anime categorization (genres/keywords) using TypeORM.

## Crunchyroll API Analysis
From https://github.com/topics/crunchyroll-api, useful Node.js options:  
- crunchyroll.js → scraper  
- crunchyroll-js-api → API consumption, genre/keyword filtering  
- crunchyrollapi → catalog extraction, keyword support  

**Recommended:** Use `crunchyroll-js-api` for simple integration.  
Categorize anime by genres/tags (e.g. action, drama, romance) and map questionnaire answers to keywords.

## Step 1: Backend Setup (Nest.js)

1. Install Nest CLI  
   ```bash
   npm i -g @nestjs/cli
   ```

2. Create project  
   ```bash
   nest new backend --package-manager npm
   ```

3. Enter folder  
   ```bash
   cd backend
   ```

4. Install dependencies  
   ```bash
   npm i @nestjs/typeorm typeorm sqlite3
   ```

5. Install Crunchyroll API client  
   ```bash
   npm i crunchyroll-js-api
   ```

6. Configure TypeORM in `app.module.ts`:
   ```ts
   import { TypeOrmModule } from '@nestjs/typeorm';

   @Module({
     imports: [
       TypeOrmModule.forRoot({
         type: 'sqlite',
         database: 'animes.db',
         entities: [Anime],
         synchronize: true,
       }),
     ],
     // ...
   })
   ```

7. Create Anime entity  
   ```bash
   nest g class anime/entities/anime --no-spec
   ```

   ```ts
   import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

   @Entity()
   export class Anime {
     @PrimaryGeneratedColumn()
     id: number;

     @Column()
     title: string;

     @Column('simple-array')
     genres: string[]; // e.g. ['action', 'drama']

     @Column('simple-array')
     keywords: string[]; // from questionnaire mapping
   }
   ```

8. Create anime service  
   ```bash
   nest g service anime
   ```

   → Integrate API calls, fetch anime, categorize, save to DB if new  
   → Example method: `async getRecommendations(keywords: string[]): Promise<Anime[]>`

9. Create controller  
   ```bash
   nest g controller anime
   ```

   → POST /recommend endpoint  
   → Receives answers → maps to keywords → search DB/API → returns recommendations

10. Run  
    ```bash
    npm run start:dev
    ```

## Step 2: Populate/Categorize Anime (if needed)
Create init script in service to fetch catalog from API, extract genres, add keywords and save to DB.

## Step 3: Frontend Setup (Next.js)

1. Create project  
   ```bash
   npx create-next-app@latest frontend
   ```

2. Enter folder  
   ```bash
   cd frontend
   ```

3. Install axios  
   ```bash
   npm i axios
   ```

4. Create questionnaire page: `pages/index.tsx`  
   - React form with multiple choice questions  
   - Example: "Current mood?" → map to keywords like 'action' for energetic

5. Send answers to backend on submit  
   ```ts
   POST http://localhost:3000/anime/recommend
   ```

6. Display recommendations  
   - Cards with title, genres, maybe image/thumbnail

7. Run  
   ```bash
   npm run dev
   ```

## Step 4: Frontend ↔ Backend Integration
- Frontend → axios POST with answers  
- Backend → map answers → keywords → query API or DB → return filtered anime list

## Step 5: Deploy / Test
- Local test: backend → port 3000, frontend → port 3001  
- Production:  
  - Next.js → Vercel  
  - Nest.js → Railway / Render / Heroku  
  - Enable CORS in backend: `npm i @nestjs/common @nestjs/cors` and use `app.enableCors()`

## Notes
- No authentication / user database  
- Use TypeORM cache if API has rate limits  
- If `crunchyroll-js-api` doesn't work well, test other libraries or adjust search endpoints
