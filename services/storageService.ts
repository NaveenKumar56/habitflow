import { Habit, User } from '../types';
import { DEFAULT_HABITS } from '../constants';

const USERS_KEY = 'yuuhi_users';
const SESSION_KEY = 'yuuhi_session';
const DATA_PREFIX = 'yuuhi_data_';

// --- User Management ---

export const getUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) { return []; }
};

export const addUser = (user: User): boolean => {
  const users = getUsers();
  if (users.find(u => u.username === user.username)) {
    return false; // User exists
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  // Initialize default habits for new user
  saveHabits(user.username, DEFAULT_HABITS as Habit[]);
  return true;
};

export const verifyUser = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
};

// --- Session Management ---

export const setSession = (username: string, remember: boolean) => {
  if (remember) {
    localStorage.setItem(SESSION_KEY, username);
  } else {
    sessionStorage.setItem(SESSION_KEY, username);
    localStorage.removeItem(SESSION_KEY);
  }
};

export const getSessionUser = (): User | null => {
  let username = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
  if (!username) return null;
  const users = getUsers();
  return users.find(u => u.username === username) || null;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
};

// --- Data Management ---

export const loadHabits = (username: string): Habit[] => {
  try {
    const key = `${DATA_PREFIX}${username}`;
    const stored = localStorage.getItem(key);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load habits", error);
    return [];
  }
};

export const saveHabits = (username: string, habits: Habit[]): void => {
  try {
    const key = `${DATA_PREFIX}${username}`;
    localStorage.setItem(key, JSON.stringify(habits));
  } catch (error) {
    console.error("Failed to save habits", error);
  }
};