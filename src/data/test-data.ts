import { faker } from '@faker-js/faker';

/**
 * Everything needed to register a fresh account on Automation Exercise.
 * Matches the fields the signup form asks for.
 */
export interface NewUser {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
  dateOfBirth: { day: string; month: string; year: string };
}

// A fixed, obviously-fake password for generated accounts. Keeping it constant
// means an account created by a test run can be reused for the login test
// (drop the email + this password into .env). Safe to keep in source: it only
// ever applies to throwaway accounts on a public practice site.
export const TEST_PASSWORD = 'Wanne@QA2026';

/**
 * Builds a fresh user on each call. The email carries a timestamp so it's
 * unique every run (the site rejects duplicate emails); the rest is realistic
 * filler. I keep a recognisable "wanne" prefix so test data is easy to spot.
 */
export function generateNewUser(): NewUser {
  return {
    name: 'Wanne Toldova',
    // Timestamp + random suffix guarantees uniqueness even when two tests
    // register in the same millisecond on parallel workers (the site rejects
    // duplicate emails).
    email: `wanne.qa.${Date.now()}.${faker.string.alphanumeric(5).toLowerCase()}@example.com`,
    password: TEST_PASSWORD,
    title: 'Mr',
    firstName: 'Wanne',
    lastName: 'Toldova',
    company: faker.company.name(),
    address: faker.location.streetAddress(),
    country: 'United States', // must match one of the site's dropdown options
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode('#####'),
    mobileNumber: faker.string.numeric(10),
    dateOfBirth: { day: '15', month: '6', year: '1995' },
  };
}

// Search terms: one that clearly returns products, and another used to prove
// search actually filters the grid rather than ignoring the query.
export const SEARCH_TERMS = {
  withResults: 'dress',
  filtering: 'top',
} as const;
