import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        allCategories: [],
    },
    reducers: {
        setCategories(state, action) {
            state.allCategories = action.payload.categories;
        },
        addCategory(state, action) {

        },
        addQuestionsToCategory(state, action) {

        },
        removeQuestionsFromCategory(state, action) {

        },
        toggleCategoryVisibility(state, action) {

        }
    }
});

export default adminSlice;

export const adminActions = adminSlice.actions;