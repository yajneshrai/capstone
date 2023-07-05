import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { gql, useQuery } from '@apollo/client';

import Banner from "../../components/Layout/Banner";
import Loading from "../../components/Layout/Loading";
import QuizCategories from "../../components/Quiz/Categories";
import { quizActions } from "../../store/quiz-slice";

const QuizCategoriesPage = () => {
    const [skip, setSkip] = useState(false)
    const dispatch = useDispatch();
    
    const GET_CATEGORIES = gql`
        query {
            categories {
                categoryId,
                categoryName,
                custom
            }
        }
    `;

    const { loading, data } = useQuery(GET_CATEGORIES, { skip });
    
    useEffect(() => {
        if (!loading && data) {
            setSkip(true);
            
            dispatch(quizActions.setCategories({
                categories: data.categories
            }));
        }
    }, [loading, data, dispatch]);
    
    return (
        <>
            <Banner>
                <Heading as='h1' size='2xl' noOfLines={2} className="fw-300">
                    Pick your favorite category
                </Heading>
                <p className="mar-top--1rem">
                    You get to select the difficulty level and type of questions!
                </p>
            </Banner>
            { loading && <Loading /> }
            { !loading && <QuizCategories /> }
        </>
        
    )
};

export default QuizCategoriesPage;

