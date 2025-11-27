/**
 * Email service for sending notifications
 * Uses Resend API with retry logic and activity logging
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@theafya.org';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // Start with 1 second
const RETRY_BACKOFF_MULTIPLIER = 2; // Exponential backoff

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  data?: any;
  error?: string;
  attempts?: number;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Log email activity to console (can be extended to database logging)
 */
function logEmailActivity(
  type: 'success' | 'error' | 'retry',
  recipient: string,
  subject: string,
  details?: any
) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    type,
    recipient,
    subject,
    details,
  };

  if (type === 'error') {
    console.error('[Email Service]', logEntry);
  } else if (type === 'retry') {
    console.warn('[Email Service]', logEntry);
  } else {
    console.log('[Email Service]', logEntry);
  }

  // TODO: Store in database for admin visibility
  // This can be extended to write to an EmailLog table in the database
}

/**
 * Send an email using Resend with retry logic
 */
export async function sendEmail(
  options: SendEmailOptions,
  retryCount = 0
): Promise<EmailResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      const error = 'RESEND_API_KEY not configured, skipping email send';
      console.warn(error);
      logEmailActivity('error', options.to, options.subject, { error });
      return { success: false, error, attempts: retryCount + 1 };
    }

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    logEmailActivity('success', options.to, options.subject, {
      emailId: result.data?.id,
      attempts: retryCount + 1,
    });

    return { success: true, data: result, attempts: retryCount + 1 };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send email';

    // Check if we should retry
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF_MULTIPLIER, retryCount);

      logEmailActivity('retry', options.to, options.subject, {
        error: errorMessage,
        attempt: retryCount + 1,
        nextRetryIn: `${delay}ms`,
      });

      await sleep(delay);
      return sendEmail(options, retryCount + 1);
    }

    // Max retries reached
    logEmailActivity('error', options.to, options.subject, {
      error: errorMessage,
      attempts: retryCount + 1,
      maxRetriesReached: true,
    });

    console.error('Error sending email after retries:', error);
    return {
      success: false,
      error: errorMessage,
      attempts: retryCount + 1,
    };
  }
}

/**
 * Send an email without retry logic (for non-critical emails)
 */
export async function sendEmailNoRetry(
  options: SendEmailOptions
): Promise<EmailResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      const error = 'RESEND_API_KEY not configured, skipping email send';
      console.warn(error);
      return { success: false, error, attempts: 1 };
    }

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    logEmailActivity('success', options.to, options.subject, {
      emailId: result.data?.id,
    });

    return { success: true, data: result, attempts: 1 };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send email';

    logEmailActivity('error', options.to, options.subject, {
      error: errorMessage,
    });

    console.error('Error sending email:', error);
    return {
      success: false,
      error: errorMessage,
      attempts: 1,
    };
  }
}

/**
 * Send packet published notification to client
 */
