import Cookies from 'js-cookie';
import { isAuthenticated } from './authUtils';

export const getCookie = (name: string): string | null => {
  return Cookies.get(name) || null;
};

export const deleteCookie = (name: string): void => {
  Cookies.remove(name);
};

export const anonymousDisposal = (): void => {
  if(!isAuthenticated()) {
  deleteCookie('anonymousid');
  deleteCookie('chat_id');
  }
};

export const isChartInitialized = (): boolean => {
  if (isAuthenticated()) {
    return !!getCookie('chat_id') && !!getCookie('user_id');
  }
  return !!getCookie('anonymousid') && !!getCookie('chat_id');
}
