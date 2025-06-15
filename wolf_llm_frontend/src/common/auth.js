// トークン取得など共通ユーティリティ
import { API_BASE } from './api';

const TOKEN_KEY = 'webnovelgame_auth_token';
const USER_KEY = 'webnovelgame_user';

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const setUserInfo = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserInfo = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
