/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api/api';

interface Theme {
  id: number;
  name: string;
  logo: string | null;
  favicon: string | null;
  background_image: string | null;
  colors: {
    default: string;
    primary?: string | null;
    secondary?: string | null;
    accent?: string | null;
  };
  country: string;
  description: string;
  sub_tenants: any[];
  website: string | null;
  physical_address: string | null;
  details: string | null;
}

interface ThemeState {
  tenantTheme: Theme | null;
  loading: boolean;
  error: string | null;
}

export const fetchTheme = createAsyncThunk<Theme, void>(
  "theme/fetchTheme",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('tenant/');
      if (!response || response.status !== 200) {
        throw new Error('Failed to fetch theme data');
      }
      const data = response.data;
      if (data.results.length > 0) {
        const themeData = data.results[0];
        return {
          id: themeData.id,
          name: themeData.name,
          logo: themeData.logo,
          favicon: themeData.favicon,
          background_image: themeData.background_image,
          colors: {
            default: themeData.default_color,
            primary: themeData.primary_color,
            secondary: themeData.secondary_color,
            accent: themeData.accent_color,
          },
          country: themeData.country,
          description: themeData.description,
          sub_tenants: themeData.sub_tenants,
          website: themeData.website,
          physical_address: themeData.physical_address,
          details: themeData.details,
        };
      } else {
        throw new Error('No theme data available');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    tenantTheme: null,
    loading: false,
    error: null,
  } as ThemeState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTheme.fulfilled, (state, action) => {
        state.tenantTheme = action.payload;
        state.loading = false;
      })
      .addCase(fetchTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default themeSlice.reducer;
