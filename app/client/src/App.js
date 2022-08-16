import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import NotFound from './pages/404/NotFound';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
