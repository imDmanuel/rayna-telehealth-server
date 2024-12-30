import { ConsoleLogger, Injectable, Logger, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private logFilePath: string;

  constructor() {
    super();
    this.logFilePath = path.resolve(__dirname, '../../logs/application.log');

    // Ensure log file exists or create it
    this.ensureLogFile();
  }

  private ensureLogFile() {
    const logDir = path.dirname(this.logFilePath);

    // Ensure the logs directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true }); // Create directory if it doesn't exist
    }

    // Ensure the log file exists
    if (!fs.existsSync(this.logFilePath)) {
      fs.writeFileSync(this.logFilePath, '', { flag: 'w' }); // Create an empty log file
    }
  }

  log(message: string, context?: string) {
    super.log(message, context);
    this.writeToFile('LOG', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.writeToFile('ERROR', message, context, trace);
  }

  warn(message: string, context?: string) {
    super.warn(message, context);
    this.writeToFile('WARN', message, context);
  }

  debug(message: string, context?: string) {
    super.debug(message, context);
    this.writeToFile('DEBUG', message, context);
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context);
    this.writeToFile('VERBOSE', message, context);
  }

  private writeToFile(
    level: Uppercase<LogLevel>,
    message: string,
    context?: string,
    trace?: string,
  ) {
    const logMessage = `${new Date().toISOString()} [${level}] ${context || 'App'}: ${message}${
      trace ? ` - ${trace}` : ''
    }\n`;

    // Write to file asynchronously
    fs.appendFile(this.logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Failed to write log to file:', err);
      }
    });
  }
}
