// Structured Enterprise Telemetry Logger for KERS F1 Platform

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogBreadcrumb {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: any;
}

class KersLogger {
  private breadcrumbs: LogBreadcrumb[] = [];
  private maxBreadcrumbs: number = 50;

  private log(level: LogLevel, context: string, message: string, data?: any) {
    const entry: LogBreadcrumb = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      data,
    };

    this.breadcrumbs.push(entry);
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }

    const prefix = `[KERS ${level}][${context}]`;
    if (level === 'ERROR') {
      console.error(prefix, message, data || '');
    } else if (level === 'WARN') {
      console.warn(prefix, message, data || '');
    } else {
      console.log(prefix, message, data || '');
    }
  }

  debug(context: string, message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', context, message, data);
    }
  }

  info(context: string, message: string, data?: any) {
    this.log('INFO', context, message, data);
  }

  warn(context: string, message: string, data?: any) {
    this.log('WARN', context, message, data);
  }

  error(context: string, message: string, error?: any) {
    this.log('ERROR', context, message, error);
  }

  getBreadcrumbs(): LogBreadcrumb[] {
    return [...this.breadcrumbs];
  }

  clearBreadcrumbs() {
    this.breadcrumbs = [];
  }
}

export const logger = new KersLogger();
