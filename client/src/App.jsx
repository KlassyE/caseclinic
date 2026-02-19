import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './screens/Auth/Login';
import Register from './screens/Auth/Register';
import PatientDashboard from './screens/Patient/PatientDashboard';
import BookingScreen from './screens/BookingScreen';
import AdminDashboard from './screens/AdminDashboard';
import DoctorDashboard from './screens/Doctor/DoctorDashboard';
import './App.css';

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Routes */}
        <Route path="/patient" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute role="patient"><BookingScreen /></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute role="patient"><PatientDashboard tab="records" /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute role="admin"><AdminDashboard tab="billing" /></ProtectedRoute>} />

        {/* Doctor Routes */}
        <Route path="/doctor" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
