/**
 * Application route paths, relative to {@link config.baseURL}.
 *
 * Centralising them means a URL change on the site is a one-line edit here,
 * not a hunt through every page object. These are the real Automation Exercise
 * paths.
 */
export const routes = {
  home: '/',
  products: '/products',
  // On Automation Exercise, both the login and the "new user signup" forms
  // live on /login. Submitting the signup form then advances to /signup.
  login: '/login',
  signup: '/login',
  cart: '/view_cart',
} as const;

export type RouteName = keyof typeof routes;
