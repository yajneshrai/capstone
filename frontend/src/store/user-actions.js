import { userActions } from "./user-slice";
import axios from 'axios';

export const userLogin = ({ email, password }) => {
    return async (dispatch) => {
        try {
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

        } catch (e) {

        }
    }
}

export const userSignup = ({ name, email, password, role }) => {
    return async (dispatch) => {
        /* dispatch(quizActions.setIsFetchingCategories({
            isFetching: true
        }));

        const resp = await fetch('https://opentdb.com/api_category.php');
        const data = await resp.json(); */
        
        dispatch(userActions.signUp({
            name,
            email,
            role
        }));

    }
}