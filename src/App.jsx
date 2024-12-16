import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Home from './Pages/home.jsx';
import LandingPage from './Pages/landingPage.jsx';
import Login from './Pages/login.jsx';
import NoRouteFound from './Pages/noRouteFound.jsx';
import Navbar from './Components/navBar.jsx';




const App = () => {
  const location = useLocation();
  const notLoginScreen = location.pathname !== '/'


  return (
      <>
          {/*{notLoginScreen && <Navbar/>}*/}
          {/*<div className={`routesWrapper ${notLoginScreen ? 'withNavbar' : ''}`}>*/}
          <div>
              <Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/home" element={<Home/>}/>
                  <Route path="*" element={<NoRouteFound/>}/>
              </Routes>
          </div>
      </>
  );
};

export default App;
