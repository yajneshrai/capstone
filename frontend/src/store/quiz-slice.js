import { createSlice } from '@reduxjs/toolkit';

const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        categories: [],
        isFetchingCategories: false,
        isFetchingQuestions: false,
        selectedCategory: {
            categoryId: '',
            categoryName: '',
            noOfQuestions: 0,
            difficulty: '',
            type: '',
        },
        questions: [],
        activeQuestion: {
            question: '',
            options: []
        },
        result: {
            score: 0
        }
    },
    reducers: {
        setCategories(state, action) {
            state.categories = action.payload.categories.map(category => ({
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                custom: category.custom
            }));
        },
        setIsFetchingCategories(state, action) {
            state.isFetchingCategories = action.payload.isFetching;
        },
        selectCategory(state, action) {
            state.selectedCategory = {
                categoryId: action.payload.categoryId,
                categoryName: action.payload.categoryName,
                custom: action.payload.custom
            }
        },
        setIsFetchingQuestions(state, action) {
            state.isFetchingQuestions = action.payload.isFetching;
        },
        setQuestions(state, action) {
            state.questions = action.payload.questions;
        },
        setCategoryQuizPreference(state, action) {
            state.selectedCategory.noOfQuestions = +action.payload.amount;
            state.selectedCategory.difficulty = action.payload.difficulty;
            state.selectedCategory.type = action.payload.type;
        },
        setActiveQuestionNumber(state, action) {
            state.activeQuestionNumber = action.payload;
            state.activeQuestion = state.questions[action.payload];
        },
        changeAnswerOption(state, action) {
            state.activeQuestion.options.forEach(op => {
                if (action.payload.checked) {
                    op.selected = op.option === action.payload.currentOption.option;
                } else {
                    op.selected = action.payload.checked;
                }
            });
            state.questions[state.activeQuestionNumber].options = state.activeQuestion.options;
        },
        submitQuiz(state, action) {
            state.result.score = 0;
            state.questions.forEach(question => {
                const isCorrect = question.options.find(option => option.correct && option.selected);
                if (isCorrect) {
                    state.result.score++;
                }
            })
        } 
    }
});

export default quizSlice;

export const quizActions = quizSlice.actions;