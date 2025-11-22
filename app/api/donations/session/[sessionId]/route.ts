import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Check if donation already exists
    let donation = await prisma.donation.findUnique({
      where: { stripePaymentId: session.payment_intent as string },
    });

    // If not, create it
    if (!donation) {
      const allocation = session.metadata?.allocation
        ? JSON.parse(session.metadata.allocation)
        : { general: 100 };

      donation = await prisma.donation.create({
        data: {
          email: session.customer_email || session.customer_details?.email || '',
          amount: session.amount_total || 0,
          allocation,
          stripePaymentId: session.payment_intent as string,
          receiptSent: false,
        },
      });

      // TODO: Send confirmation email with tax receipt
      // This would be implemented in the email system (task 21)
    }

    return NextResponse.json({
      id: donation.id,
      email: donation.email,
      amount: donation.amount,
      allocation: donation.allocation,
      createdAt: donation.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donation details' },
      { status: 500 }
    );
  }
}
