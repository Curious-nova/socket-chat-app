import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";
import { createChatSlice } from "./slices/chat-slice";

export const useAppstore= create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}));