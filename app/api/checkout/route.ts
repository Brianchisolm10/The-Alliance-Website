import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email, donationAmount, donationArea } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate products and calculate total
    const productIds = items.map((item: any) => item.id);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        published: true,
      },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: 'Some products are not available' },
        { status: 400 }
      );
    }

    // Check inventory
    for (const item of items) {
      const product = products.find((p) => p.id === item.id);
      if (!product || product.inventory < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient inventory for ${product?.name || 'product'}` },
          { status: 400 }
        );
      }
    }

    // Calculate total
    const donation = donationAmount || 0;

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.id);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product!.name,
            description: product!.description,
            images: product!.imageUrl ? [product!.imageUrl] : [],
          },
          unit_amount: product!.price,
        },
        quantity: item.quantity,
      };
    });

    // Add donation as a line item if present
    if (donation > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Donation',
            description: donationArea ? `Donation to ${donationArea}` : 'Donation to AFYA',
          },
          unit_amount: donation,
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/cart`,
      customer_email: email,
      metadata: {
        donationAmount: donation.toString(),
        donationArea: donationArea || '',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
