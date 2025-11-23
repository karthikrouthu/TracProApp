import { saveGoogleToken, loadGoogleToken, removeFromStorage } from './storage';
import { GOOGLE_SCOPES, STORAGE_KEYS } from '../utils/constants';

let tokenClient = null;
let gapiInitialized = false;

/**
 * Initialize Google API client
 */
export const initGoogleAuth = () => {
    return new Promise((resolve, reject) => {
        // Load Google Identity Services
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

            if (!clientId || clientId.includes('your_google_client_id')) {
                reject(new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in .env file'));
                return;
            }

            tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: GOOGLE_SCOPES.join(' '),
                callback: '', // Will be set when requesting token
            });

            resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
        document.head.appendChild(script);
    });
};

/**
 * Initialize GAPI client for Sheets API
 */
export const initGapiClient = async () => {
    if (gapiInitialized) return;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            window.gapi.load('client', async () => {
                try {
                    await window.gapi.client.init({
                        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                    });

                    // Set the token if we have one
                    const token = loadGoogleToken();
                    if (token) {
                        window.gapi.client.setToken({ access_token: token });
                    }

                    gapiInitialized = true;
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };
        script.onerror = () => reject(new Error('Failed to load GAPI'));
        document.head.appendChild(script);
    });
};

/**
 * Request access token
 */
export const requestAccessToken = () => {
    return new Promise((resolve, reject) => {
        if (!tokenClient) {
            reject(new Error('Token client not initialized'));
            return;
        }

        tokenClient.callback = async (response) => {
            if (response.error) {
                reject(response);
                return;
            }

            // Set the access token for GAPI
            window.gapi.client.setToken({ access_token: response.access_token });

            // Save token
            saveGoogleToken(response.access_token);

            resolve(response.access_token);
        };

        // Always request a fresh token to avoid 401/403 errors
        tokenClient.requestAccessToken({ prompt: '' });
    });
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    const token = loadGoogleToken();
    return !!token;
};

/**
 * Sign out
 */
export const signOut = () => {
    const token = loadGoogleToken();
    if (token) {
        window.google.accounts.oauth2.revoke(token, () => {
            console.log('Token revoked');
        });
    }

    removeFromStorage(STORAGE_KEYS.GOOGLE_TOKEN);

    if (window.gapi && window.gapi.client) {
        window.gapi.client.setToken(null);
    }
};

/**
 * Get current access token
 */
export const getAccessToken = () => {
    return loadGoogleToken();
};

/**
 * Ensure token is set in GAPI client
 */
export const ensureTokenSet = () => {
    const token = loadGoogleToken();
    if (token && window.gapi && window.gapi.client) {
        window.gapi.client.setToken({ access_token: token });
    }
    return !!token;
};

/**
 * Get user profile information
 */
export const getUserProfile = async () => {
    try {
        const token = loadGoogleToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        // Use Google's userinfo endpoint
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get user profile');
        }

        const profile = await response.json();
        return {
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
        };
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};
