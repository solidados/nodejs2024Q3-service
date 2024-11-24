import { ConsoleLogger, Injectable } from '@nestjs/common';

import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import * as process from 'node:process';
import * as fsPromises from 'node:fs/promises';

import { LOG_LEVELS } from './logger.enums';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly level: number;
  private readonly maxSize: number;
  private logCount: number = 1;
  private errorCount: number = 1;
  private warnCount: number = 1;
  private readonly logDir: string = join(process.cwd(), 'logs');
  private readonly logExt = '.log';
  private readonly LEVEL_THRESHOLDS = {
    [LOG_LEVELS.ERROR]: 0,
    [LOG_LEVELS.WARN]: 1,
    [LOG_LEVELS.LOG]: 2,
    [LOG_LEVELS.VERBOSE]: 3,
    [LOG_LEVELS.DEBUG]: 4,
  };

  constructor() {
    super();
    this.level = parseInt(process.env.LOG_LEVEL ?? '2', 10);
    this.maxSize = parseInt(process.env.LOG_SIZE ?? '100000', 10);
  }

  error(message: string, trace: string, context?: string) {
    if (this.shouldLog(LOG_LEVELS.ERROR))
      this.createLog(
        LOG_LEVELS.ERROR,
        `${message}\n${trace}`,
        context || this.context,
      ).catch((error) => super.error(`Failed to log message ${error.message}`));
  }

  warn(message: string, context: string) {
    if (this.shouldLog(LOG_LEVELS.WARN))
      this.createLog(LOG_LEVELS.WARN, message, context || this.context).catch(
        (error) => super.error(`Failed to log message ${error.message}`),
      );
  }

  log(message: string, context: string) {
    if (this.shouldLog(LOG_LEVELS.LOG))
      this.createLog(LOG_LEVELS.LOG, message, context || this.context).catch(
        (error) => super.error(`Failed to log message ${error.message}`),
      );
  }

  verbose(message: string, context: string) {
    if (this.shouldLog(LOG_LEVELS.VERBOSE))
      this.createLog(
        LOG_LEVELS.VERBOSE,
        message,
        context || this.context,
      ).catch((error) => super.error(`Failed to log message ${error.message}`));
  }

  debug(message: string, context: string) {
    if (this.shouldLog(LOG_LEVELS.DEBUG))
      this.createLog(LOG_LEVELS.DEBUG, message, context || this.context).catch(
        (error) => super.error(`Failed to log message ${error.message}`),
      );
  }

  private formatLogMessage(
    level: string,
    message: string,
    context?: string,
  ): string {
    const timestamp: string = this.getTimestamp();
    const colorize = (msg: string): string => {
      switch (level) {
        case LOG_LEVELS.ERROR:
          return `\x1b[31m${msg}\x1b[0m`;
        case LOG_LEVELS.WARN:
          return `\x1b[33m${msg}\x1b[0m`;
        case LOG_LEVELS.DEBUG:
          return `\x1b[34m${msg}\x1b[0m`;
        default:
          return `\x1b[32m${msg}\x1b[0m`;
      }
    };
    return colorize(
      `[${timestamp}] [${level.toUpperCase()}] [${context || ''}] - [${message}]\n`,
    );
  }

  private shouldLog(level: LOG_LEVELS): boolean {
    return this.level >= this.LEVEL_THRESHOLDS[level];
  }

  private async writeLogToFile(
    count: number,
    message: string,
    fileName: string,
  ) {
    try {
      if (!existsSync(this.logDir))
        await fsPromises.mkdir(this.logDir, { recursive: true });

      let filePath: string = resolve(
        this.logDir,
        `${fileName}_${count}${this.logExt}`,
      );

      if (!existsSync(filePath)) await fsPromises.writeFile(filePath, '');

      const stats = await fsPromises.stat(filePath);
      const size = stats.size;
      if (size >= this.maxSize) count += 1;

      filePath = resolve(this.logDir, `${fileName}_${count}${this.logExt}`);
      await fsPromises.writeFile(filePath, message, { flag: 'a' });

      return count;
    } catch (error) {
      super.error(
        `\x1b[31m[LoggerService] Failed to write log to file: ${error.message}\x1b[0m`,
      );
      return count;
    }
  }

  private async createLog(level: string, message: string, context: string) {
    const logMessage = this.formatLogMessage(level, message, context);
    super[level](logMessage);

    switch (level) {
      case LOG_LEVELS.ERROR:
        this.errorCount = await this.writeLogToFile(
          this.errorCount,
          logMessage,
          'errors',
        );
        break;

      case LOG_LEVELS.WARN:
        this.warnCount = await this.writeLogToFile(
          this.warnCount,
          logMessage,
          'warnings',
        );
        break;

      default:
        this.logCount = await this.writeLogToFile(
          this.logCount,
          logMessage,
          'logs',
        );
        break;
    }
  }
}
