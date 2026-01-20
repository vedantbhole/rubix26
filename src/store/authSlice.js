import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        updateUser: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        setBookmarks: (state, action) => {
            if (state.user) {
                state.user.bookmarkedPlants = action.payload;
            }
        },
        addBookmark: (state, action) => {
            if (state.user && !state.user.bookmarkedPlants?.includes(action.payload)) {
                state.user.bookmarkedPlants = [...(state.user.bookmarkedPlants || []), action.payload];
            }
        },
        removeBookmark: (state, action) => {
            if (state.user) {
                state.user.bookmarkedPlants = state.user.bookmarkedPlants?.filter(
                    id => id !== action.payload
                ) || [];
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const {
    login,
    logout,
    updateUser,
    setBookmarks,
    addBookmark,
    removeBookmark,
    setLoading
} = authSlice.actions;

export default authSlice.reducer;
