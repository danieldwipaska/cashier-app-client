export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
export const CATEGORIES_QUERY_KEY = ['categories'];
export const PRODUCTS_QUERY_KEY = ['products'];
export const CREWS_QUERY_KEY = ['crews'];

export const PRODUCT_QUERY_KEY = ['productId'];
export const CATEGORY_QUERY_KEY = ['categoryId'];
export const CREW_QUERY_KEY = ['crewId'];

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  BARTENDER = 'bartender',
  SERVER = 'server',
}
