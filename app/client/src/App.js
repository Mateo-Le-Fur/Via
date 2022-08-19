import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import NotFound from './pages/404/NotFound';
import ProtectedRoute from './pages/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkUser } from './features/auth/authSlice';
import Spinner from './components/Spinner/Spinner';

function App() {

  
const dispatch = useDispatch()

const {isLoading} = useSelector(state => state.auth)

useEffect(() => {
  dispatch(checkUser())
}, [dispatch])

if(isLoading){
    return <Spinner />
}

  return (
 
      <div className='App'>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound />} />
          <Route />
        </Routes>
      </div>
  
  );
}

export default App;
