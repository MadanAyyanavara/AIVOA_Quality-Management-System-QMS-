import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, ChatMessage } from '../../types';

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearChat: (state) => {
      state.messages = [];
      state.error = null;
      state.isLoading = false;
    },

    updateLastMessage: (state, action: PayloadAction<{ content: string }>) => {
      if (state.messages.length > 0) {
        const lastMessage = state.messages[state.messages.length - 1];
        lastMessage.content = action.payload.content;
      }
    },
  },
});

export const { addMessage, setLoading, setError, clearChat, updateLastMessage } =
  chatSlice.actions;

export default chatSlice.reducer;
