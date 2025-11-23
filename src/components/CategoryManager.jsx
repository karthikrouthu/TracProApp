import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    Divider,
    Paper,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Add as AddIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { updateConfig } from '../services/googleSheets';
import { validateCategoryName } from '../utils/validators';
import {
    cacheExpenseTypes,
    cachePaymentTypes,
    cacheUsers,
} from '../services/storage';

const CategoryManager = ({ onClose }) => {
    const { expenseTypes, paymentTypes, users, setExpenseTypes, setPaymentTypes, setUsers, saveUserSettings } = useApp();

    const [localExpenseTypes, setLocalExpenseTypes] = useState([...expenseTypes]);
    const [localPaymentTypes, setLocalPaymentTypes] = useState([...paymentTypes]);
    const [localUsers, setLocalUsers] = useState([...users]);

    const [newItem, setNewItem] = useState('');
    const [activeDialog, setActiveDialog] = useState(null); // 'expense', 'payment', 'user'
    const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', item: '' });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleAddItem = (type) => {
        const existingList = type === 'expense' ? localExpenseTypes :
            type === 'payment' ? localPaymentTypes : localUsers;

        const validation = validateCategoryName(newItem, existingList);

        if (!validation.isValid) {
            setSnackbar({ open: true, message: validation.error, severity: 'error' });
            return;
        }

        if (type === 'expense') {
            setLocalExpenseTypes([...localExpenseTypes, newItem.trim()]);
        } else if (type === 'payment') {
            setLocalPaymentTypes([...localPaymentTypes, newItem.trim()]);
        } else {
            setLocalUsers([...localUsers, newItem.trim()]);
        }

        setNewItem('');
        setActiveDialog(null);
        setSnackbar({ open: true, message: 'Item added', severity: 'success' });
    };

    const handleDeleteItem = (type, item) => {
        if (type === 'expense') {
            setLocalExpenseTypes(localExpenseTypes.filter(t => t !== item));
        } else if (type === 'payment') {
            setLocalPaymentTypes(localPaymentTypes.filter(t => t !== item));
        } else {
            setLocalUsers(localUsers.filter(u => u !== item));
        }

        setDeleteDialog({ open: false, type: '', item: '' });
        setSnackbar({ open: true, message: 'Item deleted', severity: 'success' });
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            await updateConfig(localExpenseTypes, localPaymentTypes, localUsers);

            // Update context
            setExpenseTypes(localExpenseTypes);
            setPaymentTypes(localPaymentTypes);
            setUsers(localUsers);

            // Update cache
            cacheExpenseTypes(localExpenseTypes);
            cachePaymentTypes(localPaymentTypes);
            cacheUsers(localUsers);

            // Save user-specific settings for multi-device sync
            try {
                await saveUserSettings();
                console.log('User settings synced across devices');
            } catch (error) {
                console.error('Error syncing user settings:', error);
                // Don't fail the whole operation if user sync fails
            }

            setSnackbar({ open: true, message: 'Changes saved successfully!', severity: 'success' });

            setTimeout(() => {
                if (onClose) onClose();
            }, 1000);
        } catch (error) {
            console.error('Error saving config:', error);
            setSnackbar({ open: true, message: 'Failed to save changes', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const renderList = (items, type, title) => (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                    {title}
                </Typography>
                <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setActiveDialog(type)}
                    sx={{ textTransform: 'none' }}
                >
                    Add
                </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {items.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No items yet. Click "Add" to create one.
                </Typography>
            ) : (
                <List>
                    {items.map((item, index) => (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    onClick={() => setDeleteDialog({ open: true, type, item })}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <ListItemText primary={item} />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Manage Categories
            </Typography>

            {renderList(localExpenseTypes, 'expense', 'Expense Types')}
            {renderList(localPaymentTypes, 'payment', 'Payment Types')}
            {renderList(localUsers, 'user', 'Users')}

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={loading ? null : <SaveIcon />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                        py: 1.5,
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                        },
                    }}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>

                {onClose && (
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={loading}
                        sx={{ minWidth: 100 }}
                    >
                        Cancel
                    </Button>
                )}
            </Box>

            {/* Add Item Dialog */}
            <Dialog open={!!activeDialog} onClose={() => setActiveDialog(null)}>
                <DialogTitle>
                    Add {activeDialog === 'expense' ? 'Expense Type' :
                        activeDialog === 'payment' ? 'Payment Type' : 'User'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        inputProps={{ maxLength: 30 }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleAddItem(activeDialog);
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActiveDialog(null)}>Cancel</Button>
                    <Button onClick={() => handleAddItem(activeDialog)} variant="contained">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', item: '' })}>
                <DialogTitle>Delete Item</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{deleteDialog.item}"? This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, type: '', item: '' })}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleDeleteItem(deleteDialog.type, deleteDialog.item)}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CategoryManager;
