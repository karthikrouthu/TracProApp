import React, { createContext, useContext, useState, useEffect } from 'react';
import { initGoogleAuth, initGapiClient, isAuthenticated as checkAuth, getUserProfile } from '../services/auth';
import { getConfig, getRecentExpenses, getUserConfig, saveUserConfig } from '../services/googleSheets';
import {
    loadSheetConfig,
    loadLastPaidBy,
    loadCachedExpenseTypes,
    loadCachedPaymentTypes,
    loadCachedUsers,
    loadCachedRecentExpenses,
    cacheExpenseTypes,
    cachePaymentTypes,
    cacheUsers,
    cacheRecentExpenses,
    loadTheme,
    saveTheme as saveThemeToStorage,
    saveSheetConfig,
} from '../services/storage';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [sheetConfig, setSheetConfig] = useState({ sheetId: null, sheetName: null });
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [users, setUsers] = useState([]);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [lastPaidBy, setLastPaidBy] = useState('');
    const [theme, setTheme] = useState('light');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize app
    useEffect(() => {
        const init = async () => {
            try {
                // Load cached data
                const config = loadSheetConfig();
                setSheetConfig(config);

                const cachedExpenseTypes = loadCachedExpenseTypes();
                const cachedPaymentTypes = loadCachedPaymentTypes();
                const cachedUsers = loadCachedUsers();
                const cachedRecent = loadCachedRecentExpenses();
                const savedLastPaidBy = loadLastPaidBy();
                const savedTheme = loadTheme();

                setExpenseTypes(cachedExpenseTypes);
                setPaymentTypes(cachedPaymentTypes);
                setUsers(cachedUsers);
                setRecentExpenses(cachedRecent);
                setLastPaidBy(savedLastPaidBy || '');
                setTheme(savedTheme);

                // Initialize Google APIs
                await initGoogleAuth();
                await initGapiClient();

                // Check authentication
                const authenticated = checkAuth();
                setIsAuthenticated(authenticated);

                setIsInitialized(true);
            } catch (error) {
                console.error('Initialization error:', error);
                setError(error.message);
                setIsInitialized(true);
            }
        };

        init();
    }, []);

    // Load user profile
    const loadUserProfile = async () => {
        try {
            const profile = await getUserProfile();
            setUserEmail(profile.email);
            return profile;
        } catch (error) {
            console.error('Error loading user profile:', error);
            return null;
        }
    };

    // Load configuration from Google Sheets (user-specific)
    const loadConfig = async () => {
        try {
            setLoading(true);

            // Get user profile first
            const profile = await loadUserProfile();

            if (profile && profile.email) {
                // Try to load user-specific config
                const userConfig = await getUserConfig(profile.email);

                if (userConfig) {
                    console.log('Loaded user-specific config for:', profile.email);

                    // Update sheet config if user has a different sheet
                    if (userConfig.sheetId && userConfig.sheetId !== sheetConfig.sheetId) {
                        saveSheetConfig(userConfig.sheetId, 'User Sheet');
                        setSheetConfig({ sheetId: userConfig.sheetId, sheetName: 'User Sheet' });
                    }

                    setExpenseTypes(userConfig.expenseTypes);
                    setPaymentTypes(userConfig.paymentTypes);
                    setUsers(userConfig.users);

                    // Cache the data
                    cacheExpenseTypes(userConfig.expenseTypes);
                    cachePaymentTypes(userConfig.paymentTypes);
                    cacheUsers(userConfig.users);

                    return userConfig;
                }
            }

            // Fallback to default config
            const config = await getConfig();

            setExpenseTypes(config.expenseTypes);
            setPaymentTypes(config.paymentTypes);
            setUsers(config.users);

            // Cache the data
            cacheExpenseTypes(config.expenseTypes);
            cachePaymentTypes(config.paymentTypes);
            cacheUsers(config.users);

            return config;
        } catch (error) {
            console.error('Error loading config:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Save user-specific settings
    const saveUserSettings = async () => {
        try {
            if (!userEmail) {
                const profile = await loadUserProfile();
                if (!profile) {
                    throw new Error('User not authenticated');
                }
            }

            await saveUserConfig(userEmail, {
                sheetId: sheetConfig.sheetId,
                expenseTypes,
                paymentTypes,
                users,
            });

            console.log('User settings saved for:', userEmail);
            return true;
        } catch (error) {
            console.error('Error saving user settings:', error);
            throw error;
        }
    };

    // Load recent expenses
    const loadRecentExpenses = async () => {
        try {
            const expenses = await getRecentExpenses(10);
            setRecentExpenses(expenses);
            cacheRecentExpenses(expenses);
            return expenses;
        } catch (error) {
            console.error('Error loading recent expenses:', error);
            return [];
        }
    };

    // Update authentication status
    const updateAuthStatus = async (status) => {
        setIsAuthenticated(status);
        if (status) {
            // Load user profile when authenticated
            await loadUserProfile();
        } else {
            setUserEmail(null);
        }
    };

    // Update sheet configuration
    const updateSheetConfig = (config) => {
        setSheetConfig(config);
    };

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        saveThemeToStorage(newTheme);
    };

    const value = {
        isAuthenticated,
        isInitialized,
        userEmail,
        sheetConfig,
        expenseTypes,
        paymentTypes,
        users,
        recentExpenses,
        lastPaidBy,
        theme,
        loading,
        error,
        setExpenseTypes,
        setPaymentTypes,
        setUsers,
        setLastPaidBy,
        setRecentExpenses,
        setError,
        loadConfig,
        loadRecentExpenses,
        loadUserProfile,
        saveUserSettings,
        updateAuthStatus,
        updateSheetConfig,
        toggleTheme,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
