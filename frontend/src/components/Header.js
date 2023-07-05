import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Avatar, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { userActions } from '../store/user-slice';
import '../styles/Header.scss';

const Header = () => {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const userProfile = useSelector(state => state.user.profile);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem('user');
        dispatch(userActions.logOut());
        navigate('/login');
    }

    const activeClass = ({ isActive }) => (
        isActive ? 'active' : ''
    );

    useEffect(() => {
        if (!isLoggedIn) {
            const userState = JSON.parse(localStorage.getItem('user'));
            if (userState) {
                const userData = {
                    name: userState.name,
                    email: userState.email,
                    role: userState.role,
                    attemptedQuizzes: userState.attemptedQuizzes
                };
                dispatch(userActions.logIn({ ...userData }));
            }
        }
    }, [dispatch, isLoggedIn]);
        
    return (
        <header className="header">
            <NavLink to='/' className="title">
                <QuestionOutlineIcon />
                <span>CapStoneQz!</span>
            </NavLink>
            <nav>
                <ul>
                    <li>
                        <NavLink to='/home' className={activeClass}>Home</NavLink>
                    </li>
                    { isLoggedIn && 
                        <li>
                            <NavLink to='/quiz' className={activeClass}>Quiz</NavLink>
                        </li>
                    }
                </ul>
            </nav>
            <div>
                { !isLoggedIn &&
                    <ul>
                        <li>
                            <NavLink to='/login' className={activeClass}>Log in</NavLink>
                        </li>
                        <li>
                            <NavLink to='/signup' className={activeClass}>Sign up</NavLink>
                        </li>
                    </ul>
                }
                { isLoggedIn && 
                    <Menu>
                        <MenuButton>
                            <Avatar bg='gray.200' color='black' name={userProfile.name}/>
                        </MenuButton>
                        <MenuList style={{color: 'black'}}>
                            <MenuItem>
                                <Text as='b'>{userProfile.name}</Text>
                            </MenuItem>
                            <MenuDivider />
                            <Link to='/user'>
                                <MenuItem>Profile</MenuItem>
                            </Link>
                            { userProfile.role === 'admin' &&
                                <Link to='/admin'>
                                    <MenuItem>Admin Dashboard</MenuItem>
                                </Link>
                            }
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                }
            </div>
        </header>
    )
};

export default Header;

