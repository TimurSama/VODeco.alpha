/**
 * Monitoring middleware for API routes
 * Adds request ID, logging, and error tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger, generateRequestId } from './logger';

export interface MonitoringContext {
  requestId: string;
  startTime: number;
  method: string;
  path: string;
}

export function withMonitoring(
  handler: (req: NextRequest, context: MonitoringContext) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const method = req.method;
    const path = req.nextUrl.pathname;

    logger.setRequestId(requestId);

    const monitoringContext: MonitoringContext = {
      requestId,
      startTime,
      method,
      path,
    };

    try {
      const response = await handler(req, monitoringContext);
      
      const duration = Date.now() - startTime;
      const statusCode = response.status;

      logger.logApiRequest(method, path, statusCode, duration, {
        requestId,
        userAgent: req.headers.get('user-agent'),
        ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      });

      // Add request ID to response headers
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Response-Time', `${duration}ms`);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error(`API Error: ${method} ${path}`, error, {
        requestId,
        duration,
        method,
        path,
      });

      return NextResponse.json(
        {
          error: 'Internal server error',
          requestId,
        },
        {
          status: 500,
          headers: {
            'X-Request-ID': requestId,
          },
        }
      );
    }
  };
}
