# Question Form App

A Next.js application with Node.js, PostgreSQL, Tailwind CSS, and Cloudinary for creating, viewing, and deleting questions with sections, subsections, options, and image uploads.


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
   
