import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import { logger } from '../utils/logger';

/**
 * A lightweight custom reporter.
 *
 * Playwright already produces a rich HTML report; this reporter's job is to
 * funnel a concise, human-readable summary of the run into our winston logs
 * (console + logs/test-run.log). That gives us a single, greppable execution
 * record in CI alongside the interactive HTML report — satisfying both the
 * "logging" and "reporting" requirements with one consistent output.
 */
export default class LoggingReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private flaky = 0;

  onBegin(config: FullConfig, suite: Suite): void {
    const total = suite.allTests().length;
    logger.info('═'.repeat(60));
    logger.info(`Test run starting: ${total} test(s) across ${config.projects.length} project(s).`);
    logger.info('═'.repeat(60));
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const title = test.titlePath().filter(Boolean).join(' › ');
    switch (result.status) {
      case 'passed':
        if (result.retry > 0) this.flaky++;
        else this.passed++;
        logger.info(`PASS  (${result.duration}ms) ${title}`);
        break;
      case 'skipped':
        this.skipped++;
        logger.warn(`SKIP  ${title}`);
        break;
      case 'timedOut':
      case 'interrupted':
      case 'failed':
        this.failed++;
        logger.error(`FAIL  (${result.duration}ms) ${title}`);
        if (result.error?.message) {
          logger.error(`      ↳ ${result.error.message.split('\n')[0]}`);
        }
        break;
    }
  }

  onEnd(result: FullResult): Promise<void> | void {
    logger.info('═'.repeat(60));
    logger.info(
      `Run finished: ${result.status.toUpperCase()} — ` +
        `${this.passed} passed, ${this.failed} failed, ${this.skipped} skipped, ${this.flaky} flaky.`,
    );
    logger.info(`Duration: ${(result.duration / 1000).toFixed(1)}s`);
    logger.info('HTML report: reports/html (run `npm run report` to open).');
    logger.info('═'.repeat(60));
  }
}
