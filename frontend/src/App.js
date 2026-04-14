import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddService from './pages/AddService';
import ServiceDetail from './pages/ServiceDetail';
import ProviderProfile from './pages/ProviderProfile';
import MyServices from './pages/MyServices';
import MyBookings from './pages/MyBookings';
import Chat from './pages/Chat';
import EditProfile from './pages/EditProfile';
import CategoryServices from './pages/CategoryServices';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route path="/category/:name" element={<CategoryServices />} />
        <Route path="/my-services" element={<MyServices />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;