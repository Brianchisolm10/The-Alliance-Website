# Quick Start Guide

Get the AFYA Wellness shop up and running in minutes!

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for database)
- Stripe account (for payments)

## Automated Setup

Run the setup script to configure everything automatically:

```bash
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

This will:
1. Create `.env.local` with database configuration
2. Start PostgreSQL in Docker
3. Generate Prisma client
4. Run database migrations
5. Seed sample data (including 6 products)

## Manual Setup

If you prefer to set up manually:

### 1. Start Database

```bash
docker-compose up -d
```

### 2. Configure Environment

Create `.env.local`:

```bash
cp .env.example .env.local
```

Add this line:
```
DATABASE_URL="postgresql://afya:afya_dev_password@localhost:5432/afya_wellness"
```

### 3. Set Up Database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Testing the Shop

### 1. Browse Products

Navigate to http://localhost:3000/shop to see the 6 sample products.

### 2. Add to Cart

Click "Add to Cart" on any product. The cart icon in the navigation will show the item count.

### 3. View Cart

Click the cart icon or go to http://localhost:3000/shop/cart

### 4. Checkout (Requires Stripe)

To test checkout, you need to configure Stripe:

1. Create a Stripe account at https://stripe.com
2. Get your test API keys from the Dashboard
3. Add to `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

4. Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any postal code

### 5. Test Donations

During checkout, you can add an optional donation:
- Select a preset amount ($5, $10, $25, $50)
- Or enter a custom amount
- Choose an impact area (optional)

## Sample Data

The seed script creates:

**Admin User:**
- Email: admin@theafya.org
- Password: admin123

**Products (6 items):**
- Premium Resistance Bands Set - $29.99
- AFYA Wellness Journal - $14.99
- Foam Roller - High Density - $34.99
- Nutrition Guide Bundle - $49.99
- AFYA Water Bottle - 32oz - $24.99
- Yoga Mat - Eco-Friendly - $39.99

**Impact Areas:**
- Foundations
- Equipment
- Gear Drive
- Sponsorship

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run type-check       # Check TypeScript

# Database
npx prisma studio        # Open database GUI
npx prisma db push       # Push schema changes
npx prisma db seed       # Seed data
npx prisma migrate dev   # Create migration

# Docker
docker-compose up -d     # Start database
docker-compose down      # Stop database
docker-compose logs      # View logs
```

## Troubleshooting

### "Can't reach database server"

```bash
# Check if database is running
docker ps

# Restart database
docker-compose restart

# View logs
docker-compose logs postgres
```

### "Invalid Prisma Client"

```bash
# Regenerate Prisma client
npx prisma generate
```

### Cart not persisting

- Check browser localStorage
- Clear cache and reload
- Ensure JavaScript is enabled

### Stripe checkout not working

- Verify API keys in `.env.local`
- Check that keys start with `pk_test_` and `sk_test_`
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly

## Next Steps

1. **Configure Stripe Webhooks** (for production):
   - Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Listen for: `checkout.session.completed`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

2. **Add Product Images**:
   - Upload images to your storage (Vercel Blob, S3, etc.)
   - Update product `imageUrl` in database

3. **Customize Products**:
   - Use Prisma Studio to edit products
   - Or create an admin UI for product management

4. **Set Up Email**:
   - Configure Resend or SendGrid
   - Implement order confirmation emails

## Documentation

- [SHOP_IMPLEMENTATION.md](./SHOP_IMPLEMENTATION.md) - Detailed implementation docs
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database setup guide
- [AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md) - Authentication guide

## Support

For issues or questions, check the documentation or contact the AFYA team.
