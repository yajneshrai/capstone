import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Card, CardFooter, CardHeader, Heading, SimpleGrid } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useNavigate } from "react-router-dom";
import { quizActions } from "../../store/quiz-slice";

const QuizCategories = () => {
    const categories = useSelector(state => state.quiz.categories);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const selectCategory = (category) => {
        dispatch(quizActions.selectCategory({
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            custom: category.custom
        }));

        navigate({
            pathname: `/quiz/${category.categoryId}`,
            search: createSearchParams({ name: category.categoryName }).toString()
        });
    }

    return (
        <div className="wrapper pad-top--2rem">
            <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(250px, 1fr))'>
                {
                    categories.map(category => (
                        <Card key={category.categoryId}>
                            <CardHeader>
                                <Heading size='md'> {category.categoryName} </Heading>
                            </CardHeader>
                            
                            <CardFooter>
                                <Button rightIcon={<ArrowForwardIcon />}
                                    onClick={selectCategory.bind(null, category)}>Explore</Button>
                            </CardFooter>
                        </Card>
                    ))
                }  
            </SimpleGrid>
        </div>
    )
};

export default QuizCategories;

