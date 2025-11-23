import React, { createContext, useContext, useState, useEffect } from 'react';
import { initGoogleAuth, initGapiClient, isAuthenticated as checkAuth } from '../services/auth';
import { getConfig, getRecentExpenses } from '../services/googleSheets';
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

    // Load configuration from Google Sheets
    const loadConfig = async () => {
        try {
            setLoading(true);
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
    const updateAuthStatus = (status) => {
        setIsAuthenticated(status);
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
        updateAuthStatus,
        updateSheetConfig,
        toggleTheme,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
