import { Heading, useToast } from "@chakra-ui/react";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import Loading from "../Layout/Loading";
import CategoryDetails from "./CategoryDetails";
import Banner from "../Layout/Banner";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const GET_ADMIN_CATEGORY = gql`
    query GetAdminCategory($categoryId: Int!) {
        adminCategory(categoryId: $categoryId) {
            category {
                categoryId
                custom
                enabled
                addedBy
                addedOn
            }
            default {
                categoryId
                questionCount {
                    total
                    easy
                    medium
                    hard
                }
            }
            questions {
                questionId
                question 
                options {
                    optionId
                    option
                    correct
                }
            }
        }
    }
`;

const TOGGLE_CATEGORY = gql`
    mutation ToggleCategory($categoryId: Int!, $categoryName: String, $enabled: Boolean!) {
        toggleCategoryActive(categoryId: $categoryId, categoryName: $categoryName, enabled: $enabled) {
            success
        }
    }
`;

const TOAST_INTERVAL = 2000;

const AdminCategory = () => {
    const [ enabled, setEnabled ] = useState(true);
    const params = useParams();
    const [ searchParams ] = useSearchParams();
    const toast = useToast();

    const [ getAdminCategory, { called, loading, data }] = useLazyQuery(GET_ADMIN_CATEGORY, {
        variables: {
            categoryId: +params.id
        },
        fetchPolicy: 'no-cache'
    });

    const [ toggleCategory ] = useMutation(TOGGLE_CATEGORY, {
        variables: {
            categoryId: +params.id,
            categoryName: searchParams.get('name'),
            enabled
        },
        onCompleted: (resp) => {
            if (resp.toggleCategoryActive.success) {
                successToast('Success', `Category is now ${(enabled ? 'enabled' : 'disabled')}`);
            } else {
                failureToast('Error', 'Failed to toggle category');
            }
        },
        onError: (error) => {
            console.error(error);
            failureToast('Error', 'Failed to toggle category');
        }
    });

    const toggleCategoryHandler = (enabledValue) => {
        setEnabled(enabledValue);
        setTimeout(() => {
            toggleCategory();
        }, 0)
    }

    useEffect(() => {
        getAdminCategory();
    }, [ getAdminCategory ]);

    const addQuestionHandler = () => {
        getAdminCategory();
    }

    const successToast = (title, message) => {
        toast({
            title: title,
            description: message,
            status: 'success',
            duration: TOAST_INTERVAL,
            isClosable: true,
        });
    }

    const failureToast = (title, message) => {
        toast({
            title: title,
            description: message,
            status: 'error',
            duration: TOAST_INTERVAL,
            isClosable: true,
        });
    }

    return (
        <>
            <Banner>
                <Heading as='h1' size='2xl' noOfLines={2} className="fw-300">
                    { searchParams.get('name') }
                </Heading>
            </Banner>
            
            { called && loading && <Loading /> }
            { called && !loading && <CategoryDetails
                categoryDetails={data.adminCategory.category}
                defaultCategory={data.adminCategory.default}
                questions={data.adminCategory.questions}
                categoryName={searchParams.get('name')} 
                onToggleCategory={toggleCategoryHandler}
                onAddQuestion={addQuestionHandler}
                successToast={successToast}
                failureToast={failureToast}/> 
            }
        </>
    )
};

export default AdminCategory;

