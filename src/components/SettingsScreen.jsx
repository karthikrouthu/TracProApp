import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Switch,
    FormControlLabel,
    Chip,
    Divider,
    Alert,
    CircularProgress,
    TextField,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Settings as SettingsIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    Category as CategoryIcon,
    Logout as LogoutIcon,
    Link as LinkIcon,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { requestAccessToken, signOut } from '../services/auth';
import { createNewSheet } from '../services/googleSheets';
import { saveSheetConfig } from '../services/storage';

const SettingsScreen = ({ onManageCategories }) => {
    const {
        isAuthenticated,
        sheetConfig,
        theme,
        toggleTheme,
        updateAuthStatus,
        updateSheetConfig,
        loadConfig,
    } = useApp();

    const [connecting, setConnecting] = useState(false);
    const [creatingSheet, setCreatingSheet] = useState(false);
    const [error, setError] = useState(null);
    const [manualSheetId, setManualSheetId] = useState('');
    const [connectingManual, setConnectingManual] = useState(false);

    const handleConnect = async () => {
        try {
            setConnecting(true);
            setError(null);

            await requestAccessToken();
            updateAuthStatus(true);

            // If no sheet configured, prompt to create one
            if (!sheetConfig.sheetId) {
                await handleCreateSheet();
            } else {
                // Load config from existing sheet
                await loadConfig();
            }
        } catch (error) {
            console.error('Connection error:', error);
            setError(error.message || 'Failed to connect. Please try again.');
        } finally {
            setConnecting(false);
        }
    };

    const handleCreateSheet = async () => {
        try {
            setCreatingSheet(true);
            setError(null);

            const sheet = await createNewSheet('TracPro_Expenses');

            saveSheetConfig(sheet.id, sheet.name);
            updateSheetConfig({ sheetId: sheet.id, sheetName: sheet.name });

            // Load default config
            await loadConfig();
        } catch (error) {
            console.error('Error creating sheet:', error);
            setError(error.message || 'Failed to create sheet. Please try again.');
        } finally {
            setCreatingSheet(false);
        }
    };

    const handleSignOut = () => {
        signOut();
        updateAuthStatus(false);
        updateSheetConfig({ sheetId: null, sheetName: null });
    };

    const handleConnectManualSheet = async () => {
        try {
            setConnectingManual(true);
            setError(null);

            if (!manualSheetId.trim()) {
                setError('Please enter a valid Sheet ID');
                return;
            }

            // Extract sheet ID from URL if full URL is provided
            let sheetId = manualSheetId.trim();
            const urlMatch = sheetId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
            if (urlMatch) {
                sheetId = urlMatch[1];
            }

            // Save the sheet configuration
            saveSheetConfig(sheetId, 'Connected Sheet');
            updateSheetConfig({ sheetId: sheetId, sheetName: 'Connected Sheet' });

            // Load config from the sheet
            await loadConfig();

            setManualSheetId('');
        } catch (error) {
            console.error('Error connecting to sheet:', error);
            setError(error.message || 'Failed to connect to sheet. Please check the Sheet ID and try again.');
        } finally {
            setConnectingManual(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon /> Settings
            </Typography>

            {/* Google Sheets Connection */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Google Sheets Connection
                </Typography>

                {isAuthenticated ? (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <CheckCircleIcon color="success" />
                            <Typography color="success.main" fontWeight={500}>
                                Connected
                            </Typography>
                        </Box>

                        {sheetConfig.sheetName && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Sheet Name:
                                </Typography>
                                <Chip
                                    label={sheetConfig.sheetName}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {!sheetConfig.sheetId && (
                                <>
                                    <Button
                                        variant="contained"
                                        onClick={handleCreateSheet}
                                        disabled={creatingSheet}
                                        size="small"
                                    >
                                        {creatingSheet ? 'Creating...' : 'Create New Sheet'}
                                    </Button>

                                    <Typography variant="body2" color="text.secondary" sx={{ width: '100%', my: 1 }}>
                                        OR
                                    </Typography>

                                    <Box sx={{ width: '100%', display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            placeholder="Enter Sheet ID or paste Sheet URL"
                                            value={manualSheetId}
                                            onChange={(e) => setManualSheetId(e.target.value)}
                                            disabled={connectingManual}
                                            helperText="You can paste the full Google Sheets URL or just the Sheet ID"
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={handleConnectManualSheet}
                                            disabled={connectingManual || !manualSheetId.trim()}
                                            startIcon={connectingManual ? <CircularProgress size={16} /> : <LinkIcon />}
                                            sx={{ minWidth: 120 }}
                                        >
                                            {connectingManual ? 'Connecting...' : 'Connect'}
                                        </Button>
                                    </Box>
                                </>
                            )}

                            <Button
                                variant="outlined"
                                onClick={handleSignOut}
                                startIcon={<LogoutIcon />}
                                size="small"
                                color="error"
                            >
                                Sign Out
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <ErrorIcon color="error" />
                            <Typography color="error.main" fontWeight={500}>
                                Not Connected
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            onClick={handleConnect}
                            disabled={connecting}
                            startIcon={connecting ? <CircularProgress size={20} color="inherit" /> : null}
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                                },
                            }}
                        >
                            {connecting ? 'Connecting...' : 'Connect Google Account'}
                        </Button>
                    </>
                )}

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </Paper>

            {/* Manage Categories */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Manage Categories
                </Typography>

                <Button
                    variant="outlined"
                    fullWidth
                    onClick={onManageCategories}
                    startIcon={<CategoryIcon />}
                    sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        py: 1.5,
                    }}
                >
                    Expense Types, Payment Types & Users
                </Button>
            </Paper>

            {/* Appearance */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Appearance
                </Typography>

                <FormControlLabel
                    control={
                        <Switch
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                            icon={<LightModeIcon />}
                            checkedIcon={<DarkModeIcon />}
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {theme === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
                            <Typography>
                                {theme === 'dark' ? 'Dark' : 'Light'} Mode
                            </Typography>
                        </Box>
                    }
                />
            </Paper>

            {/* About */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    About
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                            Version
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                            1.0.0
                        </Typography>
                    </Box>

                    <Divider />

                    <Typography variant="body2" color="text.secondary">
                        TracPro - Personal expense tracking app with Google Sheets integration
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default SettingsScreen;
