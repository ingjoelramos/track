import Cookies from 'js-cookie';
import { User } from '../types';

export const DEMO_USERS = [
  { id: 'admin', email: 'admin@demo.io', name: 'Admin User', role: 'admin' },
  { id: 'analyst', email: 'analyst@demo.io', name: 'Analyst User', role: 'analyst' },
  { id: 'user', email: 'user@demo.io', name: 'Regular User', role: 'analyst' }
];

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function login(email: string, password: string): User | null {
  const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user) {
    // Generate a demo JWT token
    const token = btoa(JSON.stringify({ 
      id: user.id, 
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
    
    // Store auth data
    Cookies.set(TOKEN_KEY, token, { 
      expires: 1, // 1 day
      sameSite: 'strict',
      secure: window.location.protocol === 'https:'
    });
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return user;
  }
  
  return null;
}

export function register(data: { email: string; name: string; password: string }): boolean {
  // In demo mode, just pretend to register
  return true;
}

export function logout(): void {
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser(): User | null {
  const token = Cookies.get(TOKEN_KEY);
  const userData = localStorage.getItem(USER_KEY);
  
  // Clear invalid state
  if (!token || !userData) {
    logout();
    return null;
  }
  
  try {
    // Verify token expiration
    const { exp } = JSON.parse(atob(token));
    if (exp < Date.now()) {
      logout();
      return null;
    }
    
    return JSON.parse(userData);
  } catch (e) {
    logout();
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}

export function hasRole(requiredRole: 'admin' | 'analyst'): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  if (requiredRole === 'analyst') return true; // Admin can do analyst tasks
  return user.role === requiredRole;
}