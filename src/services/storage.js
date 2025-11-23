import { STORAGE_KEYS } from '../utils/constants';

/**
 * Save to localStorage
 */
export const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
};

/**
 * Load from localStorage
 */
export const loadFromStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
};

/**
 * Remove from localStorage
 */
export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
};

/**
 * Clear all TracPro data from localStorage
 */
export const clearAllStorage = () => {
    try {
        Object.values(STORAGE_KEYS).forEach((key) => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
};

/**
 * Save Google authentication token
 */
export const saveGoogleToken = (token) => {
    return saveToStorage(STORAGE_KEYS.GOOGLE_TOKEN, token);
};

/**
 * Load Google authentication token
 */
export const loadGoogleToken = () => {
    return loadFromStorage(STORAGE_KEYS.GOOGLE_TOKEN);
};

/**
 * Save sheet configuration
 */
export const saveSheetConfig = (sheetId, sheetName) => {
    saveToStorage(STORAGE_KEYS.SHEET_ID, sheetId);
    saveToStorage(STORAGE_KEYS.SHEET_NAME, sheetName);
};

/**
 * Load sheet configuration
 */
export const loadSheetConfig = () => {
    return {
        sheetId: loadFromStorage(STORAGE_KEYS.SHEET_ID),
        sheetName: loadFromStorage(STORAGE_KEYS.SHEET_NAME),
    };
};

/**
 * Save last paid by value
 */
export const saveLastPaidBy = (paidBy) => {
    return saveToStorage(STORAGE_KEYS.LAST_PAID_BY, paidBy);
};

/**
 * Load last paid by value
 */
export const loadLastPaidBy = () => {
    return loadFromStorage(STORAGE_KEYS.LAST_PAID_BY);
};

/**
 * Cache expense types
 */
export const cacheExpenseTypes = (types) => {
    return saveToStorage(STORAGE_KEYS.CACHE_EXPENSE_TYPES, types);
};

/**
 * Load cached expense types
 */
export const loadCachedExpenseTypes = () => {
    return loadFromStorage(STORAGE_KEYS.CACHE_EXPENSE_TYPES, []);
};

/**
 * Cache payment types
 */
export const cachePaymentTypes = (types) => {
    return saveToStorage(STORAGE_KEYS.CACHE_PAYMENT_TYPES, types);
};

/**
 * Load cached payment types
 */
export const loadCachedPaymentTypes = () => {
    return loadFromStorage(STORAGE_KEYS.CACHE_PAYMENT_TYPES, []);
};

/**
 * Cache users
 */
export const cacheUsers = (users) => {
    return saveToStorage(STORAGE_KEYS.CACHE_USERS, users);
};

/**
 * Load cached users
 */
export const loadCachedUsers = () => {
    return loadFromStorage(STORAGE_KEYS.CACHE_USERS, []);
};

/**
 * Cache recent expenses
 */
export const cacheRecentExpenses = (expenses) => {
    saveToStorage(STORAGE_KEYS.CACHE_RECENT, expenses);
    saveToStorage(STORAGE_KEYS.CACHE_TIMESTAMP, new Date().toISOString());
};

/**
 * Load cached recent expenses
 */
export const loadCachedRecentExpenses = () => {
    return loadFromStorage(STORAGE_KEYS.CACHE_RECENT, []);
};

/**
 * Save theme preference
 */
export const saveTheme = (theme) => {
    return saveToStorage(STORAGE_KEYS.THEME, theme);
};

/**
 * Load theme preference
 */
export const loadTheme = () => {
    return loadFromStorage(STORAGE_KEYS.THEME, 'light');
};
