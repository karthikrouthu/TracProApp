import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Alert,
    Snackbar,
    CircularProgress,
    InputAdornment,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { appendExpense } from '../services/googleSheets';
import { validateExpense } from '../utils/validators';
import { getCurrentDate } from '../utils/dateUtils';
import { saveLastPaidBy } from '../services/storage';
import { CURRENCY_SYMBOL } from '../utils/constants';

const ExpenseForm = ({ onExpenseAdded }) => {
    const { expenseTypes, paymentTypes, users, lastPaidBy, setLastPaidBy } = useApp();

    const [formData, setFormData] = useState({
        date: getCurrentDate(),
        amount: '',
        expenseType: '',
        paymentType: '',
        paidBy: lastPaidBy || '',
        remarks: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Update paid by when lastPaidBy changes
    useEffect(() => {
        if (lastPaidBy && !formData.paidBy) {
            setFormData(prev => ({ ...prev, paidBy: lastPaidBy }));
        }
    }, [lastPaidBy]);

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value,
        }));

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        const validation = validateExpense(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            setSnackbar({
                open: true,
                message: 'Please fill all required fields',
                severity: 'error',
            });
            return;
        }

        try {
            setLoading(true);
            setErrors({});

            // Submit expense
            await appendExpense(formData);

            // Save last paid by
            saveLastPaidBy(formData.paidBy);
            setLastPaidBy(formData.paidBy);

            // Show success message
            setSnackbar({
                open: true,
                message: 'Expense added successfully!',
                severity: 'success',
            });

            // Reset form (keep paidBy)
            setFormData({
                date: getCurrentDate(),
                amount: '',
                expenseType: '',
                paymentType: '',
                paidBy: formData.paidBy,
                remarks: '',
            });

            // Notify parent
            if (onExpenseAdded) {
                onExpenseAdded();
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Failed to add expense. Please try again.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                p: 3,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
        >
            <TextField
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleChange('date')}
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
            />

            <TextField
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={handleChange('amount')}
                error={!!errors.amount}
                helperText={errors.amount}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{CURRENCY_SYMBOL}</span>
                        </InputAdornment>
                    ),
                }}
                inputProps={{
                    min: 0,
                    step: 0.01,
                }}
                fullWidth
                required
            />

            <TextField
                select
                label="Expense Type"
                value={formData.expenseType}
                onChange={handleChange('expenseType')}
                error={!!errors.expenseType}
                helperText={errors.expenseType || (expenseTypes.length === 0 ? 'Configure in Settings' : '')}
                fullWidth
                required
                disabled={expenseTypes.length === 0}
            >
                {expenseTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                        {type}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                select
                label="Payment Type"
                value={formData.paymentType}
                onChange={handleChange('paymentType')}
                error={!!errors.paymentType}
                helperText={errors.paymentType || (paymentTypes.length === 0 ? 'Configure in Settings' : '')}
                fullWidth
                required
                disabled={paymentTypes.length === 0}
            >
                {paymentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                        {type}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                select
                label="Paid By"
                value={formData.paidBy}
                onChange={handleChange('paidBy')}
                error={!!errors.paidBy}
                helperText={errors.paidBy || (users.length === 0 ? 'Configure in Settings' : '')}
                fullWidth
                required
                disabled={users.length === 0}
            >
                {users.map((user) => (
                    <MenuItem key={user} value={user}>
                        {user}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                label="Remarks (Optional)"
                value={formData.remarks}
                onChange={handleChange('remarks')}
                multiline
                rows={2}
                inputProps={{ maxLength: 200 }}
                helperText={`${formData.remarks.length}/200`}
                fullWidth
            />

            <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || expenseTypes.length === 0 || paymentTypes.length === 0 || users.length === 0}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                    },
                    transition: 'all 0.2s',
                }}
            >
                {loading ? 'Adding...' : 'Add Expense'}
            </Button>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ExpenseForm;
