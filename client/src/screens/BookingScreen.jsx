import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Loader2, CheckCircle, AlertCircle, MapPin, Shield, CreditCard } from 'lucide-react';

export default function BookingScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const { doctor } = location.state || {};
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [patientName, setPatientName] = useState(user.name || '');
    const [patientPhone, setPatientPhone] = useState(user.phone || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!doctor) navigate('/patient');
    }, [doctor, navigate]);

    if (!doctor) return null;

    const bookAppointment = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientName,
                    patientPhone,
                    doctorId: doctor._id,
                    date: selectedSlot.date,
                    time: selectedSlot.time
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Appointment confirmed for ${selectedSlot.time}!`);
                navigate('/patient');
            } else {
                alert(data.error || 'Booking failed');
            }
        } catch (err) {
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Minimal HMIS Header */}
            <header className="w-full px-6 md:px-12 py-8 flex justify-between items-center bg-white border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-green-600 transition-all font-black uppercase tracking-widest text-xs">
                    <ArrowLeft size={18} className="mr-3" /> Go Back
                </button>
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-green-600 rounded-xl flex items-center justify-center text-white"><Shield size={20} /></div>
                    <span className="font-black uppercase tracking-tighter">Case Clinical Booking</span>
                </div>
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mulago Complex</span>
                    <span className="text-xs font-black text-green-600 uppercase tracking-widest">Available 24/7</span>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Left: Doctor Profile */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="sticky top-32">
                        <div className="h-40 w-40 bg-green-50 rounded-[40px] flex items-center justify-center text-green-600 font-black text-5xl mb-10 shadow-2xl shadow-green-100 italic">
                            {doctor.name.charAt(4)}
                        </div>
                        <h2 className="text-6xl font-black uppercase tracking-tighter leading-none text-gray-900 mb-4">{doctor.name}</h2>
                        <div className="bg-green-600 inline-block px-6 py-2 rounded-full text-white font-black uppercase tracking-widest text-xs mb-8 italic">
                            {doctor.specialty}
                        </div>

                        <p className="text-xl text-gray-500 font-medium italic mb-12 leading-relaxed opacity-80">"{doctor.bio}"</p>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-6">
                                <MapPin size={24} className="text-green-600" />
                                <div>
                                    <h4 className="font-black uppercase text-sm tracking-tight">Mulago Specialized Center</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Tower B • 4th Floor</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <CreditCard size={24} className="text-green-600" />
                                <div>
                                    <h4 className="font-black uppercase text-sm tracking-tight">Consultation Fee</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">UGX 20,000 (Insurance accepted)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Booking Form */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 rounded-[60px] p-10 md:p-16">
                    <div className="mb-12">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Book <span className="text-green-600">Now</span></h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{doctor.availableSlots.filter(s => !s.isBooked).length} SLOTS AVAILABLE FOR THIS SPECIALIST</p>
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Patient Identity</label>
                            <input
                                className="w-full px-8 py-5 rounded-3xl bg-white border-none focus:ring-4 focus:ring-green-100 font-bold shadow-sm transition-all"
                                placeholder="Full Legal Name"
                                value={patientName}
                                onChange={e => setPatientName(e.target.value)}
                            />
                            <input
                                className="w-full px-8 py-5 rounded-3xl bg-white border-none focus:ring-4 focus:ring-green-100 font-bold shadow-sm transition-all"
                                placeholder="Phone Number"
                                value={patientPhone}
                                onChange={e => setPatientPhone(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-6">Select Time Slot</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {doctor.availableSlots.filter(s => !s.isBooked).map((slot, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all ${selectedSlot === slot
                                            ? 'bg-green-600 text-white border-green-600 shadow-2xl scale-105'
                                            : 'bg-white text-gray-900 border-white hover:border-green-100 shadow-sm'
                                            }`}
                                    >
                                        <span className="text-[10px] uppercase font-bold opacity-60 mb-2">{new Date(slot.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        <span className="text-lg font-black tracking-tighter italic">{slot.time}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedSlot && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-10">
                                <div className="bg-white p-10 rounded-[40px] shadow-sm mb-10 border border-green-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Final Summary</span>
                                        <CheckCircle size={20} className="text-green-600" />
                                    </div>
                                    <p className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-tight">
                                        {doctor.name} on {new Date(selectedSlot.date).toDateString()} @ {selectedSlot.time}
                                    </p>
                                </div>
                                <button
                                    onClick={bookAppointment}
                                    disabled={loading || !patientName || !patientPhone}
                                    className="w-full py-8 bg-green-600 text-white rounded-[40px] font-black uppercase tracking-widest text-lg shadow-2xl shadow-green-200 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Consultation'}
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
