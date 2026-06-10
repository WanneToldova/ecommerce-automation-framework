import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from '../config/routes';
import { logger } from '../utils/logger';
import { NewUser } from '../data/test-data';

/**
 * The account registration journey.
 *
 * Automation Exercise splits signup into two steps:
 *   1. /login — "New User Signup!" form (name + email).
 *   2. /signup — "Enter Account Information" form (password, DOB, address...).
 *
 * Because this is a dedicated test environment that permits account creation
 * (unlike a production retail site), we run the full end-to-end flow and assert
 * the "Account Created!" confirmation — exactly the kind of journey you would
 * automate against a test/staging environment but not against live production.
 */
export class RegistrationPage extends BasePage {
  protected readonly path = routes.signup;

  // Step 1 — initial signup form
  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupButton: Locator;
  readonly emailExistsError: Locator;

  // Step 2 — account information form
  readonly titleMr: Locator;
  readonly password: Locator;
  readonly days: Locator;
  readonly months: Locator;
  readonly years: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly company: Locator;
  readonly address: Locator;
  readonly country: Locator;
  readonly state: Locator;
  readonly city: Locator;
  readonly zipcode: Locator;
  readonly mobileNumber: Locator;
  readonly createAccountButton: Locator;

  // Confirmation
  readonly accountCreated: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    this.signupName = page.locator('input[data-qa="signup-name"]');
    this.signupEmail = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    this.emailExistsError = page.getByText(/email address already exist/i);

    this.titleMr = page.locator('#id_gender1');
    this.password = page.locator('#password');
    this.days = page.locator('#days');
    this.months = page.locator('#months');
    this.years = page.locator('#years');
    this.firstName = page.locator('#first_name');
    this.lastName = page.locator('#last_name');
    this.company = page.locator('#company');
    this.address = page.locator('#address1');
    this.country = page.locator('#country');
    this.state = page.locator('#state');
    this.city = page.locator('#city');
    this.zipcode = page.locator('#zipcode');
    this.mobileNumber = page.locator('#mobile_number');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');

    this.accountCreated = page.locator('[data-qa="account-created"]');
    this.continueButton = page.locator('a[data-qa="continue-button"]');
  }

  /** Step 1: enter name + email and submit to reach the details form. */
  async startSignup(name: string, email: string): Promise<void> {
    logger.info(`Starting signup for ${email}.`);
    await this.waitForVisible(this.signupName);
    await this.fill(this.signupName, name, 'signup name');
    await this.fill(this.signupEmail, email, 'signup email');
    await this.click(this.signupButton, 'signup button');
  }

  /** Step 2: complete the account information form. */
  async fillAccountInformation(user: NewUser): Promise<void> {
    logger.info('Filling account information.');
    await this.waitForVisible(this.password);
    await this.titleMr.check();
    await this.fill(this.password, user.password, 'password');
    await this.days.selectOption(user.dateOfBirth.day);
    await this.months.selectOption(user.dateOfBirth.month);
    await this.years.selectOption(user.dateOfBirth.year);
    await this.fill(this.firstName, user.firstName, 'first name');
    await this.fill(this.lastName, user.lastName, 'last name');
    await this.fill(this.company, user.company, 'company');
    await this.fill(this.address, user.address, 'address');
    await this.country.selectOption(user.country);
    await this.fill(this.state, user.state, 'state');
    await this.fill(this.city, user.city, 'city');
    await this.fill(this.zipcode, user.zipcode, 'zipcode');
    await this.fill(this.mobileNumber, user.mobileNumber, 'mobile number');
  }

  /** Submits the completed account information form. */
  async submitAccount(): Promise<void> {
    logger.info('Creating the account.');
    await this.click(this.createAccountButton, 'create account button');
  }

  /** Full end-to-end registration. */
  async register(user: NewUser): Promise<void> {
    await this.startSignup(user.name, user.email);
    await this.fillAccountInformation(user);
    await this.submitAccount();
  }

  /** Asserts the "Account Created!" confirmation is shown. */
  async assertAccountCreated(): Promise<void> {
    await expect(this.accountCreated).toBeVisible({ timeout: 15000 });
  }
}
