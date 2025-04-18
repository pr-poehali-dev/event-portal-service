import { User } from '@/types/events';

const API_URL = 'https://your-api-url.com/api';

// Регистрация нового пользователя
export const register = async (username: string, email: string, password: string): Promise<{ user: User, token: string }> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка при регистрации');
  }
  
  return response.json();
};

// Авторизация пользователя
export const login = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка при входе');
  }
  
  return response.json();
};

// Получить текущего пользователя
export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Не удалось получить данные пользователя');
  }
  
  return response.json();
};

// Выход из системы
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
