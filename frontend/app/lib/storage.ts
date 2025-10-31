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
    // Dispatcher un event custom pour notifier les composants
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('userIdChanged', { detail: id }));
    }
  },

  clearUserId: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    // Dispatcher un event custom pour notifier les composants
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('userIdChanged', { detail: null }));
    }
  },
};
