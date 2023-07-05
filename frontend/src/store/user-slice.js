import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        profile: {
            name: '',
            email: '',
            role: '',
            attemptedQuizzes: []
        }
    },
    reducers: {
        logIn(state, action) {
            state.isLoggedIn = true;
            state.profile = {
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
                attemptedQuizzes: action.payload.attemptedQuizzes || []
            }
        },
        signUp(state, action) {
            state.isLoggedIn = true;
            state.profile = {
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
                attemptedQuizzes: action.payload.attemptedQuizzes || []
            }
        },
        logOut(state, action) {
            state.isLoggedIn = false;
            state.profile = null;
        }
    }
});

export default userSlice;

export const userActions = userSlice.actions;