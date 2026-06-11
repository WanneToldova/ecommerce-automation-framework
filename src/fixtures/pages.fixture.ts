import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products-list.page';
import { ProductPage } from '../pages/product-details.page';
import { CartPage } from '../pages/cart.page';
import { LoginPage } from '../pages/login.page';
import { RegistrationPage } from '../pages/registration.page';
import { logger } from '../utils/logger';

/**
 * The set of page objects exposed to every test via dependency injection.
 */
interface Pages {
  homePage: HomePage;
  productsPage: ProductsPage;
  productPage: ProductPage;
  cartPage: CartPage;
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
}

/**
 * Extended `test` object.
 *
 * Instead of `new HomePage(page)` in every test, tests just declare the page
 * objects they need in their arguments and Playwright builds them lazily.
 * This is the idiomatic Playwright POM pattern — composition over a fat base
 * test class — and keeps tests declarative and readable.
 */
export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
});

// Third-party ad/analytics networks can inject overlays and slow page loads,
// causing flakiness on this ad-supported practice site. Blocking them at the
// network layer makes the suite faster and far more deterministic — and it's a
// realistic technique for stabilising tests against ad-heavy pages.
const BLOCKED_HOSTS =
  /(googlesyndication|doubleclick|googletagmanager|google-analytics|adservice|fundingchoicesmessages|ad\.plus|adsterra)/;

test.beforeEach(async ({ page }, testInfo) => {
  await page.route(BLOCKED_HOSTS, (route) => route.abort());
  logger.info(`▶ START: ${testInfo.titlePath.join(' › ')}`);
});

test.afterEach(async ({}, testInfo) => {
  const icon = testInfo.status === testInfo.expectedStatus ? '✔' : '✘';
  logger.info(
    `${icon} END:   ${testInfo.titlePath.join(' › ')} — ${testInfo.status} (${testInfo.duration}ms)`,
  );
});

export { expect } from '@playwright/test';
