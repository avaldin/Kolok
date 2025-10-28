export const STORAGE_KEYS = {
  USER_ID: 'userId',
};

export const storage = {
  getUserId: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.USER_ID);
  },

  setUserId: (id: string): void => {
    localStorage.setItem(STORAGE_KEYS.USER_ID, id);
  },

  clearUserId: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
  },
};
