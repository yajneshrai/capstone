import { gql, useQuery } from '@apollo/client';
import { shuffleArray } from "../util/helpers";
import { quizActions } from "./quiz-slice";

export const fetchCategories = () => {
    return async (dispatch) => {
        const GET_CATEGORIES = gql `
            query getCategories {
                categoryId,
                categoryName
            }
        `;

        const { loading, data, error } = useQuery(GET_CATEGORIES);
        
        console.log(data);
        
        dispatch(quizActions.setIsFetchingCategories({
            isFetching: true
        }));

        /* const resp = await fetch('https://opentdb.com/api_category.php');
        const data = await resp.json(); */
        
        dispatch(quizActions.setIsFetchingCategories({
            isFetching: false
        }));

        dispatch(quizActions.setCategories({
            categories: data //.trivia_categories
        }));
    }
}

export const fetchQuestions = ({ categoryId, amount, difficulty, type }) => {
    return async (dispatch) => {
        dispatch(quizActions.setIsFetchingQuestions({
            isFetching: true
        }));

        let searchString = `category=${categoryId}&amount=${amount}`;

        if (difficulty !== 'any') {
            searchString += `&difficulty=${difficulty}`;
        }

        if (type !== 'any') {
            searchString += `&type=${type}`;
        }

        const resp = await fetch(`https://opentdb.com/api.php?${searchString}`);
        const data = await resp.json();
        let questions = data.results;

        questions = questions.map(q => ({
            question: q.question,
            options: shuffleArray([ 
                ...q.incorrect_answers.map(ans => ({ option: ans, correct: false, selected: false })),
                { option: q.correct_answer, correct: true, selected: false }
            ])
        }));

        dispatch(quizActions.setQuestions({
            questions
        }));

        dispatch(quizActions.setActiveQuestionNumber(0));

        dispatch(quizActions.setIsFetchingQuestions({
            isFetching: false
        }));
    
    }
}
