export const API_BASE_URL = process.env.API_BASE_URL;
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
export const BACKOFFICE_SETTINGS_QUERY_KEY = ['backofficeSettings'];
export const SHOPS_QUERY_KEY = ['shops'];
export const SHOP_QUERY_KEY = ['shopId'];
export const METHOD_QUERY_KEY = ['methodId'];

// CHOICES
export const POSITIONS = ['ADMIN', 'SERVER', 'BARTENDER', 'DEVELOPER'];
export const CARD_TYPES = ['Basic', 'Member'];

// ERROR MESSAGES
export enum ErrorMessage {
  CARD_NOT_FOUND = 'Card Not Found',
  CARD_NOT_ACTIVE = 'Card Not Active',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  INVALID_CREW_CODE = 'Wrong crew code',
  UNEXPECTED_ERROR = 'An unexpected or connection error occurred',
  BAD_REQUEST = 'Bad Request',
}

// ENUM
export enum CardAction {
  TOPUP = 1,
  ADJUST = 2,
  CHECKOUT = 3,
}

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  EXPIRED = 'EXPIRED',
}

export enum ReportType {
  TOPUP_AND_ACTIVATE = 'TOPUP_AND_ACTIVATE',
  TOPUP = 'TOPUP',
  PAY = 'PAY',
  CHECKOUT = 'CHECKOUT',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum ReportStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  GIFT_CARD = 'Gift Card',
  CASH = 'Cash',
}

// CONSTANTS
export const MAX_ROW_PER_PAGE = 15;