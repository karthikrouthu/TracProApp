// Application constants

export const STORAGE_KEYS = {
    GOOGLE_TOKEN: 'tracpro_google_token',
    SHEET_ID: 'tracpro_sheet_id',
    SHEET_NAME: 'tracpro_sheet_name',
    LAST_PAID_BY: 'tracpro_last_paid_by',
    THEME: 'tracpro_theme',
    CACHE_EXPENSE_TYPES: 'tracpro_cache_expense_types',
    CACHE_PAYMENT_TYPES: 'tracpro_cache_payment_types',
    CACHE_USERS: 'tracpro_cache_users',
    CACHE_RECENT: 'tracpro_cache_recent',
    CACHE_TIMESTAMP: 'tracpro_cache_timestamp',
};

export const DEFAULT_EXPENSE_TYPES = [
    'Groceries',
    'Transport',
    'Bills & Utilities',
    'Entertainment',
    'Healthcare',
    'Education',
    'Shopping',
    'Food & Dining',
];

export const DEFAULT_PAYMENT_TYPES = [
    'Cash',
    'UPI',
    'Credit Card',
    'Debit Card',
];

export const DEFAULT_USERS = [
    'User 1',
    'User 2',
];

export const GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/userinfo.email',
];

export const CONFIG_SHEET_NAME = '_config';

export const CURRENCY_SYMBOL = '₹';