export async function sendPacketPublishedEmail(
  clientEmail: string,
  clientName: string,
  packetType: string
) {
  const subject = 'Your Personalized Wellness Packet is Ready!';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #2563eb; margin-bottom: 20px;">Your Wellness Packet is Ready!</h1>
          
          <p>Hi ${clientName},</p>
          
          <p>Great news! Your personalized <strong>${packetType.replace(/_/g, ' ')}</strong> packet has been published and is now available in your portal.</p>
          
          <p>This packet has been carefully crafted based on your assessment responses and tailored to your specific needs and goals.</p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin-top: 0;">What's Next?</h2>
            <ol style="padding-left: 20px;">
              <li style="margin-bottom: 10px;">Log in to your AFYA portal</li>
              <li style="margin-bottom: 10px;">Navigate to your packets section</li>
              <li style="margin-bottom: 10px;">Download and review your personalized packet</li>
              <li style="margin-bottom: 10px;">Start implementing your wellness plan</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Your Packet</a>
          </div>
          
          <p style="margin-top: 30px;">If you have any questions about your packet or need guidance on implementation, please don't hesitate to reach out to your coach.</p>
          
          <p style="margin-top: 20px;">To your health and happiness,<br>
          <strong>The AFYA Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This email was sent by AFYA Wellness<br>
            <a href="${APP_URL}" style="color: #2563eb;">theafya.org</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${clientName},

Great news! Your personalized ${packetType.replace(/_/g, ' ')} packet has been published and is now available in your portal.

This packet has been carefully crafted based on your assessment responses and tailored to your specific needs and goals.

What's Next?
1. Log in to your AFYA portal
2. Navigate to your packets section
3. Download and review your personalized packet
4. Start implementing your wellness plan

View your packet: ${APP_URL}/dashboard

If you have any questions about your packet or need guidance on implementation, please don't hesitate to reach out to your coach.

To your health and happiness,
The AFYA Team

---
This email was sent by AFYA Wellness
${APP_URL}
  `.trim();

  return sendEmail({
    to: clientEmail,
    subject,
    html,
    text,
  });
}

/**
 * Send account setup email
 */
export async function sendAccountSetupEmail(
  email: string,
  name: string,
  setupToken: string
) {
  const setupUrl = `${APP_URL}/setup/${setupToken}`;
  const subject = 'Welcome to AFYA - Set Up Your Account';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #2563eb; margin-bottom: 20px;">Welcome to AFYA!</h1>
          
          <p>Hi ${name},</p>
          
          <p>Your AFYA account has been created. Click the button below to set up your password and complete your profile.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${setupUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Set Up Account</a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">This link will expire in 7 days.</p>
          
          <p style="margin-top: 30px;">If you didn't request this account, please ignore this email.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>
          <strong>The AFYA Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This email was sent by AFYA Wellness<br>
            <a href="${APP_URL}" style="color: #2563eb;">theafya.org</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

Your AFYA account has been created. Visit the link below to set up your password and complete your profile:

${setupUrl}

This link will expire in 7 days.

If you didn't request this account, please ignore this email.

Best regards,
The AFYA Team

---
This email was sent by AFYA Wellness
${APP_URL}
  `.trim();

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
) {
  const resetUrl = `${APP_URL}/reset-password/${resetToken}`;
  const subject = 'Reset Your AFYA Password';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #2563eb; margin-bottom: 20px;">Reset Your Password</h1>
          
          <p>Hi ${name},</p>
          
          <p>We received a request to reset your password. Click the button below to create a new password.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">This link will expire in 1 hour.</p>
          
          <p style="margin-top: 30px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>
          <strong>The AFYA Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This email was sent by AFYA Wellness<br>
            <a href="${APP_URL}" style="color: #2563eb;">theafya.org</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

We received a request to reset your password. Visit the link below to create a new password:

${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email or contact support if you have concerns.

Best regards,
The AFYA Team

---
This email was sent by AFYA Wellness
${APP_URL}
  `.trim();

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  email: string,
  customerName: string,
  orderId: string,
  orderTotal: number,
  orderItems: Array<{ name: string; quantity: number; price: number }>,
  donationAmount?: number
) {
  const subject = `Order Confirmation - Order #${orderId.substring(0, 8)}`;

  const itemsHtml = orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(item.price / 100).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #16a34a; margin-bottom: 20px;">Order Confirmed!</h1>
          
          <p>Hi ${customerName},</p>
          
          <p>Thank you for your order! We've received your purchase and are processing it now.</p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">Order Details</h2>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">Order ID: ${orderId}</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 15px 10px 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                  <td style="padding: 15px 10px 10px; text-align: right; font-weight: bold;">$${(orderTotal / 100).toFixed(2)}</td>
                </tr>
                ${
                  donationAmount
                    ? `
                <tr>
                  <td colspan="2" style="padding: 5px 10px; text-align: right; color: #16a34a;">Donation:</td>
                  <td style="padding: 5px 10px; text-align: right; color: #16a34a;">$${(donationAmount / 100).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 10px 10px 15px; text-align: right; font-weight: bold; font-size: 18px;">Total:</td>
                  <td style="padding: 10px 10px 15px; text-align: right; font-weight: bold; font-size: 18px;">$${((orderTotal + donationAmount) / 100).toFixed(2)}</td>
                </tr>
                `
                    : ''
                }
              </tfoot>
            </table>
          </div>
          
          ${
            donationAmount
              ? `
          <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <p style="margin: 0; color: #166534;"><strong>Thank you for your donation!</strong></p>
            <p style="margin: 5px 0 0; color: #166534;">Your contribution of $${(donationAmount / 100).toFixed(2)} helps us make wellness accessible to everyone.</p>
          </div>
          `
              : ''
          }
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">What's Next?</h2>
            <p style="margin: 10px 0;">We'll send you another email when your order ships with tracking information.</p>
            <p style="margin: 10px 0;">You can view your order status anytime by logging into your account.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Order Status</a>
          </div>
          
          <p style="margin-top: 30px;">Thank you for supporting AFYA! Your purchase helps us continue our mission to make elite-level wellness accessible to everyone.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>
          <strong>The AFYA Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This email was sent by AFYA Wellness<br>
            <a href="${APP_URL}" style="color: #2563eb;">theafya.org</a> | <a href="mailto:afya@theafya.org" style="color: #2563eb;">afya@theafya.org</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const itemsText = orderItems
    .map((item) => `${item.name} x${item.quantity} - $${(item.price / 100).toFixed(2)}`)
    .join('\n');

  const text = `
Hi ${customerName},

Thank you for your order! We've received your purchase and are processing it now.

Order Details
Order ID: ${orderId}

Items:
${itemsText}

Subtotal: $${(orderTotal / 100).toFixed(2)}
${donationAmount ? `Donation: $${(donationAmount / 100).toFixed(2)}\nTotal: $${((orderTotal + donationAmount) / 100).toFixed(2)}` : ''}

${donationAmount ? `Thank you for your donation! Your contribution of $${(donationAmount / 100).toFixed(2)} helps us make wellness accessible to everyone.\n\n` : ''}What's Next?
We'll send you another email when your order ships with tracking information.
You can view your order status anytime by logging into your account.

View Order Status: ${APP_URL}/dashboard

Thank you for supporting AFYA! Your purchase helps us continue our mission to make elite-level wellness accessible to everyone.

Best regards,
The AFYA Team

---
This email was sent by AFYA Wellness
${APP_URL} | afya@theafya.org
  `.trim();

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

/**
 * Send donation receipt email
 */
export async function sendDonationReceiptEmail(
  email: string,
  donorName: string,
  donationId: string,
  amount: number,
  allocation: Record<string, number>,
  date: Date
) {
  const subject = 'Thank You for Your Donation - Tax Receipt';

  const allocationHtml = Object.entries(allocation)
    .filter(([_, value]) => value > 0)
    .map(
      ([area, value]) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${area.replace(/_/g, ' ')}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(value / 100).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #16a34a; margin-bottom: 20px;">Thank You for Your Donation!</h1>
          
          <p>Dear ${donorName},</p>
          
          <p>Thank you for your generous donation to AFYA Wellness. Your support helps us make elite-level fitness, nutrition, and health education universally accessible.</p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0; border: 2px solid #16a34a;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">Tax Receipt</h2>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">Donation ID: ${donationId}</p>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">Date: ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Impact Area</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${allocationHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding: 15px 10px 10px; text-align: right; font-weight: bold; font-size: 18px;">Total Donation:</td>
                  <td style="padding: 15px 10px 10px; text-align: right; font-weight: bold; font-size: 18px; color: #16a34a;">$${(amount / 100).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #1e40af;"><strong>Tax Information:</strong></p>
            <p style="margin: 10px 0 0; font-size: 14px; color: #1e40af;">AFYA Wellness is a registered 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law. Please retain this receipt for your tax records.</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">Your Impact</h2>
            <p>Your donation directly supports:</p>
            <ul style="padding-left: 20px;">
              <li style="margin-bottom: 8px;">Free wellness programs for underserved communities</li>
              <li style="margin-bottom: 8px;">Equipment and resources for youth programs</li>
              <li style="margin-bottom: 8px;">Educational content and health tools</li>
              <li style="margin-bottom: 8px;">Sponsorships for individuals who cannot afford services</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px;">Together, we're building a healthier, happier world. Thank you for being part of our mission!</p>
          
          <p style="margin-top: 20px;">With gratitude,<br>
          <strong>The AFYA Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This email was sent by AFYA Wellness<br>
            <a href="${APP_URL}" style="color: #2563eb;">theafya.org</a> | <a href="mailto:afya@theafya.org" style="color: #2563eb;">afya@theafya.org</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const allocationText = Object.entries(allocation)
    .filter(([_, value]) => value > 0)
    .map(([area, value]) => `${area.replace(/_/g, ' ')}: $${(value / 100).toFixed(2)}`)
    .join('\n');

  const text = `
Dear ${donorName},

Thank you for your generous donation to AFYA Wellness. Your support helps us make elite-level fitness, nutrition, and health education universally accessible.

TAX RECEIPT
Donation ID: ${donationId}
Date: ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Allocation:
${allocationText}

Total Donation: $${(amount / 100).toFixed(2)}

Tax Information:
AFYA Wellness is a registered 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law. Please retain this receipt for your tax records.

Your Impact:
Your donation directly supports:
- Free wellness programs for underserved communities
- Equipment and resources for youth programs
- Educational content and health tools
- Sponsorships for individuals who cannot afford services

Together, we're building a healthier, happier world. Thank you for being part of our mission!

With gratitude,
The AFYA Team

---
This email was sent by AFYA Wellness
${APP_URL} | afya@theafya.org
  `.trim();

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

/**
 * Send gear drive confirmation email
 */
export async function sendGearDriveConfirmationEmail(
  email: string,
  donorName: string,
  submissionId: string,
  items: Array<{ type: string; description: string; condition: string }>,
  preference: string
) {
  const subject = 'Gear Drive Donation Received - Thank You!';

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.type}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.condition}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #16a34a; margin-bottom: 20px;">Thank You for Your Gear Donation!</h1>
          
          <p>Hi ${donorName},</p>
          
          <p>We've received your gear drive donation submission. Thank you for helping us equip our community with the resources they need to pursue their wellness goals!</p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">Donation Details</h2>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">Submission ID: ${submissionId}</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Type</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Description</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Condition</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <p style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
              <strong>Preference:</strong> ${preference}
            </p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0; font-size: 16px;">What Happens Next?</h3>
            <p style="margin: 10px 0; color: #1e40af;">Our team will review your donation and reach out within 2-3 business days to coordinate ${preference === 'PICKUP' ? 'pickup' : 'drop-off'} details.</p>
            <p style="margin: 10px 0 0; color: #1e40af;">We'll contact you at this email address with next steps.</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">Your Impact</h2>
            <p>Your donated equipment will:</p>
            <ul style="padding-left: 20px;">
              <li style="margin-bottom: 8px;">Help individuals who cannot afford fitness equipment</li>
              <li style="margin-bottom: 8px;">Support youth programs and community initiatives</li>
              <li style="margin-bottom: 8px;">Enable more people to pursue their wellness goals</li>
              <li style="margin-bottom: 8px;">Reduce waste and promote sustainability</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px;">Thank you for being part of our mission to make wellness accessible to everyone. Your generosity makes a real difference!</p>
          
          <p style="margin-top: 20px;">With gratitude,<br>
          <strong>The AFYA Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            Questions? Contact us at <a href="mailto:afya@theafya.org" style="color: #2563eb;">afya@theafya.org</a><br>
            <a href="${APP_URL}" style="color: #2563eb;">theafya.org</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const itemsText = items
    .map((item) => `${item.type}: ${item.description} (${item.condition})`)
    .join('\n');

  const text = `
Hi ${donorName},

We've received your gear drive donation submission. Thank you for helping us equip our community with the resources they need to pursue their wellness goals!

Donation Details
Submission ID: ${submissionId}

Items:
${itemsText}

Preference: ${preference}

What Happens Next?
Our team will review your donation and reach out within 2-3 business days to coordinate ${preference === 'PICKUP' ? 'pickup' : 'drop-off'} details.
We'll contact you at this email address with next steps.

Your Impact:
Your donated equipment will:
- Help individuals who cannot afford fitness equipment
- Support youth programs and community initiatives
- Enable more people to pursue their wellness goals
- Reduce waste and promote sustainability

Thank you for being part of our mission to make wellness accessible to everyone. Your generosity makes a real difference!

With gratitude,
The AFYA Team

---
Questions? Contact us at afya@theafya.org
${APP_URL}
  `.trim();

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

/**
 * Send discovery form confirmation email
 */
export async function sendDiscoveryConfirmationEmail(
  email: string,
  name: string,
  schedulingUrl?: string
) {
  const subject = 'Welcome to AFYA - Next Steps';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #2563eb; margin-bottom: 20px;">Welcome to AFYA!</h1>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for taking the first step toward a happier, healthier you! We've received your discovery form and are excited to help you on your wellness journey.</p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">What's Next?</h2>
            <ol style="padding-left: 20px;">
              <li style="margin-bottom: 15px;">
                <strong>Schedule Your Discovery Call</strong><br>
                <span style="color: #6b7280;">Book a 30-minute call with our team to discuss your goals and how AFYA can support you.</span>
              </li>
              <li style="margin-bottom: 15px;">
                <strong>Personalized Assessment</strong><br>
                <span style="color: #6b7280;">After your call, you'll receive access to our portal where you can complete assessments tailored to your needs.</span>
              </li>
              <li style="margin-bottom: 15px;">
                <strong>Get Your Custom Packet</strong><br>
                <span style="color: #6b7280;">Based on your assessment, we'll create a personalized wellness packet with actionable guidance.</span>
              </li>
            </ol>
          </div>
          
          ${
            schedulingUrl
              ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${schedulingUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Schedule Your Discovery Call</a>
          </div>
          `
              : `
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;">Our team will reach out within 1-2 business days to schedule your discovery call.</p>
          </div>
          `
          }
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">While You Wait</h2>
            <p>Explore our free resources:</p>
            <ul style="padding-left: 20px;">
              <li style="margin-bottom: 8px;"><a href="${APP_URL}/tools" style="color: #2563eb;">Health Tools</a> - BMR calculator, plate builder, and more</li>
              <li style="margin-bottom: 8px;"><a href="${APP_URL}/programs" style="color: #2563eb;">Programs</a> - Learn about our wellness programs</li>
              <li style="margin-bottom: 8px;"><a href="${APP_URL}/impact" style="color: #2563eb;">Our Impact</a> - See how we're making wellness accessible</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px;">We're here to support you every step of the way. If you have any questions, don't hesitate to reach out!</p>
          
          <p style="margin-top: 20px;">To your health and happiness,<br>
          <strong>The AFYA Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            Questions? Contact us at <a href="mailto:afya@theafya.org" style="color: #2563eb;">afya@theafya.org</a><br>
            <a href="${APP_URL}" style="color: #2563eb;">theafya.org</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

Thank you for taking the first step toward a happier, healthier you! We've received your discovery form and are excited to help you on your wellness journey.

What's Next?

1. Schedule Your Discovery Call
   Book a 30-minute call with our team to discuss your goals and how AFYA can support you.

2. Personalized Assessment
   After your call, you'll receive access to our portal where you can complete assessments tailored to your needs.

3. Get Your Custom Packet
   Based on your assessment, we'll create a personalized wellness packet with actionable guidance.

${schedulingUrl ? `Schedule Your Discovery Call: ${schedulingUrl}` : 'Our team will reach out within 1-2 business days to schedule your discovery call.'}

While You Wait:
Explore our free resources:
- Health Tools: ${APP_URL}/tools - BMR calculator, plate builder, and more
- Programs: ${APP_URL}/programs - Learn about our wellness programs
- Our Impact: ${APP_URL}/impact - See how we're making wellness accessible

We're here to support you every step of the way. If you have any questions, don't hesitate to reach out!

To your health and happiness,
The AFYA Team

---
Questions? Contact us at afya@theafya.org
${APP_URL}
  `.trim();

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

/**
 * Send order status update email
 */
export async function sendOrderStatusEmail(
  email: string,
  customerName: string,
  orderId: string,
  status: string,
  orderTotal: number,
  orderItems: Array<{ name: string; quantity: number; price: number }>
) {
  const statusMessages: Record<string, { title: string; message: string; color: string }> = {
    PROCESSING: {
      title: 'Order Confirmed',
      message: 'Your order has been confirmed and is being processed.',
      color: '#2563eb',
    },
    SHIPPED: {
      title: 'Order Shipped',
      message: 'Your order has been shipped and is on its way to you!',
      color: '#7c3aed',
    },
    DELIVERED: {
      title: 'Order Delivered',
      message: 'Your order has been delivered. We hope you enjoy your purchase!',
      color: '#16a34a',
    },
    CANCELLED: {
      title: 'Order Cancelled',
      message: 'Your order has been cancelled. If you have questions, please contact support.',
      color: '#dc2626',
    },
    REFUNDED: {
      title: 'Order Refunded',
      message: 'Your order has been refunded. The amount will be returned to your original payment method.',
      color: '#6b7280',
    },
  };

  const statusInfo = statusMessages[status] || {
    title: 'Order Update',
    message: `Your order status has been updated to ${status}.`,
    color: '#2563eb',
  };

  const subject = `${statusInfo.title} - Order #${orderId.substring(0, 8)}`;

  const itemsHtml = orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(item.price / 100).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: ${statusInfo.color}; margin-bottom: 20px;">${statusInfo.title}</h1>
          
          <p>Hi ${customerName},</p>
          
          <p>${statusInfo.message}</p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">Order Details</h2>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">Order ID: ${orderId}</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 15px 10px 10px; text-align: right; font-weight: bold;">Total:</td>
                  <td style="padding: 15px 10px 10px; text-align: right; font-weight: bold; font-size: 18px;">$${(orderTotal / 100).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          ${
            status === 'DELIVERED'
              ? `
          <p style="margin-top: 30px;">Thank you for supporting AFYA! Your purchase helps us make wellness accessible to everyone.</p>
          `
              : ''
          }
          
          <p style="margin-top: 20px;">If you have any questions about your order, please don't hesitate to contact us.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>
          <strong>The AFYA Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This email was sent by AFYA Wellness<br>
            <a href="${APP_URL}" style="color: #2563eb;">theafya.org</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const itemsText = orderItems
    .map((item) => `${item.name} x${item.quantity} - $${(item.price / 100).toFixed(2)}`)
    .join('\n');

  const text = `
Hi ${customerName},

${statusInfo.message}

Order Details
Order ID: ${orderId}

Items:
${itemsText}

Total: $${(orderTotal / 100).toFixed(2)}

${status === 'DELIVERED' ? 'Thank you for supporting AFYA! Your purchase helps us make wellness accessible to everyone.\n\n' : ''}If you have any questions about your order, please don't hesitate to contact us.

Best regards,
The AFYA Team

---
This email was sent by AFYA Wellness
${APP_URL}
  `.trim();

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

/**
 * Send contact form notification to admin
 */
export async function sendContactFormNotification(
  name: string,
  email: string,
  subject: string,
  message: string,
  submissionId: string
) {
  const adminEmail = 'afya@theafya.org';
  const emailSubject = `New Contact Form Submission: ${subject}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailSubject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #2563eb; margin-bottom: 20px;">New Contact Form Submission</h1>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">Contact Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Subject:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Submission ID:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-family: monospace; font-size: 12px;">${submissionId}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">Message</h2>
            <p style="white-space: pre-wrap; color: #374151; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;"><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reply to ${name}</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This notification was sent by AFYA Contact Form System<br>
            <a href="${APP_URL}" style="color: #2563eb;">theafya.org</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
New Contact Form Submission

Contact Details:
Name: ${name}
Email: ${email}
Subject: ${subject}
Submission ID: ${submissionId}

Message:
${message}

Action Required: Please respond to this inquiry within 24 hours.

Reply to ${name}: mailto:${email}?subject=Re: ${subject}

---
This notification was sent by AFYA Contact Form System
${APP_URL}
  `.trim();

  return sendEmail({
    to: adminEmail,
    subject: emailSubject,
    html,
    text,
  });
}

/**
 * Send contact form confirmation to submitter
 */
export async function sendContactFormConfirmation(
  name: string,
  email: string,
  subject: string
) {
  const confirmationSubject = 'We Received Your Message - AFYA Wellness';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${confirmationSubject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #2563eb; margin-bottom: 20px;">Thank You for Contacting Us!</h1>
          
          <p>Hi ${name},</p>
          
          <p>We've received your message and appreciate you reaching out to AFYA Wellness. Our team will review your inquiry and respond within 24 hours.</p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 16px;">Your Message</h2>
            <p style="color: #6b7280; margin: 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;"><strong>What's Next?</strong></p>
            <p style="margin: 10px 0 0; color: #1e40af;">Our team will review your message and get back to you at ${email} within 24 hours.</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">While You Wait</h2>
            <p>Explore our resources:</p>
            <ul style="padding-left: 20px;">
              <li style="margin-bottom: 8px;"><a href="${APP_URL}/tools" style="color: #2563eb;">Health Tools</a> - Free calculators and wellness tools</li>
              <li style="margin-bottom: 8px;"><a href="${APP_URL}/programs" style="color: #2563eb;">Programs</a> - Explore our wellness programs</li>
              <li style="margin-bottom: 8px;"><a href="${APP_URL}/about" style="color: #2563eb;">About Us</a> - Learn more about AFYA's mission</li>
              <li style="margin-bottom: 8px;"><a href="${APP_URL}/impact" style="color: #2563eb;">Our Impact</a> - See how we're making a difference</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px;">Thank you for your interest in AFYA. We look forward to connecting with you!</p>
          
          <p style="margin-top: 20px;">Best regards,<br>
          <strong>The AFYA Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This email was sent by AFYA Wellness<br>
            <a href="${APP_URL}" style="color: #2563eb;">theafya.org</a> | <a href="mailto:afya@theafya.org" style="color: #2563eb;">afya@theafya.org</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

We've received your message and appreciate you reaching out to AFYA Wellness. Our team will review your inquiry and respond within 24 hours.

Your Message
Subject: ${subject}

What's Next?
Our team will review your message and get back to you at ${email} within 24 hours.

While You Wait:
Explore our resources:
- Health Tools: ${APP_URL}/tools - Free calculators and wellness tools
- Programs: ${APP_URL}/programs - Explore our wellness programs
- About Us: ${APP_URL}/about - Learn more about AFYA's mission
- Our Impact: ${APP_URL}/impact - See how we're making a difference

Thank you for your interest in AFYA. We look forward to connecting with you!

Best regards,
The AFYA Team

---
This email was sent by AFYA Wellness
${APP_URL} | afya@theafya.org
  `.trim();

  return sendEmail({
    to: email,
    subject: confirmationSubject,
    html,
    text,
  });
}
