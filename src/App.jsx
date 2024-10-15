import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/home.jsx';
import LandingPage from './pages/landingPage.jsx';
import Login from './pages/login.jsx';
import NoRouteFound from './pages/noRouteFound.jsx';
import Navbar from './components/navBar.jsx';





const App = () => {
  const location = useLocation();
  const notLogin = location.pathname !== '/'


  return (
     <>
      {notLogin && <Navbar />}
      <div className='routesWrapper'
             style={{
              marginLeft: notLogin ? '256px' : '0', // Adjust left margin if navbar is present
              padding: '20px',
              height: '100vh', // Ensure full height
              boxSizing: 'border-box', // Include padding in height
            }}>
        <Routes>
           <Route path="/" element={<Login />} />
           <Route path="/home" element={<Home />} />
           <Route path="*" element={<NoRouteFound />} />
        </Routes>
        </div>
     </>
  );
};

export default App;
