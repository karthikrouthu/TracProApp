import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Fab,
    Drawer,
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { AppProvider, useApp } from './context/AppContext';
import ExpenseForm from './components/ExpenseForm';
import RecentExpenses from './components/RecentExpenses';
import SettingsScreen from './components/SettingsScreen';
import CategoryManager from './components/CategoryManager';
import Navigation from './components/Navigation';

const AppContent = () => {
    const { theme, isInitialized, recentExpenses, loadRecentExpenses } = useApp();
    const [currentView, setCurrentView] = useState('home');
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [loadingExpenses, setLoadingExpenses] = useState(false);

    const muiTheme = createTheme({
        palette: {
            mode: theme,
            primary: {
                main: '#6366f1',
                dark: '#4f46e5',
                light: '#818cf8',
            },
            secondary: {
                main: '#8b5cf6',
            },
            background: {
                default: theme === 'dark' ? '#111827' : '#f9fafb',
                paper: theme === 'dark' ? '#1f2937' : '#ffffff',
            },
        },
        typography: {
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 500,
                    },
                },
            },
        },
    });

    const handleExpenseAdded = async () => {
        setLoadingExpenses(true);
        await loadRecentExpenses();
        setLoadingExpenses(false);
    };

    const handleRefreshExpenses = async () => {
        setLoadingExpenses(true);
        await loadRecentExpenses();
        setLoadingExpenses(false);
    };

    if (!isInitialized) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                    pb: 10,
                }}
            >
                {/* App Bar */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}
                        >
                            TracPro
                        </Typography>
                        {currentView === 'home' && (
                            <IconButton
                                color="inherit"
                                onClick={() => setCurrentView('settings')}
                                edge="end"
                            >
                                <SettingsIcon />
                            </IconButton>
                        )}
                    </Toolbar>
                </AppBar>

                {/* Main Content */}
                <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
                    {currentView === 'home' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
                            <RecentExpenses
                                expenses={recentExpenses}
                                onRefresh={handleRefreshExpenses}
                                loading={loadingExpenses}
                            />
                        </Box>
                    )}

                    {currentView === 'settings' && (
                        <SettingsScreen onManageCategories={() => setShowCategoryManager(true)} />
                    )}

                    {currentView === 'stats' && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h5" color="text.secondary">
                                Stats Coming Soon
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Monthly summaries and analytics will be available in a future update
                            </Typography>
                        </Box>
                    )}
                </Container>

                {/* Bottom Navigation */}
                <Navigation value={currentView} onChange={setCurrentView} />

                {/* Category Manager Drawer */}
                <Drawer
                    anchor="right"
                    open={showCategoryManager}
                    onClose={() => setShowCategoryManager(false)}
                    PaperProps={{
                        sx: {
                            width: { xs: '100%', sm: 500 },
                        },
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <IconButton
                            onClick={() => setShowCategoryManager(false)}
                            sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <CategoryManager onClose={() => setShowCategoryManager(false)} />
                    </Box>
                </Drawer>
            </Box>
        </ThemeProvider>
    );
};

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App;
