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
        },
        error: {
            authFailed: false,
            userNotFound: false,
            duplicateUser: false
        },
    },
    reducers: {
        logIn(state, action) {
            state.isLoggedIn = true;
            state.error = {
                authFailed: false,
            userNotFound: false,
            duplicateUser: false
            };
            state.profile = {
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
                attemptedQuizzes: action.payload.attemptedQuizzes || []
            };
        },
        signUp(state, action) {
            state.isLoggedIn = true;
            state.error = {
                authFailed: false,
                userNotFound: false,
                duplicateUser: false
            };
            state.profile = {
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
                attemptedQuizzes: action.payload.attemptedQuizzes || []
            }
        },
        setAuthFailed(state, action) {
            state.error.authFailed = action.payload.authFailed;
        },
        loginFailed(state, action) {
            if (action.payload?.userNotFound) {
                state.userNotFound = true;
            } else {
                state.authFailed = true;
            }
        },
        signupFailed(state, action) {
            if (action.payload?.duplicateUser) {
                state.duplicateUser = true;
            } else {
                state.authFailed = true;
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