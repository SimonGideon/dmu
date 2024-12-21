/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPromptLibrary } from "../api";

import { PromptLibraryData } from "./types";

interface PromptLibraryState {
  loading: boolean;
  error: string | null;
  res: PromptLibraryData | null;
}

// Initial state
const initialState: PromptLibraryState = {
  loading: false,
  error: null,
  res: null,
};

// Async thunk to fetch prompt library data
export const fetchPromptLibraryData = createAsyncThunk<
  PromptLibraryData, // The return type of the fulfilled action
  void, // The argument type for the thunk
  { rejectValue: string } // The type for the reject value
>("promptLibrary/fetchPromptLibraryData", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchPromptLibrary(); // Assumes fetchPromptLibrary returns a Promise<PromptLibraryData>
    return data;
  } catch (error: unknown) {
    console.error("Prompt Library fetch error:", (error as Error).message);
    return rejectWithValue((error as Error).message);
  }
});

const promptLibrarySlice = createSlice({
  name: "promptLibrary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromptLibraryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPromptLibraryData.fulfilled, (state, action) => {
        state.loading = false;
        state.res = action.payload;
        state.error = null;
      })
      .addCase(fetchPromptLibraryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An unknown error occurred";
      });
  },
});

export default promptLibrarySlice.reducer;
