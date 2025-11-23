import { getMonthYearSheetName, formatTimestamp } from '../utils/dateUtils';
import { CONFIG_SHEET_NAME, DEFAULT_EXPENSE_TYPES, DEFAULT_PAYMENT_TYPES, DEFAULT_USERS } from '../utils/constants';
import { loadSheetConfig } from './storage';
import { ensureTokenSet } from './auth';

/**
 * Get Google Sheets API client
 */
const getSheetsApi = () => {
    if (!window.gapi || !window.gapi.client || !window.gapi.client.sheets) {
        throw new Error('Google Sheets API not initialized');
    }

    // Ensure token is set before making API calls
    if (!ensureTokenSet()) {
        throw new Error('Not authenticated. Please sign in again.');
    }

    return window.gapi.client.sheets;
};

/**
 * Create a new Google Sheet
 */
export const createNewSheet = async (title = 'TracPro_Expenses') => {
    try {
        const response = await getSheetsApi().spreadsheets.create({
            properties: {
                title: title,
            },
        });

        const sheetId = response.result.spreadsheetId;

        // Initialize the sheet with config and current month
        await initializeSheet(sheetId);

        return {
            id: sheetId,
            name: title,
            url: `https://docs.google.com/spreadsheets/d/${sheetId}`,
        };
    } catch (error) {
        console.error('Error creating sheet:', error);
        throw error;
    }
};

/**
 * Initialize sheet with config and current month sheet
 */
const initializeSheet = async (sheetId) => {
    try {
        // Create config sheet
        await createConfigSheet(sheetId);

        // Create current month sheet
        const currentMonthName = getMonthYearSheetName(new Date());
        await createMonthSheet(sheetId, currentMonthName);

        // Delete default "Sheet1"
        await deleteSheet(sheetId, 0);
    } catch (error) {
        console.error('Error initializing sheet:', error);
        throw error;
    }
};

/**
 * Create config sheet
 */
const createConfigSheet = async (sheetId) => {
    try {
        // Add config sheet
        await getSheetsApi().spreadsheets.batchUpdate({
            spreadsheetId: sheetId,
            resource: {
                requests: [{
                    addSheet: {
                        properties: {
                            title: CONFIG_SHEET_NAME,
                            hidden: true,
                        },
                    },
                }],
            },
        });

        // Add default configuration
        await getSheetsApi().spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${CONFIG_SHEET_NAME}!A1:C4`,
            valueInputOption: 'RAW',
            resource: {
                values: [
                    DEFAULT_EXPENSE_TYPES,
                    DEFAULT_PAYMENT_TYPES,
                    DEFAULT_USERS,
                    [new Date().toISOString()],
                ],
            },
        });
    } catch (error) {
        console.error('Error creating config sheet:', error);
        throw error;
    }
};

/**
 * Create monthly sheet
 */
export const createMonthSheet = async (sheetId, monthName) => {
    try {
        const headers = ['Date', 'Amount', 'Expense Type', 'Payment Type', 'Paid By', 'Remarks', 'Timestamp'];

        // Add sheet
        await getSheetsApi().spreadsheets.batchUpdate({
            spreadsheetId: sheetId,
            resource: {
                requests: [{
                    addSheet: {
                        properties: {
                            title: monthName,
                            index: 0, // Add at the beginning
                        },
                    },
                }],
            },
        });

        // Add headers
        await getSheetsApi().spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${monthName}!A1:G1`,
            valueInputOption: 'RAW',
            resource: {
                values: [headers],
            },
        });

        // Format headers (bold)
        await getSheetsApi().spreadsheets.batchUpdate({
            spreadsheetId: sheetId,
            resource: {
                requests: [{
                    repeatCell: {
                        range: {
                            sheetId: await getSheetIdByName(sheetId, monthName),
                            startRowIndex: 0,
                            endRowIndex: 1,
                        },
                        cell: {
                            userEnteredFormat: {
                                textFormat: {
                                    bold: true,
                                },
                            },
                        },
                        fields: 'userEnteredFormat.textFormat.bold',
                    },
                }],
            },
        });
    } catch (error) {
        console.error('Error creating month sheet:', error);
        throw error;
    }
};

/**
 * Delete a sheet by ID
 */
const deleteSheet = async (spreadsheetId, sheetId) => {
    try {
        await getSheetsApi().spreadsheets.batchUpdate({
            spreadsheetId: spreadsheetId,
            resource: {
                requests: [{
                    deleteSheet: {
                        sheetId: sheetId,
                    },
                }],
            },
        });
    } catch (error) {
        // Ignore error if sheet doesn't exist
        console.log('Could not delete sheet:', error);
    }
};

/**
 * Get sheet ID by name
 */
const getSheetIdByName = async (spreadsheetId, sheetName) => {
    try {
        const response = await getSheetsApi().spreadsheets.get({
            spreadsheetId: spreadsheetId,
        });

        const sheet = response.result.sheets.find(s => s.properties.title === sheetName);
        return sheet ? sheet.properties.sheetId : null;
    } catch (error) {
        console.error('Error getting sheet ID:', error);
        return null;
    }
};

/**
 * Check if sheet exists
 */
export const sheetExists = async (sheetId, sheetName) => {
    try {
        const response = await getSheetsApi().spreadsheets.get({
            spreadsheetId: sheetId,
        });

        return response.result.sheets.some(s => s.properties.title === sheetName);
    } catch (error) {
        console.error('Error checking sheet existence:', error);
        return false;
    }
};

/**
 * Ensure month sheet exists, create if not
 */
