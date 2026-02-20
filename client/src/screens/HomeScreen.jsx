import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Assume valid styles

export default function HomeScreen() {
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');
        fetch(`${API_URL}/doctors`)
            .then(res => res.json())
            .then(setDoctors)
            .catch(err => console.error("Failed to fetch doctors:", err));
    }, []);

    return (
        <div className="container">
            <h1 className="title">Book Appointment (UGX 20,000)</h1>
            <div className="doctor-list">
                {doctors.map(doctor => (
                    <div key={doctor._id} className="doctor-card">
                        <h2 className="doctor-name">{doctor.name} - {doctor.specialty}</h2>
                        <p>Available Slots: {doctor.availableSlots.length}</p>
                        <button className="btn" onClick={() => navigate('/booking', { state: { doctor } })}>
                            Book Now
                        </button>
                    </div>
                ))}
            </div>
            <button className="btn admin-btn" onClick={() => navigate('/admin')}>Admin Login</button>
        </div>
    );
}
