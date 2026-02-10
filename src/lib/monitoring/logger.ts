/**
 * Centralized logging utility
 * Supports different log levels and can be extended with Sentry/Logtail
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private requestId?: string;
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  setRequestId(requestId: string) {
    this.requestId = requestId;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const requestId = this.requestId ? `[${this.requestId}]` : '';
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()} ${requestId} ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    if (this.isDevelopment || this.isProduction) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
    // TODO: Send to Sentry/Logtail in production
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    };
    
    console.error(this.formatMessage('error', message, errorContext));
    
    // TODO: Send to Sentry in production
    if (this.isProduction && error instanceof Error) {
      // Sentry.captureException(error, { extra: context });
    }
  }

  // API-specific logging
  logApiRequest(method: string, path: string, statusCode: number, duration: number, context?: LogContext) {
    const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    const message = `${method} ${path} ${statusCode} (${duration}ms)`;
    this[level](message, context);
  }

  // Performance logging
  logPerformance(operation: string, duration: number, context?: LogContext) {
    if (duration > 1000) {
      this.warn(`Slow operation: ${operation} took ${duration}ms`, context);
    } else {
      this.debug(`Performance: ${operation} took ${duration}ms`, context);
    }
  }
}

// Singleton instance
export const logger = new Logger();

// Request ID generator
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
