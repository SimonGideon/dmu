import Cookies from 'js-cookie';

const COOKIE_NAME = 'userSession';
const SESSION_EXPIRY_MINUTES = 5;
export const REGENERATION_DELAY_MS = 1 * 60 * 1000;
export const SESSION_CHECK_INTERVAL_MS = 1000;
export const SESSION_REGENERATION_DELAY_MS = 1 * 60 * 1000;

export const setSession = (): void => {
  const expiryTime = new Date(new Date().getTime() + SESSION_EXPIRY_MINUTES * 60 * 1000);
  Cookies.set(COOKIE_NAME, 'active', { expires: expiryTime });
};


export const clearSession = (): void => {
  Cookies.remove(COOKIE_NAME);
};

export const isSessionActive = (): boolean => {
  return Cookies.get(COOKIE_NAME) === 'active';
};

export const regenerateSessionAfterDelay = (delay: number): void => {
  setTimeout(() => {
    setSession();
  }, delay);
};

export const startSessionCheck = (interval: number, onSessionExpired: () => void): NodeJS.Timeout => {
  return setInterval(() => {
    if (!isSessionActive()) {
      onSessionExpired();
    }
  }, interval);
};
