/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { initializeChat, fetchChatHistory, deleteChat } from '../api/chats';

interface ChatResponse {
  anonymousid?: string;
  chat_id: string;
  user_id?: string;
}

interface ChatHistory {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  chat_id: string;
  author: number;
  deleted_flag: string;
}

interface ChatState {
  loading: boolean;
  error: string | null;
  res: ChatResponse | null;
  history: ChatHistory[];
  chatId: string | null;
}

const initialState: ChatState = {
  loading: false,
  error: null,
  res: null,
  history: [],
  chatId: null,
};

// Async thunk for chat history
export const chartHistory = createAsyncThunk<
  ChatHistory[],
  void,
  { rejectValue: string }
>(
  'chat/fetchChatHistory',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchChatHistory();
      return data;
    } catch (error: any) {
      console.error('Chat history fetch error:', error.message);
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch chat history'
      );
    }
  }
);

export const deleteChatMessage = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'chat/deleteChatMessage',
  async (chat_id, { rejectWithValue }) => {
    try {
      await deleteChat(chat_id);
    } catch (error: any) {
      console.error('Chat deletion error:', error.message);
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to delete chat message'
      );
    }
  }
);

// Async thunk for initializing chat
export const initializeChatData = createAsyncThunk<
  ChatResponse,
  void,
  { rejectValue: string }
>(
  'chat/initializeChatData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await initializeChat();
      return data;
    } catch (error: any) {
      console.error('Chat initialization error:', error.detail);
      return rejectWithValue(error.detail || 'Failed to initialize chat');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatId(state, action: PayloadAction<string>) {
      state.chatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Chat Data
      .addCase(initializeChatData.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeChatData.fulfilled, (state, action) => {
        state.loading = false;
        state.res = action.payload;
        state.error = null;
      })
      .addCase(initializeChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unknown error occurred';
      })

      // Fetch Chat History
      .addCase(chartHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(chartHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
        state.error = null;
      })
      .addCase(chartHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unknown error occurred';
      })

      // Delete Chat Message
      .addCase(deleteChatMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.history = state.history.filter((chat) => chat.chat_id !== action.meta.arg);
      })
      .addCase(deleteChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unknown error occurred';
      });
  },
});
export const { setChatId } = chatSlice.actions;
export default chatSlice.reducer;
