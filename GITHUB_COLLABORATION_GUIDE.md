# GitHub Collaboration Guide - Adding Cprice555

## Overview
This guide will help you share your AFYA project with Cprice555 on GitHub and grant them edit permissions.

## Prerequisites
- You need to have the repository already pushed to GitHub
- You need to be the owner or have admin access to the repository

## Step 1: Ensure Your Code is Pushed to GitHub

First, make sure all your latest changes are committed and pushed:

```bash
# Check current status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Add product/order management, contact page, and UI improvements"

# Push to GitHub
git push origin main
```

## Step 2: Add Cprice555 as a Collaborator

### Option A: Through GitHub Website (Recommended)

1. **Go to your repository on GitHub**
   - Navigate to: `https://github.com/YOUR_USERNAME/afya-client-portal`

2. **Access Settings**
   - Click on the "Settings" tab (top right of the repository page)

3. **Navigate to Collaborators**
   - In the left sidebar, click "Collaborators and teams"
   - Or go directly to: `https://github.com/YOUR_USERNAME/afya-client-portal/settings/access`

4. **Add Collaborator**
   - Click the green "Add people" button
   - Type: `Cprice555`
   - Select the user from the dropdown
   - Click "Add Cprice555 to this repository"

5. **Set Permission Level**
   - Choose permission level:
     - **Write** - Can read, clone, and push to the repository (recommended for collaboration)
     - **Maintain** - Write access plus manage issues and pull requests
     - **Admin** - Full access including settings

6. **Send Invitation**
   - GitHub will send an email invitation to Cprice555
   - They need to accept the invitation to gain access

### Option B: Through GitHub CLI

If you have GitHub CLI installed:

```bash
# Add collaborator with write access
gh repo add-collaborator Cprice555 --permission write

# Or with admin access
gh repo add-collaborator Cprice555 --permission admin
```

## Step 3: Notify Cprice555

After adding them as a collaborator, let Cprice555 know:

1. **They will receive an email invitation** from GitHub
2. **They need to accept the invitation** by clicking the link in the email
3. **Share the repository URL** with them:
   ```
   https://github.com/YOUR_USERNAME/afya-client-portal
   ```

## Step 4: Cprice555's Setup Process

Once they accept the invitation, they can:

### Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/afya-client-portal.git
cd afya-client-portal
```

### Install Dependencies
```bash
npm install
```

### Set Up Environment Variables
They'll need to create a `.env` file with:
```env
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="your_stripe_key"
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="your_stripe_public_key"
RESEND_API_KEY="your_resend_key"
EMAIL_FROM="noreply@theafya.org"
```

### Run Database Migrations
```bash
npx prisma generate
npx prisma db push
```

### Start Development Server
```bash
npm run dev
```

## Collaboration Workflow

### For Cprice555 (Making Changes)

1. **Pull latest changes before starting work**
   ```bash
   git pull origin main
   ```

2. **Create a new branch for features** (optional but recommended)
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

4. **Push changes**
   ```bash
   # If on main branch
   git push origin main
   
   # If on feature branch
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request** (if using feature branches)
   - Go to GitHub repository
   - Click "Pull requests" > "New pull request"
   - Select your branch and create PR

### For You (Repository Owner)

1. **Review Pull Requests** (if using feature branches)
   - Review code changes
   - Leave comments or approve
   - Merge when ready

2. **Pull changes made by Cprice555**
   ```bash
   git pull origin main
   ```

## Best Practices for Collaboration

### 1. Communication
- Discuss major changes before implementing
- Use GitHub Issues for tracking tasks
- Use Pull Requests for code review

### 2. Branch Strategy (Recommended)
```bash
main          # Production-ready code
├── dev       # Development branch
├── feature/* # Feature branches
└── fix/*     # Bug fix branches
```

### 3. Commit Messages
Use clear, descriptive commit messages:
```bash
# Good
git commit -m "Add user authentication with NextAuth"
git commit -m "Fix login form validation error"

# Avoid
git commit -m "updates"
git commit -m "fix"
```

### 4. Before Pushing
Always:
1. Pull latest changes: `git pull origin main`
2. Test your code: `npm run build`
3. Check for errors: `npm run lint`
4. Commit and push

### 5. Handling Conflicts
If you both edit the same file:
```bash
# Pull latest changes
git pull origin main

# Git will show conflicts
# Open conflicted files and resolve
# Look for markers: <<<<<<< HEAD, =======, >>>>>>>

# After resolving
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

## Removing Collaborator Access (If Needed)

If you need to remove access later:

1. Go to repository Settings > Collaborators
2. Find Cprice555 in the list
3. Click the "Remove" button next to their name

## Troubleshooting

### Cprice555 Can't See the Repository
- Make sure they accepted the invitation email
- Check they're logged into the correct GitHub account
- Verify the invitation was sent to the correct username

### Permission Denied Errors
- Ensure they accepted the collaboration invitation
- Check their permission level (should be "Write" or higher)
- They may need to set up SSH keys or use HTTPS with token

### Merge Conflicts
- Communicate about who's working on what files
- Pull frequently to stay up to date
- Use feature branches to isolate changes

## Quick Reference Commands

```bash
# Check repository status
git status

# Pull latest changes
git pull origin main

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push changes
git push origin main

# Create new branch
git checkout -b branch-name

# Switch branches
git checkout branch-name

# View all branches
git branch -a

# Delete local branch
git branch -d branch-name
```

## Additional Resources

- [GitHub Docs - Inviting Collaborators](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository)
- [Git Collaboration Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [Resolving Merge Conflicts](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-using-the-command-line)

## Summary

1. ✅ Push your code to GitHub
2. ✅ Add Cprice555 as collaborator through Settings > Collaborators
3. ✅ Set permission to "Write" or "Admin"
4. ✅ Cprice555 accepts invitation email
5. ✅ Cprice555 clones repository and sets up environment
6. ✅ Both of you can now collaborate!

---

**Note**: Make sure to share any necessary API keys, database credentials, and environment variables with Cprice555 through a secure channel (not through GitHub commits).
