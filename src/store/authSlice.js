import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            window.localStorage.setItem('user', JSON.stringify(action.payload));
        },
        removeUser: (state) => {
            state.user = null;
            window.localStorage.removeItem('user');
        },
        setUserFromLocalStorage: (state) => {
            const user = window.localStorage.getItem('user');
            if (user) {
                state.user = JSON.parse(user);
            }
        }
    }
});

export const { setUser, removeUser, setUserFromLocalStorage } = authSlice.actions;

export default authSlice.reducer;
