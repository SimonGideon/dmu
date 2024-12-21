import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTheme } from '../redux/theme/themeSlice';
import { RootState, AppDispatch } from '../redux/store';

export const useCustomTheme = () => {

  const dispatch: AppDispatch = useDispatch();
  const { tenantTheme, loading, error } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    dispatch(fetchTheme());
  }, [dispatch]);

  useEffect(() => {
    if (tenantTheme && tenantTheme.colors) {
      document.documentElement.style.setProperty('--primary-color', tenantTheme.colors.primary || '#10b981');
      document.documentElement.style.setProperty('--secondary-color', tenantTheme.colors.secondary || '#6b7280');
      document.documentElement.style.setProperty('--accent-color', tenantTheme.colors.accent || '#3b82f6');
      document.documentElement.style.setProperty('--background-color', tenantTheme.colors.default || '#fffeee');

      if (tenantTheme.name) {
        document.title = tenantTheme.name;
      } else {
        document.title = 'EXAI';
      }
    const favicon = tenantTheme.favicon || '/favicon.ico';
    let linkTag = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.rel = 'icon';
      document.head.appendChild(linkTag);
    }
    linkTag.href = favicon;
    } else {
        document.title = 'EXAI';
        }
  }, [tenantTheme]);

  return { tenantTheme, loading, error };
};
