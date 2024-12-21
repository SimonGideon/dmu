import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../auth/authSlice";
import themeReducer from "../theme/themeSlice";
import promptLibraryReducer from "../chats/propmtLibrary";
import chatReducer from "../chats/chatSlice";
import authReducer from "./../auth/authSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    theme: themeReducer,
    promptLibrary: promptLibraryReducer,
    chat: chatReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
