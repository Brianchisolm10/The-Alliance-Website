# Importing AFYA Project into a New Kiro Account

## Overview
This guide shows you how to import the AFYA Wellness Platform repository into a new Kiro account so you can continue working on the same codebase from multiple locations.

## Prerequisites
- ✅ GitHub repository created and pushed (see GITHUB_SETUP_INSTRUCTIONS.md)
- ✅ New Kiro account or different Kiro installation
- ✅ GitHub repository URL

## Method 1: Clone from GitHub (Recommended)

### Step 1: Get Repository URL
From your GitHub repository page:
```
https://github.com/YOUR_USERNAME/afya-wellness-platform
```

### Step 2: Open New Kiro Account
1. Launch Kiro IDE
2. Sign in to your Kiro account

### Step 3: Clone Repository
In Kiro:
1. Click "File" → "Open Folder" or use Command Palette
2. Select "Clone Repository"
3. Enter your GitHub repository URL:
   ```
   https://github.com/YOUR_USERNAME/afya-wellness-platform.git
   ```
4. Choose a local directory to clone into
5. Wait for clone to complete

### Step 4: Open Project
1. Kiro will prompt to open the cloned folder
2. Click "Open" or "Open in New Window"
3. Wait for Kiro to index the project

### Step 5: Install Dependencies
Open Kiro terminal and run:
```bash
npm install
```

### Step 6: Set Up Environment
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your environment variables:
   - Database URL
   - NextAuth secret
   - Resend API key
   - Stripe keys
   - etc.

### Step 7: Set Up Database
```bash
# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### Step 8: Verify Setup
```bash
# Type check
npm run type-check

# Start dev server
npm run dev
```

Visit `http://localhost:3000` to verify the app works.

## Method 2: Download and Import

If you can't clone directly:

### Step 1: Download from GitHub
1. Go to your repository on GitHub
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file

### Step 2: Open in Kiro
1. Open Kiro
2. File → Open Folder
3. Select the extracted folder
4. Follow Steps 5-8 from Method 1

## Method 3: Using Git Command Line

If Kiro's Git integration isn't working:

### Step 1: Clone via Terminal
```bash
# Navigate to your projects directory
cd ~/projects

# Clone the repository
git clone https://github.com/YOUR_USERNAME/afya-wellness-platform.git

# Enter the directory
cd afya-wellness-platform
```

### Step 2: Open in Kiro
1. Open Kiro
2. File → Open Folder
3. Select the cloned `afya-wellness-platform` folder
4. Follow Steps 5-8 from Method 1

## Syncing Changes Between Kiro Accounts

### Pushing Changes from Account A
```bash
# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

### Pulling Changes in Account B
```bash
# Fetch latest changes
git fetch origin

# Pull changes
git pull origin main

# Install any new dependencies
npm install

# Run migrations if schema changed
npx prisma migrate dev
```

## Best Practices for Multi-Account Workflow

### 1. Always Pull Before Starting Work
```bash
git pull origin main
```

### 2. Commit Frequently
```bash
git add .
git commit -m "Descriptive message"
git push origin main
```

### 3. Use Branches for Features
```bash
# Create feature branch
git checkout -b feature/new-feature

# Work on feature
# ...

# Push branch
git push origin feature/new-feature

# Create Pull Request on GitHub
# Merge when ready
```

### 4. Keep .env Files Separate
- Never commit `.env` files
- Each Kiro account should have its own `.env`
- Use `.env.example` as a template

### 5. Handle Conflicts
If you get merge conflicts:
```bash
# Pull with rebase
git pull --rebase origin main

# Resolve conflicts in Kiro
# Then continue
git rebase --continue

# Push
git push origin main
```

## Verification Checklist

After importing into new Kiro account:

- [ ] All 249 files present
- [ ] `node_modules/` folder exists (after npm install)
- [ ] `.env` file created and configured
- [ ] Database connected
- [ ] Migrations run successfully
- [ ] `npm run dev` starts without errors
- [ ] Can access app at localhost:3000
- [ ] Kiro can read all files
- [ ] Git integration working
- [ ] Can commit and push changes

## Project Structure Overview

After import, you should see:

```
afya-wellness-platform/
├── .kiro/                    # Kiro specs (synced)
├── .git/                     # Git history (synced)
├── node_modules/             # NOT synced (install locally)
├── .env                      # NOT synced (create locally)
├── app/                      # Synced
├── components/               # Synced
├── lib/                      # Synced
├── prisma/                   # Synced
├── public/                   # Synced
└── [all other files]         # Synced
```

## Common Issues and Solutions

### Issue: "npm install" fails
**Solution**: 
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Database connection fails
**Solution**:
1. Check `.env` has correct `DATABASE_URL`
2. Ensure PostgreSQL is running
3. Test connection:
   ```bash
   npx prisma db pull
   ```

### Issue: Prisma client errors
**Solution**:
```bash
# Regenerate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### Issue: Git authentication fails
**Solution**:
1. Use Personal Access Token instead of password
2. Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Issue: Port 3000 already in use
**Solution**:
```bash
# Use different port
PORT=3001 npm run dev
```

### Issue: TypeScript errors
**Solution**:
```bash
# Reinstall dependencies
npm install

# Check types
npm run type-check
```

## Environment Variables Needed

Create `.env` with these variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/afya_wellness"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Email
EMAIL_FROM="noreply@theafya.org"
RESEND_API_KEY="re_..."

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Storage
BLOB_READ_WRITE_TOKEN="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/..."
```

## Quick Start Commands

After importing:

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Set up database
npx prisma migrate dev
npx prisma db seed

# Start development
npm run dev
```

## Keeping Multiple Accounts in Sync

### Daily Workflow

**Morning (Account A):**
```bash
git pull origin main
npm install  # if package.json changed
npx prisma migrate dev  # if schema changed
npm run dev
```

**Evening (Account A):**
```bash
git add .
git commit -m "Completed task X"
git push origin main
```

**Next Day (Account B):**
```bash
git pull origin main
npm install
npx prisma migrate dev
npm run dev
```

### Using GitHub as Source of Truth

- ✅ Always push completed work
- ✅ Always pull before starting
- ✅ Commit frequently with clear messages
- ✅ Use branches for experimental work
- ✅ Keep .env files local (never commit)

## Support

If you encounter issues:
1. Check this guide
2. Check GitHub repository issues
3. Review error messages in Kiro terminal
4. Check Kiro documentation
5. Verify all environment variables are set

## Summary

**To import into new Kiro account:**
1. Clone from GitHub
2. Run `npm install`
3. Create `.env` file
4. Run database migrations
5. Start development server

**To sync between accounts:**
1. Push changes from Account A
2. Pull changes in Account B
3. Install dependencies if needed
4. Run migrations if needed

---

**Your repository is now the single source of truth!**
All Kiro accounts will work with the same codebase via GitHub.
