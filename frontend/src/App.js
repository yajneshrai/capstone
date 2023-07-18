import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Loading from './components/Layout/Loading';
import './App.css';

const Home = lazy(() => import('./pages/Home'));

const QuizCategories = lazy(() => import('./pages/Quiz/Categories'));
const QuizDetails = lazy(() => import('./pages/Quiz/Details'));
const QuizQuestions = lazy(() => import('./pages/Quiz/Questions'));
const QuizResult = lazy(() => import('./pages/Quiz/Result'));

const Login = lazy(() => import('./pages/Auth/Login'));
const Signup = lazy(() => import('./pages/Auth/Signup'));

const User = lazy(() => import('./pages/User/User'));
const Admin = lazy(() => import('./pages/Admin/Admin'));
const AdminCategory = lazy(() => import('./pages/Admin/Category'));

const NoMatch = lazy(() => import('./pages/NoMatch'));

const App = () => {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Navigate to='home' />} />
            { isLoggedIn && <>
                <Route path="/quiz/categories" element={<QuizCategories />} />
                <Route path="/quiz" element={<Navigate to='categories' />}  />
                <Route path="/quiz/:id" element={<QuizDetails />}></Route>
                <Route path="/quiz/:id/questions" element={<QuizQuestions />} />
                <Route path="/quiz/:id/result" element={<QuizResult />} />

                <Route path="/user" element={<User />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/:id" element={<AdminCategory />} />
              </>
            }
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </Suspense>
      </main>
    </>
  )
}

export default App;
