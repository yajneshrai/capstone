import { render, screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import * as reactRouterDom from 'react-router-dom';

import { Provider } from 'react-redux';
import renderWithProviders from '../util/test-setup';
import Header from "./Header";
import store from '../store';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe('Header component', () => { 

    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector')
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch')

    beforeEach(() => {
        useDispatchMock.mockClear();
        useSelectorMock.mockClear();
    });

    test('Home link is present', () => { 
        

       /*  renderWithProviders(<Header />, {
            user: {
                isLoggedIn: false,
                profile: null
            }
        });
        const HomeLink = screen.getByText(/Home/i);
        expect(HomeLink).toBeInTheDocument(); */

        /* const store = mockStore(initialState);
        const { getByText } = render(
            <Provider store={store}>
                <Header />
            </Provider>
        ); */
        // console.log(getByText);

        useSelectorMock.mockReturnValue({ user: { isLoggedIn: false } });
        render(<Provider store={store}>
            <Header />
        </Provider>);
    });
});