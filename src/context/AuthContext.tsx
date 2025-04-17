import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosInstance } from 'axios';
import { User, JwtToken, ApiResponse } from '../types';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
    reissueToken: () => Promise<void>;
    api: AxiosInstance;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

    const api: AxiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    useEffect(() => {
        if (accessToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [accessToken]);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response = await api.post<ApiResponse<JwtToken>>('/auth/login', { email, password });
            const { accessToken, refreshToken } = response.data.data;
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            api.defaults.headers.common['x-refresh-token'] = refreshToken;

            const userResponse = await api.get<ApiResponse<User>>('/users/me');
            setUser(userResponse.data.data);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || '로그인 실패');
        }
    };

    const signup = async (email: string, password: string, username: string): Promise<void> => {
        try {
            await api.post('/auth/sign-up', { email, password, username });
        } catch (error: any) {
            throw new Error(error.response?.data?.message || '회원가입 실패');
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || '로그아웃 실패');
        }
    };

    const reissueToken = async (): Promise<void> => {
        try {
            const response = await api.post<ApiResponse<JwtToken>>('/auth/reissue');
            const { accessToken, refreshToken } = response.data.data;
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        } catch (error: any) {
            logout();
            throw new Error('토큰 재발급 실패');
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, accessToken, login, signup, logout, reissueToken, api }}
        >
            {children}
        </AuthContext.Provider>
    );
};