import { Card, CardBody, Center, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { gql, useQuery } from "@apollo/client";
import Banner from "../Layout/Banner";
import Loading from "../Layout/Loading";

const User = () => {
    const FIND_USER = gql`
    query FindUser($email: String!) {
        findUser(email: $email) {
            name
            email
            role
            attemptedQuizzes {
                category {
                    categoryId
                    categoryName
                }
                preference {
                    amount
                    difficulty
                    type
                }
                score
                date
            }
        }
    }
`;
    const user = useSelector(state => state.user);

    const { loading, data } = useQuery(FIND_USER, {
        variables: {
            email: user.profile.email,
        },
        fetchPolicy: 'no-cache'
    });
    
    return (
        <>
            <Banner>
                <Heading as='h1' size='2xl' noOfLines={2} className="fw-300">
                    { user.profile.name }
                </Heading>
            </Banner>
            { loading && <Loading /> }
            { !loading && data && 
                <div className="wrapper pad-top--2rem result">
                    <div className="center">
                        <Heading as='h1' size='xl' noOfLines={2} className="fw-300">
                            Your previous quizzes
                        </Heading>
                    </div>
                    <Center>
                        <Card minWidth='90rem' p='1rem' className="center"> 
                            { data.findUser.attemptedQuizzes.length > 0 && 
                                <TableContainer className="score" minWidth='80rem' >
                                    <Table variant='simple'>
                                        <Thead>
                                            <Tr>
                                                <Th>No</Th>
                                                <Th>Date</Th>
                                                <Th>Category</Th>
                                                <Th>Difficulty</Th>
                                                <Th>Question Type</Th>
                                                <Th>Score</Th>
                                                <Th>Result</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                data.findUser.attemptedQuizzes.map((quiz, idx) => (
                                                    <Tr key={ idx } fontSize='md'>
                                                        <Td> { idx + 1 } </Td>
                                                        <Td> { quiz.date ? new Date(quiz.date).toLocaleDateString() : '' } </Td>
                                                        <Td> { quiz.category.categoryName } </Td>
                                                        <Td style={{textTransform: 'capitalize'}}>
                                                            { quiz.preference.difficulty }
                                                        </Td>
                                                        <Td style={{textTransform: 'capitalize'}}>
                                                            { 
                                                                quiz.preference.type === 'multiple' ?  'Multiple choice' :
                                                                quiz.preference.type === 'boolean' ? 'True / False' :  quiz.preference.type
                                                            }
                                                        </Td>
                                                        <Td> { quiz.score } / { quiz.preference.amount } </Td>
                                                        <Td> { Math.floor((quiz.score * 100) / quiz.preference.amount) }% </Td>
                                                    </Tr>
                                                ))
                                            }
                                            
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            }
                            { data.findUser.attemptedQuizzes.length === 0  && 
                                <CardBody style={{width: '60rem'}} align='center'>
                                    <p >You have not taken any quizzes yet!</p>      
                                </CardBody>
                            }
                        </Card>
                    </Center>
                </div>
            }
        </>
    )
}

export default User;