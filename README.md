# AFYA Wellness Website

A Happier, Healthier You. Your Way.

## Overview

AFYA is a wellness-tech platform on a mission to make elite-level fitness, nutrition, and health education universally accessible. Built with the ethos of community, discipline, and joy, AFYA delivers automated, science-backed programs to youth, adults, and educators—rooted in equity, powered by automation, and guided by empathy.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **Email**: Resend or SendGrid
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository

2. Install dependencies:

```bash
npm install
```

3. Set up the database (using Docker):

```bash
docker-compose up -d
```

4. Copy `.env.example` to `.env.local` and configure your environment variables:

```bash
cp .env.example .env.local
```

Add this to your `.env.local`:
```
DATABASE_URL="postgresql://afya:afya_dev_password@localhost:5432/afya_wellness"
```

5. Run database migrations:

```bash
npx prisma db push
```

6. Seed the database with sample data:

```bash
npm run prisma:seed
```

7. Run the development server:

```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

For detailed database setup instructions, see [DATABASE_SETUP.md](./DATABASE_SETUP.md)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
afya-wellness/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes
│   ├── (auth)/            # Auth routes
│   ├── (portal)/          # Client portal
│   ├── (admin)/           # Admin panel
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities and configs
├── types/                 # TypeScript types
├── public/                # Static assets
└── prisma/                # Database schema
```

## Development Philosophy

**Build Like Lego: Simple Foundation, Then Complexity**

- Simple implementations first, complex features later
- Each feature must be stable before moving to the next
- Modular architecture that allows independent development and testing
- Think smarter, not harder - validate core functionality before expanding

## Contributing

This is a private project. For questions or contributions, contact the AFYA team.

## License

Private and Confidential
