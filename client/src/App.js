import './App.scss';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import NotFound from './pages/404/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
     <Routes>
      <Route path="/" element={<Landing />}/>
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route />
     </Routes>
     </div>
    </BrowserRouter>
  );
}

export default App;
