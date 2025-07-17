# Question Form App

A Next.js application with Node.js, PostgreSQL, Tailwind CSS, and Cloudinary for creating, viewing, and deleting questions with sections, subsections, options, and image uploads.

## Setup in GitHub Codespaces
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up PostgreSQL and Cloudinary:
   - The `.env` file is pre-configured with the provided `DATABASE_URL` and Cloudinary credentials.
   - Ensure the PostgreSQL database is accessible externally (Render's external `DATABASE_URL` is used).
   - Create a Cloudinary upload preset named `question_form`:
     - Go to Cloudinary Dashboard > Settings > Upload > Upload Presets.
     - Create a new preset with name `question_form`, set Signing Mode to "Unsigned".
3. Run migrations to create database schema:
   ```bash
   npx prisma migrate dev
   ```
4. Seed dummy data:
   ```bash
   npm run prisma:seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Troubleshoot database issues:
   - Check server logs for errors (e.g., connection refused).
   - Test database connectivity:
     ```bash
     npx prisma db pull
     ```
   - Verify API endpoints with `curl`:
     ```bash
     curl http://localhost:3000/api/sections
     ```

## Features
- **Modern UI**: Enhanced with Tailwind CSS, custom animations, and a clean, responsive design with improved spacing and color combinations.
- **Form Functionality**:
  - Select sections and subsections (subsections depend on selected section).
  - Input question text with single or multi-option question types.
  - Add multiple options with text, marks, and optional image uploads via Cloudinary.
  - Remove options dynamically (minimum one option required).
- **Question Management**:
  - Save questions to PostgreSQL database.
  - View saved questions with collapsible details, including section, subsection, options, and images.
  - Delete questions with confirmation.
- **Image Uploads**: Integrated with Cloudinary for uploading option images.
- **Deployable**: Configured for Vercel deployment with GitHub Actions.

## Seed Data
The seed script (`prisma/seed.js`) populates the database with:
- **Sections**: Physics, Chemistry, Biology, Mathematics, Computer Science
- **Subsections**:
  - Physics: Mechanics, Electromagnetism, Thermodynamics
  - Chemistry: Organic Chemistry, Inorganic Chemistry, Physical Chemistry
  - Biology: Botany, Zoology, Genetics
  - Mathematics: Algebra, Calculus, Geometry
  - Computer Science: Programming, Data Structures, Algorithms

## Vercel Deployment
1. Create a Vercel project and link your GitHub repository.
2. In Vercel, set environment variables:
   - `DATABASE_URL`: Use the provided Render PostgreSQL external URL.
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: `darlgoqdi`
   - `NEXT_PUBLIC_CLOUDINARY_API_KEY`: `271333617256131`
   - `CLOUDINARY_API_SECRET`: `VVKnYUcYu9e8zwCujL6NfG3RRS0`
   - `NODE_ENV`: `production`
3. Configure Vercel build settings:
   - Build Command: `npm ci && npx prisma generate && npx prisma migrate deploy && npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
4. Add GitHub Actions secrets:
   - `VERCEL_TOKEN`: From Vercel Account Settings > Tokens.
   - `VERCEL_ORG_ID`: From Vercel CLI (`vercel --whoami`) or Account Settings.
   - `VERCEL_PROJECT_ID`: From Vercel Project Settings or `vercel projects ls`.
   - `DATABASE_URL`: Use the provided Render PostgreSQL external URL.
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: `darlgoqdi`
   - `NEXT_PUBLIC_CLOUDINARY_API_KEY`: `271333617256131`
   - `CLOUDINARY_API_SECRET`: `VVKnYUcYu9e8zwCujL6NfG3RRS0`
5. Create a Cloudinary upload preset named `question_form` with unsigned mode enabled.
6. Push to the `main` branch to trigger deployment.

## Notes
- **Database**: The provided `DATABASE_URL` is included in `.env`. Ensure Render's PostgreSQL allows external connections.
- **Cloudinary**: The upload preset `question_form` must be created in your Cloudinary dashboard with unsigned uploads enabled.
- **UI Enhancements**: Improved spacing, modern color palette, and animations for a professional look.
- **Error Handling**: Enhanced logging for database, API, and Cloudinary errors.

## Troubleshooting
- **Database errors**: Verify `DATABASE_URL` and test with `npx prisma db pull`.
- **API errors**: Check server logs and test endpoints with `curl`:
  ```bash
  curl -X POST http://localhost:3000/api/questions -H "Content-Type: application/json" -d '{"sectionId":1,"subsectionId":1,"questionText":"Sample question","questionType":"single","options":[{"text":"Option 1","marks":1,"image":null}]}'
  curl -X DELETE http://localhost:3000/api/questions?id=1
  ```
- **Image upload issues**: Ensure Cloudinary credentials and upload preset are correct. Check browser console for errors and verify the Cloudinary script is loaded.
- **Deployment issues**: Review GitHub Actions logs and Vercel deployment logs.
