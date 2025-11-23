import { format, parse } from 'date-fns';

/**
 * Format date as DD-MM-YYYY
 */
export const formatDate = (date) => {
    return format(date, 'dd-MM-yyyy');
};

/**
 * Get month-year string for sheet name (e.g., "November 2025")
 */
export const getMonthYearSheetName = (date) => {
    return format(date, 'MMMM yyyy');
};

/**
 * Parse DD-MM-YYYY string to Date object
 */
export const parseDate = (dateString) => {
    return parse(dateString, 'dd-MM-yyyy', new Date());
};

/**
 * Format timestamp for Google Sheets
 */
export const formatTimestamp = (date) => {
    return format(date, 'dd-MM-yyyy HH:mm:ss');
};

/**
 * Get current date formatted as DD-MM-YYYY
 */
export const getCurrentDate = () => {
    return formatDate(new Date());
};
