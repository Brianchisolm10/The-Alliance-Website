# E-Commerce Shop Implementation

This document describes the implementation of the AFYA Wellness e-commerce shop feature.

## Overview

The shop allows users to browse products, add them to a cart, and complete purchases through Stripe. Users can also optionally add donations during checkout.

## Features Implemented

### 1. Product Listing (Task 10.1)
- **Shop Page** (`/shop`): Displays all published products in a grid layout
- **Product Cards**: Show product image, name, description, price, and inventory status
- **Out of Stock Handling**: Products with zero inventory are marked and cannot be added to cart
- **Low Stock Warning**: Shows warning when inventory is below 10 items

### 2. Shopping Cart (Task 10.2)
- **Cart Context**: Global state management using React Context API
- **LocalStorage Persistence**: Cart persists across page refreshes
- **Cart Operations**:
  - Add items to cart
  - Remove items from cart
  - Update item quantities
  - Clear entire cart
- **Cart Page** (`/shop/cart`): Full cart view with item management
- **Cart Button**: Shows cart icon with item count badge in navigation

### 3. Stripe Checkout Integration (Task 10.3)
- **Checkout API** (`/api/checkout`): Creates Stripe checkout sessions
- **Product Validation**: Verifies products exist and have sufficient inventory
- **Checkout Page** (`/shop/checkout`): Collects email and processes payment
- **Stripe Redirect**: Redirects to Stripe hosted checkout page
- **Success/Cancel URLs**: Handles post-payment redirects

### 4. Donation Allocation (Task 10.4)
- **Donation Component**: Allows users to add optional donations during checkout
- **Preset Amounts**: Quick selection buttons for $5, $10, $25, $50
- **Custom Amount**: Input field for custom donation amounts
- **Impact Area Selection**: Choose from 4 impact areas:
  - Foundations
  - Equipment
  - Gear Drive
  - Sponsorship
- **Donation Summary**: Shows donation amount and selected area

### 5. Order Confirmation (Task 10.5)
- **Webhook Handler** (`/api/webhooks/stripe`): Processes Stripe events
- **Order Creation**: Creates order records in database after successful payment
- **Inventory Management**: Automatically decrements product inventory
- **Order API** (`/api/orders/session/[sessionId]`): Fetches order details
- **Confirmation Page** (`/shop/success`): Displays order details and next steps
- **Activity Logging**: Logs order creation events

## Database Schema

The following models are used:

```prisma
model Product {
  id              String    @id @default(cuid())
  name            String
  description     String    @db.Text
  price           Int       // Price in cents
  imageUrl        String?
  inventory       Int       @default(0)
  stripeProductId String?   @unique
  stripePriceId   String?   @unique
  published       Boolean   @default(false)
  orderItems      OrderItem[]
}

model Order {
  id              String      @id @default(cuid())
  userId          String?
  email           String
  status          OrderStatus @default(PENDING)
  total           Int         // Total in cents
  stripePaymentId String?     @unique
  donationAmount  Int?        // Donation in cents
  donationArea    String?
  orderItems      OrderItem[]
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Int      // Price at time of purchase in cents
  order     Order    @relation(fields: [orderId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
}
```

## Environment Variables

Add the following to your `.env` file:

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Setup Instructions

### 1. Set Up Database

First, ensure your PostgreSQL database is running. The easiest way is using Docker:

```bash
docker-compose up -d
```

Then run migrations:

```bash
npx prisma db push
```

For detailed database setup instructions, see [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### 2. Install Dependencies

```bash
npm install stripe @stripe/stripe-js
```

### 3. Configure Stripe

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Add keys to `.env` file
4. Set up webhook endpoint in Stripe Dashboard:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for: `checkout.session.completed`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Seed Sample Products

```bash
npx prisma db seed
```

This will create:
- Admin user (admin@theafya.org / admin123)
- 4 Impact areas
- 3 Sample programs
- 2 Testimonials
- 6 Sample products for the shop

### 5. Test the Shop

1. Start the development server: `npm run dev`
2. Navigate to `/shop`
3. Add products to cart
4. Proceed to checkout
5. Use Stripe test card: `4242 4242 4242 4242`
6. Complete purchase and verify order confirmation

## Stripe Test Cards

Use these test cards in development:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

## File Structure

```
app/
├── shop/
│   ├── page.tsx                    # Shop listing page
│   ├── cart/
│   │   └── page.tsx                # Cart page
│   ├── checkout/
│   │   └── page.tsx                # Checkout page
│   └── success/
│       └── page.tsx                # Order confirmation page
├── api/
│   ├── checkout/
│   │   └── route.ts                # Create checkout session
│   ├── orders/
│   │   └── session/
│   │       └── [sessionId]/
│   │           └── route.ts        # Get order by session
│   └── webhooks/
│       └── stripe/
│           └── route.ts            # Stripe webhook handler

components/
└── shop/
    ├── product-card.tsx            # Product display card
    ├── products-grid.tsx           # Product grid layout
    ├── shopping-cart.tsx           # Cart UI component
    ├── cart-button.tsx             # Cart icon with badge
    ├── donation-allocation.tsx     # Donation selection UI
    ├── order-confirmation.tsx      # Order confirmation UI
    └── index.ts                    # Exports

lib/
├── cart/
│   └── cart-context.tsx            # Cart state management
└── stripe/
    └── index.ts                    # Stripe client configuration
```

## Future Enhancements

- Email notifications for order confirmation
- Order tracking and status updates
- Product reviews and ratings
- Product categories and filtering
- Product search functionality
- Wishlist feature
- Admin product management UI
- Inventory alerts for low stock
- Discount codes and promotions
- Shipping address collection
- Multiple payment methods

## Notes

- All prices are stored in cents to avoid floating-point issues
- Cart data persists in localStorage
- Inventory is automatically decremented after successful payment
- Donations are added as separate line items in Stripe
- Orders are created via webhook to ensure reliability
- Activity logs track all order creation events
