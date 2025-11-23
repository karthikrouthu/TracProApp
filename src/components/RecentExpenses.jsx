import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Stack,
    IconButton,
    Divider,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { CURRENCY_SYMBOL } from '../utils/constants';

const RecentExpenses = ({ expenses, onRefresh, loading }) => {
    if (expenses.length === 0) {
        return (
            <Box
                sx={{
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
            >
                <Typography variant="body1" color="text.secondary">
                    No expenses yet. Add your first expense above!
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <Typography variant="h6" fontWeight={600}>
                    Recent Expenses
                </Typography>
                <IconButton
                    onClick={onRefresh}
                    disabled={loading}
                    size="small"
                    sx={{
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    }}
                >
                    <RefreshIcon />
                </IconButton>
            </Box>

            <Stack spacing={2}>
                {expenses.map((expense, index) => (
                    <Card
                        key={index}
                        sx={{
                            transition: 'all 0.2s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight={600} color="primary">
                                        {CURRENCY_SYMBOL}{expense.amount.toLocaleString('en-IN')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {expense.date}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={expense.expenseType}
                                    size="small"
                                    sx={{
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        color: 'white',
                                        fontWeight: 500,
                                    }}
                                />
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip
                                    label={expense.paymentType}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.75rem' }}
                                />
                                <Chip
                                    label={expense.paidBy}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.75rem' }}
                                />
                            </Box>

                            {expense.remarks && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                                    "{expense.remarks}"
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
};

export default RecentExpenses;
