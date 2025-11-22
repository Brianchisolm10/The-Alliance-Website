# AFYA Project - Information for Cprice555

## Repository Information

**Repository URL**: https://github.com/Brianchisolm10/The-Alliance-Website

**Your GitHub Username**: Cprice555

## Getting Started

### 1. Accept the Collaboration Invitation

You should receive an email from GitHub with an invitation to collaborate on this repository. Click the link in the email to accept.

### 2. Clone the Repository

```bash
git clone https://github.com/Brianchisolm10/The-Alliance-Website.git
cd The-Alliance-Website
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory with the following content:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_your_stripe_public_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Email (Resend)
RESEND_API_KEY="re_your_resend_api_key"
EMAIL_FROM="noreply@theafya.org"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Note**: The actual values for these environment variables will be shared with you separately through a secure channel.

### 5. Set Up the Database

```bash
# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# (Optional) Seed the database with sample data
npx prisma db seed
```

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
afya-client-portal/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication pages (login, reset password)
│   ├── (portal)/                 # User portal (dashboard, assessments, packets)
│   ├── admin/                    # Admin panel
│   │   ├── dashboard/            # Admin dashboard
│   │   ├── users/                # User management
│   │   ├── clients/              # Client management
│   │   ├── packets/              # Packet management
│   │   ├── products/             # Product management (NEW)
│   │   ├── orders/               # Order management (NEW)
│   │   └── content/              # Content management
│   ├── actions/                  # Server actions
│   ├── api/                      # API routes
│   ├── contact/                  # Contact page (NEW)
│   └── start/                    # Discovery form
├── components/                   # React components
│   ├── admin/                    # Admin-specific components
│   ├── auth/                     # Auth components (NEW)
│   ├── contact/                  # Contact page components (NEW)
│   ├── forms/                    # Form components
│   ├── layouts/                  # Layout components
│   └── ui/                       # UI components
├── lib/                          # Utility libraries
│   ├── assessments/              # Assessment logic
│   ├── email/                    # Email service
│   ├── libraries/                # Exercise & nutrition libraries
│   ├── pdf/                      # PDF generation
│   ├── storage/                  # File storage
│   ├── validations/              # Zod validation schemas
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Prisma client
│   └── stripe/                   # Stripe integration
├── prisma/                       # Database schema and migrations
└── public/                       # Static assets
```

## Recent Updates (What's New)

### 1. Product & Order Management System
- Full CRUD for products with Stripe integration
- Inventory management
- Order tracking and fulfillment
- Email notifications for order status changes
- Admin interfaces at `/admin/products` and `/admin/orders`

### 2. Contact Page
- Contact information and social media links
- Contact form with database integration
- Wellness resources map with geolocation
- Location-based finder for gyms, parks, hospitals, etc.
- Available at `/contact`

### 3. Enhanced Authentication
- Fixed login page Zod validation issues
- Added health facts sidebar to login page
- Integrated public header/footer for consistent navigation
- Updated discovery form page

### 4. Admin Dashboard Improvements
- Enhanced notifications center
- Improved user and client management
- Better navigation and organization

## Key Features

### For Users
- **Assessments**: Modular wellness assessments
- **Packets**: Personalized wellness packets (PDF generation)
- **Tools**: BMR/TDEE calculator, plate builder, heart rate zones, etc.
- **Programs**: Browse wellness programs
- **Shop**: Purchase products with Stripe integration
- **Impact**: Donations and gear drive

### For Admins
- **Dashboard**: Overview of system metrics
- **User Management**: Create, edit, manage users
- **Client Management**: Track clients, notes, assignments
- **Packet Management**: Edit, publish, version control
- **Product Management**: Manage shop products and inventory
- **Order Management**: Track and fulfill orders
- **Content Management**: Manage programs, testimonials, impact areas
- **Libraries**: Exercise and nutrition libraries

## Important Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma studio        # Open Prisma Studio (database GUI)
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema changes to database
npx prisma db seed       # Seed database with sample data

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking

# Git
git pull origin main     # Pull latest changes
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push origin main     # Push to GitHub
```

## Collaboration Workflow

### Before Starting Work
```bash
git pull origin main
```

### After Making Changes
```bash
git add .
git commit -m "Descriptive message about your changes"
git push origin main
```

### Best Practices
1. Pull before you start working
2. Commit frequently with clear messages
3. Test your changes before pushing
4. Communicate about major changes
5. Use feature branches for large features (optional)

## Testing the Application

### Test Accounts
After seeding the database, you can use these test accounts:

**Admin Account**:
- Email: admin@theafya.org
- Password: (will be provided separately)

**User Account**:
- Email: user@theafya.org
- Password: (will be provided separately)

### Key Pages to Test

**Public Pages**:
- `/` - Home page
- `/about` - About page
- `/programs` - Programs listing
- `/shop` - Shop
- `/contact` - Contact page (NEW)
- `/start` - Discovery form
- `/login` - Login page

**User Portal** (requires login):
- `/dashboard` - User dashboard
- `/assessments` - Wellness assessments
- `/packets` - User packets
- `/tools` - Wellness tools

**Admin Panel** (requires admin login):
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/clients` - Client management
- `/admin/packets` - Packet management
- `/admin/products` - Product management (NEW)
- `/admin/orders` - Order management (NEW)
- `/admin/content` - Content management

## Documentation

Key documentation files in the repository:
- `GITHUB_COLLABORATION_GUIDE.md` - Detailed collaboration guide
- `CONTACT_PAGE_IMPLEMENTATION.md` - Contact page documentation
- `QUICK_START.md` - Quick start guide
- `AUTH_IMPLEMENTATION.md` - Authentication documentation
- `SHOP_IMPLEMENTATION.md` - Shop feature documentation
- Various completion documents in `.kiro/specs/afya-client-portal/`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **PDF Generation**: React-PDF
- **Payments**: Stripe
- **Email**: Resend
- **File Storage**: Local storage (can be upgraded to S3)

## Need Help?

If you run into any issues:

1. Check the documentation files in the repository
2. Review the error messages carefully
3. Check the console logs (browser and terminal)
4. Reach out to the team for assistance

## Security Notes

- **Never commit `.env` files** to the repository
- **Never commit API keys or secrets** to the repository
- Use environment variables for all sensitive data
- The `.gitignore` file is already configured to exclude sensitive files

## Next Steps

1. Accept the GitHub collaboration invitation
2. Clone the repository
3. Set up your environment variables (will be provided separately)
4. Install dependencies and set up the database
5. Run the development server
6. Explore the codebase and test the features
7. Start contributing!

---

**Welcome to the AFYA team! 🎉**

If you have any questions, don't hesitate to reach out.
