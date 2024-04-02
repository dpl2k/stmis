import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import RestaurantPage from './pages/RestaurantPage';
import Navbar from './components/NavBar';

const Redirector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/restaurant");
    }
  }, [location, navigate]);

  return null;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Redirector />
      <Routes>
        <Route path="/" element={<RestaurantPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/restaurant" element={<RestaurantPage />} />
      </Routes>
    </Router>
  );
};

export default App;