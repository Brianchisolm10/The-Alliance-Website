/**
 * Email service for sending notifications
 * Uses Resend API
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@theafya.org';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: SendEmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email send');
      return { success: false, error: 'Email service not configured' };
    }

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
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
