import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, allocation } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Minimum donation amount is $1.00' },
        { status: 400 }
      );
    }

    if (!allocation || typeof allocation !== 'object') {
      return NextResponse.json(
        { error: 'Allocation is required' },
        { status: 400 }
      );
    }

    // Validate allocation totals 100%
    const totalAllocation = Object.values(allocation).reduce(
      (sum: number, val) => sum + (typeof val === 'number' ? val : 0),
      0
    );

    if (totalAllocation !== 100) {
      return NextResponse.json(
        { error: 'Allocation must total 100%' },
        { status: 400 }
      );
    }

    // Create description based on allocation
    const allocationDescription = Object.entries(allocation)
      .filter(([_, percentage]) => percentage > 0)
      .map(([area, percentage]) => `${percentage}% to ${area}`)
      .join(', ');

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation to AFYA',
              description: `Your donation: ${allocationDescription}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/impact/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/impact/donate`,
      customer_email: email,
      metadata: {
        type: 'donation',
        allocation: JSON.stringify(allocation),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json(
      { error: 'Failed to process donation' },
      { status: 500 }
    );
  }
}
