# Quick Start Guide for Cprice555

## ✅ Step-by-Step Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Brianchisolm10/The-Alliance-Website.git
cd The-Alliance-Website
```

### Step 2: Install Dependencies
```bash
npm install
```
This will take a few minutes. Wait for it to complete.

### Step 3: Set Up Environment Variables
1. Create a new file named `.env` in the root directory (same level as `package.json`)
2. Copy the environment variables I sent you separately
3. Paste them into the `.env` file
4. Save the file

**Important**: Make sure the `.env` file is in the root directory, not in any subfolder.

### Step 4: Set Up the Database
```bash
# Generate Prisma Client
npx prisma generate

# Push database schema to your database
npx prisma db push
```

If you get any errors here, it means your `DATABASE_URL` in the `.env` file might be incorrect.

### Step 5: (Optional) Seed the Database
```bash
npx prisma db seed
```
This will add sample data for testing.

### Step 6: Start the Development Server
```bash
npm run dev
```

The server should start on `http://localhost:3000`

### Step 7: Test the Application
Open your browser and visit:
- `http://localhost:3000` - Home page
- `http://localhost:3000/login` - Login page
- `http://localhost:3000/admin/dashboard` - Admin dashboard (after login)

---

## 🔑 Test Accounts

After seeding the database, you can use:

**Admin Account**:
- Email: admin@theafya.org
- Password: admin123

**User Account**:
- Email: user@theafya.org
- Password: user123

---

## 📁 Project Structure Overview

```
The-Alliance-Website/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login, reset password
│   ├── (portal)/          # User dashboard, assessments
│   ├── admin/             # Admin panel
│   ├── contact/           # Contact page (NEW)
│   └── actions/           # Server actions
├── components/            # React components
├── lib/                   # Utilities and services
├── prisma/               # Database schema
└── public/               # Static files
```

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma studio        # Open database GUI
npx prisma generate      # Regenerate Prisma Client
npx prisma db push       # Push schema changes

# Git
git pull origin main     # Get latest changes
git add .                # Stage changes
git commit -m "message"  # Commit changes
git push origin main     # Push to GitHub
```

---

## 🚀 Making Your First Change

### Test the Workflow:

1. **Pull latest changes**:
   ```bash
   git pull origin main
   ```

2. **Make a small change** (e.g., edit `README.md`):
   ```bash
   echo "# Testing collaboration" >> TEST.md
   ```

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Test: Add test file"
   git push origin main
   ```

4. **Verify on GitHub**: Check that your commit appears on GitHub

---

## 📚 Key Documentation Files

Once you have the project running, check these files:

- `SHARE_WITH_CPRICE555.md` - Complete onboarding guide
- `GITHUB_COLLABORATION_GUIDE.md` - Collaboration best practices
- `CONTACT_PAGE_IMPLEMENTATION.md` - New contact page docs
- `QUICK_START.md` - General quick start guide

---

## ❓ Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database connection errors
- Check your `DATABASE_URL` in `.env`
- Make sure PostgreSQL is running
- Verify database credentials

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Prisma errors
```bash
npx prisma generate
npx prisma db push
```

---

## 🎯 What to Explore First

1. **Home Page** (`/`) - See the public website
2. **Login Page** (`/login`) - Check out the new health facts sidebar
3. **Contact Page** (`/contact`) - NEW! Test the location finder
4. **Admin Dashboard** (`/admin/dashboard`) - Explore admin features
5. **Products** (`/admin/products`) - NEW! Product management
6. **Orders** (`/admin/orders`) - NEW! Order management

---

## 💬 Communication

### Before You Start Working:
1. Pull latest changes: `git pull origin main`
2. Let me know what you're working on

### After Making Changes:
1. Test your changes locally
2. Commit with clear message
3. Push to GitHub
4. Let me know what you changed

---

## 🎉 You're All Set!

If you run into any issues:
1. Check the error message carefully
2. Look in the documentation files
3. Reach out to me

Welcome to the team! 🚀
