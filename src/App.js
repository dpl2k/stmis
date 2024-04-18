import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import RestaurantPage from './pages/RestaurantPage';
import DropdownPage from './pages/DropdownPage';
import DishPage from './pages/DishPage';
import DishHistoryPage from './pages/DishHistoryPage';
import DineInCategoryPage from './pages/DineInCategoryPage';
import DeliveryCategoryPage from './pages/DeliveryCategoryPage';
import POSPage from './pages/POSPage';
import UserPage from './pages/UserPage';
import Navbar from './components/NavBar';

const Redirector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/userpage");
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
        <Route path="/" element={<UserPage />} />
        <Route path="/dishpage" element={<DishPage />} />
        <Route path="/dishhistorypage/:dishId" element={<DishHistoryPage />} />
        <Route path="/restaurantpage" element={<RestaurantPage />} />
        <Route path="/dropdownpage" element={<DropdownPage />} />
        <Route path="/dineincategorypage" element={<DineInCategoryPage />} />
        <Route path="/deliverycategorypage" element={<DeliveryCategoryPage />} />
        <Route path="/pospage" element={<POSPage />} />
        <Route path="/userpage" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;