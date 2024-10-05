export const API_BASE_URL =
  process.env.API_BASE_URL ||
  (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('API_BASE_URL must be set in production');
    }
    return 'http://localhost:3001';
  })();

export const CATEGORIES_QUERY_KEY = ['categories'];
export const PRODUCTS_QUERY_KEY = ['products'];
export const CREWS_QUERY_KEY = ['crews'];

export const SINGLE_PRODUCT_QUERY_KEY = ['productId'];
export const SINGLE_CATEGORY_QUERY_KEY = ['categoryId'];
export const SINGLE_CREW_QUERY_KEY = ['crewId'];

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  BARTENDER = 'bartender',
  SERVER = 'server',
}
