export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
export const CATEGORIES_QUERY_KEY = ['categories'];
export const PRODUCTS_QUERY_KEY = ['products'];
export const PRODUCT_QUERY_KEY = ['productId'];
export const CATEGORY_QUERY_KEY = ['categoryId'];
export const REPORTS_QUERY_KEY = ['reports'];
export const CUSTOMER_REPORTS_QUERY_KEY = ['customerReports'];
export const CREWS_QUERY_KEY = ['crews'];
export const CREW_QUERY_KEY = ['crewId'];
export const PAYMENT_METHODS_QUERY_KEY = ['paymentMethods'];
export const PAYMENT_METHOD_QUERY_KEY = ['paymentMethodId'];
export const CARDS_METHOD_QUERY_KEY = ['cards'];
export const CARD_METHOD_QUERY_KEY = ['cardId'];

// CHOICES
export const POSITIONS = ['admin', 'server', 'bartender', 'developer'];
export const CARD_TYPES = ['Basic', 'Member'];

// ERROR MESSAGES
export enum ErrorMessage {
  CARD_NOT_FOUND = 'Card Not Found',
  CARD_NOT_ACTIVE = 'Card Not Active',
}

// ENUM
export enum CardAction {
  TOPUP = 1,
  ADJUST = 2,
  CHECKOUT = 3,
}

export enum ReportType {
  TOPUP_AND_ACTIVATE = 'topup and activate',
  TOPUP = 'topup',
  PAY = 'pay',
  CHECKOUT = 'checkout',
  ADJUSTMENT = 'adjustment',
}
