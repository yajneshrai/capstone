import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./admin-slice";
import quizSlice from "./quiz-slice";
import userSlice from "./user-slice";

const store = configureStore({
    reducer: {
        quiz: quizSlice.reducer,
        user: userSlice.reducer,
        admin: adminSlice.reducer
    }
});

export default store;