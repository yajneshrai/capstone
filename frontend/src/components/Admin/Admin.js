import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Badge, Button, Card, CardFooter, CardHeader, Flex, Heading, SimpleGrid, useDisclosure, useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { gql, useMutation } from "@apollo/client";
import AddCategoryModal from "./AddCategoryModal";
import { useState } from "react";
import { getCurrentDate } from "../../util/helpers";
import { createSearchParams, useNavigate } from "react-router-dom";

const ADD_CATEGORY = gql`
    mutation AddCategory($categoryName: String!, $addedBy: String, $addedOn: Date) {
        addCategory(categoryName: $categoryName, addedBy: $addedBy, addedOn: $addedOn) {
            success
        }
    }
`;

const TOAST_INTERVAL = 2000;

const Admin = ({ onAddCategory }) => {
    const categories = useSelector(state => state.admin.allCategories);
    const userEamil = useSelector(state => state.user.profile.email);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    const [ categoryName, setCategoryName ] = useState('');

    const [ addCategory ] = useMutation(ADD_CATEGORY, {
        variables: {
            categoryName,
            addedBy: userEamil,
            addedOn: getCurrentDate()
        },
        onCompleted: (response) => {
            if (response?.addCategory?.success) {
                successToast();
                onAddCategory();
            } else {
                failureToast();
            }
        },
        onError: (error) => {
            console.error(error);
            failureToast();
        }
    });

    const successToast = () => {
        toast({
            title: 'Category created',
            description: `Successfully created the custom category: ${categoryName}`,
            status: 'success',
            duration: TOAST_INTERVAL,
            isClosable: true,
        });
    }

    const failureToast = () => {
        toast({
            title: 'Error',
            description: `Failed to create the category: ${categoryName}`,
            status: 'error',
            duration: TOAST_INTERVAL,
            isClosable: true,
        });
    }

    const selectCategory = (category) => {
        navigate({
            pathname: `/admin/${category.categoryId}`,
            search: createSearchParams({ name: category.categoryName }).toString()
        });
    }

    const addCategoryHandler = (catName) => {
        setCategoryName(catName);
        setTimeout(() => {
            addCategory();
        }, 0);
    }

    return (
        <div className="wrapper pad-top--2rem">
            <Flex minWidth='max-content' alignItems='center' justifyContent='flex-end' mb='10'>
                <Button leftIcon={<AddIcon />} colorScheme='green'
                     onClick={onOpen}>Add category</Button>
            </Flex>
            <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(250px, 1fr))'>
                {
                    categories.map(category => (
                        <Card key={category.categoryId}>
                            <CardHeader>
                                <Heading size='md'> {category.categoryName} </Heading>
                            </CardHeader>
                            
                            <CardFooter>
                                <Flex flexDirection='column'>
                                    <Badge colorScheme={category.custom ? 'green' : 'yellow'} variant='outline'>
                                        {category.custom ? 'Custom' : 'Default'}
                                    </Badge>
                                    { !category.enabled && <Badge colorScheme='gray' variant='outline' mt={2}>
                                        Disabled
                                    </Badge> }
                                </Flex>
                                <Flex style={{width: '100%'}} justifyContent='flex-end'>
                                    <Button rightIcon={<ArrowForwardIcon />}
                                        onClick={selectCategory.bind(null, category)}>View</Button>
                                </Flex>
                            </CardFooter>
                        </Card>
                    ))
                }  
            </SimpleGrid>
            <AddCategoryModal isOpen={isOpen} onClose={onClose} onAdd={addCategoryHandler}/>
        </div>
    )
}

export default Admin;