import { Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { gql, useLazyQuery } from '@apollo/client';

import Admin from "../../components/Admin/Admin"
import { adminActions } from "../../store/admin-slice";
import Loading from "../../components/Layout/Loading";

const AdminPage = () => {
    const dispatch = useDispatch();
    
    const GET_ADMIN_CATEGORIES = gql`
        query {
            adminCategories {
                categoryId
                categoryName
                custom
                enabled
                addedBy
                addedOn
            }
        }
    `;

    const [ getAdminCategories, { called, loading, data }] = useLazyQuery(GET_ADMIN_CATEGORIES, { fetchPolicy: 'no-cache' });
    
    useEffect(() => {
        getAdminCategories();
    }, [ getAdminCategories ]);

    const addCategoryHandler = () => {
        getAdminCategories();
    }

    if (called && !loading && data) {
        dispatch(adminActions.setCategories({
            categories: data.adminCategories
        }));
    }

    return (
        <>
            <div className="wrapper pad-top--2rem f-center">
                <Heading as='h1' size='2xl' noOfLines={2} className="fw-300">
                    Admin Dashboard
                </Heading>
            </div>
            { called && loading && <Loading /> }
            { called && !loading && data && <Admin onAddCategory={addCategoryHandler} /> }
        </>
    );
};

export default AdminPage;

