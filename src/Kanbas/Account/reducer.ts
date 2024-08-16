import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the user
interface User {
    id: string;
    username: string;
    role: string;
    // Add other user properties as needed
}

// Define the state type
interface AccountState {
    currentUser: User | null;
}

// Initial state
const initialState: AccountState = { currentUser: null };

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<User | null>) => {
            state.currentUser = action.payload;
        },
    },
});

export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;
