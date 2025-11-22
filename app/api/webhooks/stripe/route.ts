import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { customer_email, metadata, amount_total, id: stripePaymentId } = session;

  if (!customer_email || !amount_total) {
    console.error('Missing required session data');
    return;
  }

  // Retrieve line items to get product details
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
  });

  const donationAmount = parseInt(metadata?.donationAmount || '0');
  const donationArea = metadata?.donationArea || null;

  // Find user by email (if exists)
  const user = await prisma.user.findUnique({
    where: { email: customer_email },
  });

  // Create order
  const order = await prisma.order.create({
    data: {
      userId: user?.id,
      email: customer_email,
      status: 'PROCESSING',
      total: amount_total,
      stripePaymentId,
      donationAmount: donationAmount > 0 ? donationAmount : null,
      donationArea,
    },
  });

  // Create order items (excluding donation line item)
  for (const item of lineItems.data) {
    const stripeProduct = item.price?.product;
    const productName = typeof stripeProduct === 'string' 
      ? stripeProduct 
      : stripeProduct && 'name' in stripeProduct ? stripeProduct.name : undefined;

    // Skip donation line items
    if (productName === 'Donation') continue;

    // Find product in database by name
    const dbProduct = await prisma.product.findFirst({
      where: { name: productName },
    });

    if (dbProduct) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: dbProduct.id,
          quantity: item.quantity || 1,
          price: item.price?.unit_amount || 0,
        },
      });

      // Update inventory
      await prisma.product.update({
        where: { id: dbProduct.id },
        data: {
          inventory: {
            decrement: item.quantity || 1,
          },
        },
      });
    }
  }

  // Log activity
  if (user) {
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'ORDER_CREATED',
        resource: 'Order',
        details: {
          orderId: order.id,
          total: amount_total,
          donationAmount,
        },
      },
    });
  }

  // TODO: Send order confirmation email
  console.log(`Order created: ${order.id} for ${customer_email}`);
}
