/**
 * Validate expense data
 */
export const validateExpense = (expenseData) => {
    const errors = {};

    if (!expenseData.date) {
        errors.date = 'Date is required';
    }

    if (!expenseData.amount || expenseData.amount <= 0) {
        errors.amount = 'Amount must be greater than 0';
    }

    if (!expenseData.expenseType) {
        errors.expenseType = 'Expense type is required';
    }

    if (!expenseData.paymentType) {
        errors.paymentType = 'Payment type is required';
    }

    if (!expenseData.paidBy) {
        errors.paidBy = 'Paid by is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate amount (numeric and positive)
 */
export const validateAmount = (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
};

/**
 * Validate category name (no duplicates, max length)
 */
export const validateCategoryName = (name, existingCategories) => {
    if (!name || name.trim().length === 0) {
        return { isValid: false, error: 'Name cannot be empty' };
    }

    if (name.length > 30) {
        return { isValid: false, error: 'Name must be 30 characters or less' };
    }

    if (existingCategories.includes(name.trim())) {
        return { isValid: false, error: 'This name already exists' };
    }

    return { isValid: true };
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true };
};
