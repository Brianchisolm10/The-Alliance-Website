import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Health Check Endpoint
 * 
 * Returns the health status of the application and its dependencies.
 * Used by monitoring services to check if the application is running properly.
 * 
 * @returns JSON response with health status
 */
export async function GET() {
  const startTime = Date.now();
  
  const checks = {
    status: 'healthy' as 'healthy' | 'unhealthy' | 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    responseTime: 0,
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    checks: {
      database: {
        status: 'unknown' as 'healthy' | 'unhealthy',
        responseTime: 0,
        message: '',
      },
      storage: {
        status: 'healthy' as 'healthy' | 'unhealthy',
        message: 'Storage check not implemented',
      },
      email: {
        status: 'healthy' as 'healthy' | 'unhealthy',
        message: 'Email check not implemented',
      },
    },
  };

  // Check database connection
  try {
    const dbStartTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    checks.checks.database.responseTime = Date.now() - dbStartTime;
    checks.checks.database.status = 'healthy';
    checks.checks.database.message = 'Database connection successful';
  } catch (error) {
    checks.checks.database.status = 'unhealthy';
    checks.checks.database.message = error instanceof Error ? error.message : 'Database connection failed';
    checks.status = 'unhealthy';
  }

  // Check storage (Vercel Blob)
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      checks.checks.storage.status = 'healthy';
      checks.checks.storage.message = 'Storage configured';
    } else {
      checks.checks.storage.status = 'unhealthy';
      checks.checks.storage.message = 'Storage not configured';
      checks.status = 'degraded';
    }
  } catch (error) {
    checks.checks.storage.status = 'unhealthy';
    checks.checks.storage.message = error instanceof Error ? error.message : 'Storage check failed';
    checks.status = 'degraded';
  }

  // Check email service
  try {
    if (process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY) {
      checks.checks.email.status = 'healthy';
      checks.checks.email.message = 'Email service configured';
    } else {
      checks.checks.email.status = 'unhealthy';
      checks.checks.email.message = 'Email service not configured';
      checks.status = 'degraded';
    }
  } catch (error) {
    checks.checks.email.status = 'unhealthy';
    checks.checks.email.message = error instanceof Error ? error.message : 'Email check failed';
    checks.status = 'degraded';
  }

  // Calculate total response time
  checks.responseTime = Date.now() - startTime;

  // Determine HTTP status code
  const statusCode = checks.status === 'healthy' ? 200 : checks.status === 'degraded' ? 200 : 503;

  return NextResponse.json(checks, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
