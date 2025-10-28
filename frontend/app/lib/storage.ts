export const STORAGE_KEYS = {
  USER_ID: 'userId',
  USER_NAME: 'userName',
  KOLOK_NAME: 'kolokName',
};

export const storage = {
  getUserId: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.USER_NAME);
  },
  setUserId: (id: string): void => {
    localStorage.setItem(STORAGE_KEYS.USER_ID, id);
  },

  getUserName: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.USER_NAME);
  },

  setUserName: (name: string): void => {
    localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  },

  getKolokName: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.KOLOK_NAME);
  },

  setKolokName: (kolokName: string): void => {
    localStorage.setItem(STORAGE_KEYS.KOLOK_NAME, kolokName);
  },

  clearUserName: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
  },

  clearKolokName: (): void => {
    localStorage.removeItem(STORAGE_KEYS.KOLOK_NAME);
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.KOLOK_NAME);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
  },
};