export const ensureMonthSheetExists = async (date) => {
    const { sheetId } = loadSheetConfig();
    if (!sheetId) {
        throw new Error('No sheet configured');
    }

    const monthName = getMonthYearSheetName(date);
    const exists = await sheetExists(sheetId, monthName);

    if (!exists) {
        await createMonthSheet(sheetId, monthName);
    }

    return monthName;
};

/**
 * Append expense to sheet
 */
export const appendExpense = async (expenseData) => {
    try {
        const { sheetId } = loadSheetConfig();
        if (!sheetId) {
            throw new Error('No sheet configured');
        }

        // Ensure month sheet exists
        const monthName = await ensureMonthSheetExists(new Date(expenseData.date));

        // Prepare row data
        const row = [
            expenseData.date,
            expenseData.amount,
            expenseData.expenseType,
            expenseData.paymentType,
            expenseData.paidBy,
            expenseData.remarks || '',
            formatTimestamp(new Date()),
        ];

        // Append to sheet
        await getSheetsApi().spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: `${monthName}!A:G`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [row],
            },
        });

        return true;
    } catch (error) {
        console.error('Error appending expense:', error);
        throw error;
    }
};

/**
 * Ensure config sheet exists, create if not
 */
export const ensureConfigSheetExists = async () => {
    try {
        const { sheetId } = loadSheetConfig();
        if (!sheetId) {
            throw new Error('No sheet configured');
        }

        console.log('Checking if config sheet exists for sheet:', sheetId);

        // Check if config sheet exists
        const exists = await sheetExists(sheetId, CONFIG_SHEET_NAME);

        console.log('Config sheet exists:', exists);

        if (!exists) {
            console.log('Config sheet does not exist, creating...');
            await createConfigSheet(sheetId);
            console.log('Config sheet created successfully');
        }

        return true;
    } catch (error) {
        console.error('Error ensuring config sheet exists:', error);
        throw error;
    }
};

/**
 * Get configuration from sheet
 */
export const getConfig = async () => {
    try {
        const { sheetId } = loadSheetConfig();
        if (!sheetId) {
            throw new Error('No sheet configured');
        }

        // Ensure config sheet exists
        await ensureConfigSheetExists();

        const response = await getSheetsApi().spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${CONFIG_SHEET_NAME}!A1:C3`,
        });

        const values = response.result.values || [];

        return {
            expenseTypes: values[0] || DEFAULT_EXPENSE_TYPES,
            paymentTypes: values[1] || DEFAULT_PAYMENT_TYPES,
            users: values[2] || DEFAULT_USERS,
        };
    } catch (error) {
        console.error('Error getting config:', error);
        // Return defaults if config doesn't exist
        return {
            expenseTypes: DEFAULT_EXPENSE_TYPES,
            paymentTypes: DEFAULT_PAYMENT_TYPES,
            users: DEFAULT_USERS,
        };
    }
};

/**
 * Update configuration in sheet
 */
export const updateConfig = async (expenseTypes, paymentTypes, users) => {
    try {
        const { sheetId } = loadSheetConfig();
        if (!sheetId) {
            throw new Error('No sheet configured');
        }

        // Ensure config sheet exists
        await ensureConfigSheetExists();

        // Calculate the maximum number of columns needed
        const maxColumns = Math.max(
            expenseTypes.length,
            paymentTypes.length,
            users.length,
            1 // At least 1 column for timestamp
        );

        // Convert column number to letter (A, B, C, ... Z, AA, AB, etc.)
        const getColumnLetter = (num) => {
            let letter = '';
            while (num > 0) {
                const remainder = (num - 1) % 26;
                letter = String.fromCharCode(65 + remainder) + letter;
                num = Math.floor((num - 1) / 26);
            }
            return letter;
        };

        const endColumn = getColumnLetter(maxColumns);
        const range = `${CONFIG_SHEET_NAME}!A1:${endColumn}4`;

        console.log('Updating config with range:', range);

        const response = await getSheetsApi().spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: range,
            valueInputOption: 'RAW',
            resource: {
                values: [
                    expenseTypes,
                    paymentTypes,
                    users,
                    [new Date().toISOString()],
                ],
            },
        });

        return true;
    } catch (error) {
        console.error('Error updating config:', error);
        throw error;
    }
};

/**
 * Get recent expenses from current month
 */
export const getRecentExpenses = async (limit = 10) => {
    try {
        const { sheetId } = loadSheetConfig();
        if (!sheetId) {
            return [];
        }

        const monthName = getMonthYearSheetName(new Date());

        // Check if current month sheet exists
        const exists = await sheetExists(sheetId, monthName);
        if (!exists) {
            return [];
        }

        // Get all data from current month
        const response = await getSheetsApi().spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${monthName}!A2:G`,
        });

        const values = response.result.values || [];

        // Convert to expense objects and reverse to get most recent first
        const expenses = values.map(row => ({
            date: row[0],
            amount: parseFloat(row[1]),
            expenseType: row[2],
            paymentType: row[3],
            paidBy: row[4],
            remarks: row[5] || '',
            timestamp: row[6],
        })).reverse();

        return expenses.slice(0, limit);
    } catch (error) {
        console.error('Error getting recent expenses:', error);
        return [];
    }
};

/**
 * List all available sheets
 */
export const listSheets = async () => {
    try {
        const response = await getSheetsApi().spreadsheets.list({
            pageSize: 100,
        });

        return response.result.files || [];
    } catch (error) {
        console.error('Error listing sheets:', error);
        return [];
    }
};
