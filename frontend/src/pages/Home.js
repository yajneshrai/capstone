import { Button, Heading } from "@chakra-ui/react";
import quizBanner from '../assets/Quiz-Laptop.png'
import Banner from "../components/Layout/Banner";
import '../styles/Home.scss';
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    const navigate = useNavigate();

    const exploreQuiz = () => {
        if (isLoggedIn) {
            navigate('/quiz/categories');
        } else {
            navigate('/login?to=quiz');
        }
        
    }

    return (
        <>
            <Banner>
                <Heading as='h3' size='2xl' noOfLines={1} className="fw-300">
                    It's time to tickle your brain!
                </Heading>
                <p className="mar-top--1rem">Explore the amazing collecection of quizzes and test your knowledge right away.</p>
            </Banner>
            <div className="fl wrapper">
                <div>
                    <Heading as='h3' className="fw-300" size='xl' noOfLines={2}>
                        Pick your favorite category and take the quiz now.
                    </Heading>
                    <Button rightIcon={<ArrowForwardIcon />}  colorScheme='green'
                        variant='solid' size='lg' className="mar-top--1rem"
                        onClick={exploreQuiz}>
                        Take a quiz
                    </Button>
                </div>
                <div>
                    <img src={quizBanner} alt="Quiz laptop"></img>
                </div>
            </div>
        </>
    )
};

export default HomePage;

