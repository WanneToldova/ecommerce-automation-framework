import * as fs from 'fs';
import * as path from 'path';
import winston from 'winston';
import { config } from '../config/env.config';

const LOG_DIR = path.resolve(process.cwd(), 'logs');

// Ensure the log directory exists before winston tries to write to it.
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Console format: colourised, human-readable, timestamped.
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
  winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`),
);

/**
 * File format: plain timestamped lines, no colour codes, easy to grep/CI-archive.
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`),
);

/**
 * Shared logger used across the framework — page objects log their actions,
 * the custom reporter logs test outcomes, and tests can log domain steps.
 *
 * Output goes to:
 *   - the console (level controlled by LOG_LEVEL),
 *   - logs/test-run.log    (everything at the configured level),
 *   - logs/error.log       (errors only — fast triage in CI).
 */
export const logger = winston.createLogger({
  level: config.logLevel,
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'test-run.log'),
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'error.log'),
      level: 'error',
      format: fileFormat,
    }),
  ],
});
