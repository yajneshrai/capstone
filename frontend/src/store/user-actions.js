import { userActions } from "./user-slice";
import axios from 'axios';

export const userLogin = ({ email, password }) => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setAuthFailed({ authFailed: false }));

            const { data } = await axios.post('http://localhost:9000/api/login', {
                email, password
            });

            if (data.userFound) {
                const user = {
                    name: data.user.name,
                    email,
                    role: data.user.role,
                    attemptedQuizzes: data.user.attemptedQuizzes
                };
                localStorage.setItem('user', JSON.stringify(user));
                dispatch(userActions.logIn({ ...user }));
            }
            else {
                dispatch(userActions.setAuthFailed({ authFailed: true }));
                dispatch(userActions.loginFailed({ userNotFound: true }));
            }
        } catch (e) {
            console.error(e);
            dispatch(userActions.setAuthFailed({ authFailed: true }));
            dispatch(userActions.loginFailed());
        }
    }
}

export const userSignup = ({ name, email, password, role }) => {
    return async (dispatch) => {        
        try {
            dispatch(userActions.setAuthFailed({ authFailed: false }));

            const { data } = await axios.put('http://localhost:9000/api/signup', {
                name, email, password, role
            });

            if (data.user) {
                const user = {
                    name,
                    email,
                    role,
                    attemptedQuizzes: []
                };
                localStorage.setItem('user', JSON.stringify(user));
                dispatch(userActions.signUp({ ...user }));
            }
            else if (data.duplicateUser) {
                dispatch(userActions.setAuthFailed({ authFailed: true }));
                dispatch(userActions.signupFailed({ duplicateUser: true }));
            }
        } catch (e) {
            console.error(e);
            dispatch(userActions.setAuthFailed({ authFailed: true }));
            dispatch(userActions.signupFailed());
        }
    }
}