import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginService, register as registerService, getMe } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const login = async (tc_no, password) => {
        setIsLoading(true);
        try {
            const data = await loginService(tc_no, password);
            // data: { access_token, token_type }
            await SecureStore.setItemAsync('userToken', data.access_token);
            setUserToken(data.access_token);

            // Fetch user info immediately after login
            const userProfile = await getMe();
            setUserInfo(userProfile);

        } catch (e) {
            console.log('Login error:', e);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (ad, soyad, tc_no, password) => {
        setIsLoading(true);
        try {
            await registerService(ad, soyad, tc_no, password);
        } catch (e) {
            console.log('Register error:', e);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        await SecureStore.deleteItemAsync('userToken');
        setUserToken(null);
        setUserInfo(null);
        setIsLoading(false);
    };

    const isLoggedIn = async () => {
        try {
            console.log("AuthContext: Starting check...");
            setIsLoading(true);
            let token = await SecureStore.getItemAsync('userToken');
            console.log("AuthContext: Token found:", token);
            setUserToken(token);

            if (token) {
                const userProfile = await getMe();
                setUserInfo(userProfile);
            }

        } catch (e) {
            console.log(`AuthContext Error: ${e}`);
        } finally {
            console.log("AuthContext: Check finished, stopping loading.");
            setIsLoading(false);
        }
    }

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ login, register, logout, isLoading, userToken, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
