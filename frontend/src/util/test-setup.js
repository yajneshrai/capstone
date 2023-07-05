import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import adminSlice from "../store/admin-slice";
import quizSlice from "../store/quiz-slice";
import userSlice from "../store/user-slice";

const appStore = configureStore({
    reducer: {
        quiz: quizSlice.reducer,
        user: userSlice.reducer,
        admin: adminSlice.reducer
    }
});

const renderWithProviders = (ui, { store = configureStore({
    reducer: {
        quiz: quizSlice.reducer,
        user: userSlice.reducer,
        admin: adminSlice.reducer
    }}), ...renderOptions }) => {
    const Wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
    );

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export default renderWithProviders;