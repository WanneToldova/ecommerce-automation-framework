import { faker } from '@faker-js/faker';

/**
 * A self-contained set of details for registering a brand-new account on
 * Automation Exercise. Mirrors the fields the site's signup form requires.
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

/**
 * Generates a fresh, unique user on every call.
 *
 * The email embeds a timestamp so runs never collide with an existing account
 * (the site rejects duplicate emails). Country is one of the site's accepted
 * dropdown values.
 */
export function generateNewUser(): NewUser {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
    email: `qa.automation.${Date.now()}@example.com`,
    password: `Qa!${faker.internet.password({ length: 8 })}`,
    title: 'Mr',
    firstName,
    lastName,
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

/**
 * Search terms. `withResults` reliably returns products on this catalogue;
 * `filtering` is another valid term used to prove search narrows the list.
 */
export const SEARCH_TERMS = {
  withResults: 'dress',
  filtering: 'top',
} as const;
