import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, LogOut, Clock, History, FlaskConical, CreditCard, Menu, X, ChevronRight, Stethoscope, Activity, Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PatientDashboard({ tab = 'booking' }) {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [activeTab, setActiveTab] = useState(tab);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/doctors').then(res => res.json()).then(setDoctors);
        fetch('http://localhost:3001/appointments').then(res => res.json()).then(data => {
            setAppointments(data.filter(app => app.patientPhone === user.phone));
        });
    }, [user.phone]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const TabButton = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => { setActiveTab(id); setIsMenuOpen(false); }}
            className={`w-full flex items-center px-8 py-5 rounded-[28px] transition-all ${activeTab === id ? 'bg-green-600 text-white shadow-xl shadow-green-100' : 'text-gray-400 hover:bg-green-50 hover:text-green-600'}`}
        >
            <Icon size={20} className="mr-6" />
            <span className="font-black uppercase tracking-widest text-[10px]">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden font-sans">
            {/* Sidebar - Shared Desktop */}
            <aside className="hidden lg:flex flex-col w-[350px] border-r border-gray-100 p-10 h-screen sticky top-0">
                <div className="flex items-center space-x-4 mb-16">
                    <div className="h-12 w-12 bg-green-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl italic shadow-xl shadow-green-100">C</div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black uppercase tracking-tighter italic text-gray-900">Case <span className="text-green-600">Client</span></h1>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Digital Health Passport</span>
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    <TabButton id="booking" icon={Search} label="Find Specialist" />
                    <TabButton id="records" icon={History} label="Clinical History" />
                    <TabButton id="labs" icon={FlaskConical} label="Laboratory results" />
                    <TabButton id="billing" icon={CreditCard} label="Billing & Payments" />
                </div>

                <div className="pt-10 border-t border-gray-100">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-green-600 italic">{user.name?.charAt(0)}</div>
                        <div>
                            <p className="text-xs font-black uppercase text-gray-900">{user.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient Profile</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center px-8 py-5 text-red-600 bg-red-50 rounded-[28px] font-black uppercase tracking-widest text-[10px] hover:bg-red-100 transition-all">
                        <LogOut size={18} className="mr-6" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden w-full px-6 py-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-50">
                <h1 className="text-2xl font-black italic uppercase tracking-tighter">Case<span className="text-green-600">Client</span></h1>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-4 bg-gray-50 rounded-2xl shadow-sm"><Menu size={20} /></button>
            </header>

            {/* Content Area */}
            <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-x-hidden overflow-y-auto">
                <AnimatePresence mode="wait">
                    {activeTab === 'booking' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="mb-16">
                                <h2 className="text-6xl font-black uppercase tracking-tighter leading-none italic mb-4">Book <span className="text-green-600">Care</span></h2>
                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">MULAGO SPECIALIZED MEDICAL CENTER • 24/7</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {doctors.map((doctor) => (
                                    <div key={doctor._id} className="bg-white p-10 rounded-[60px] border border-gray-50 shadow-sm hover:shadow-2xl transition-all group">
                                        <div className="flex items-center space-x-8 mb-10">
                                            <div className="h-24 w-24 bg-green-50 text-green-600 rounded-[35px] flex items-center justify-center font-black text-3xl italic shadow-inner">{doctor.name.charAt(4)}</div>
                                            <div>
                                                <h4 className="text-2xl font-black uppercase tracking-tighter italic">{doctor.name}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2 italic">{doctor.specialty}</p>
                                                <div className="flex items-center text-gray-400 space-x-4">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest flex items-center"><Clock size={12} className="mr-1" /> Available Today</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm italic mb-10 line-clamp-2 leading-relaxed">"{doctor.bio}"</p>
                                        <button
                                            onClick={() => navigate('/booking', { state: { doctor } })}
                                            className="w-full py-6 bg-black text-white rounded-[35px] font-black uppercase tracking-widest text-xs hover:bg-green-600 transition-all flex items-center justify-center group-hover:scale-[1.02]"
                                        >
                                            Request Consultation <ChevronRight size={16} className="ml-2" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'records' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl">
                            <h2 className="text-5xl font-black uppercase tracking-tighter mb-12 italic">Medical <span className="text-green-600">History</span></h2>
                            <div className="space-y-10">
                                {appointments.filter(a => a.status === 'completed').map(app => (
                                    <div key={app._id} className="bg-gray-50/50 p-12 rounded-[60px] border border-gray-100 group hover:bg-white hover:shadow-2xl transition-all">
                                        <div className="flex justify-between items-start mb-10">
                                            <div>
                                                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2 block">{app.date}</span>
                                                <h3 className="text-2xl font-black uppercase tracking-tighter italic">{app.diagnosis}</h3>
                                            </div>
                                            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-gray-300"><History size={20} /></div>
                                        </div>

                                        {/* Vitals Summary */}
                                        {app.vitals && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                                {Object.entries(app.vitals).map(([key, val]) => (
                                                    <div key={key} className="bg-white p-6 rounded-3xl border border-gray-100">
                                                        <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1 block">{key}</span>
                                                        <span className="text-lg font-black italic">{val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <p className="text-gray-400 italic mb-10 leading-relaxed">"{app.consultationNotes}"</p>

                                        {/* Prescriptions */}
                                        {app.prescriptions && app.prescriptions.length > 0 && (
                                            <div className="space-y-4 pt-10 border-t border-gray-200">
                                                <h4 className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-900 mb-6"><Pill size={14} className="mr-2 text-green-600" /> Prescribed Medications</h4>
                                                {app.prescriptions.map((p, i) => (
                                                    <div key={i} className="flex justify-between items-center p-6 bg-white rounded-3xl">
                                                        <div>
                                                            <p className="font-black italic text-sm">{p.drug}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.dosage} • {p.frequency}</p>
                                                        </div>
                                                        <Check size={16} className="text-green-600" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'labs' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-5xl font-black uppercase tracking-tighter mb-12 italic">Laboratory <span className="text-green-600">Portal</span></h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {appointments.flatMap(a => a.labs || []).map((lab, i) => (
                                    <div key={i} className="bg-white p-10 rounded-[50px] border-2 border-gray-50 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8">
                                            <FlaskConical size={32} className="text-green-100 group-hover:text-green-600 transition-all" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2 block">{lab.status}</span>
                                        <h4 className="text-2xl font-black uppercase tracking-tighter italic mb-4">{lab.test}</h4>
                                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{lab.result || 'Pending Result'}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'billing' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-5xl font-black uppercase tracking-tighter mb-12 italic">Billing <span className="text-green-600">& Claims</span></h2>
                            <div className="space-y-6 max-w-2xl">
                                {appointments.map(app => (
                                    <div key={app._id} className="bg-white p-10 rounded-[45px] border border-gray-100 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center space-x-6">
                                            <div className="h-14 w-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white"><CreditCard size={24} /></div>
                                            <div>
                                                <h4 className="font-black uppercase tracking-tight italic">Visit Fee • {app.date}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-green-600">UGX {app.billing?.amount?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full ${app.billing?.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                            {app.billing?.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Mobile Nav Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 bg-white z-[100] p-10 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-16">
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Menu</h1>
                            <button onClick={() => setIsMenuOpen(false)} className="p-4 bg-gray-50 rounded-2xl"><X size={24} /></button>
                        </div>
                        <div className="space-y-4">
                            <TabButton id="booking" icon={Search} label="Book Specialist" />
                            <TabButton id="records" icon={History} label="Clinical History" />
                            <TabButton id="labs" icon={FlaskConical} label="Lab Results" />
                            <TabButton id="billing" icon={CreditCard} label="Billing" />
                        </div>
                        <div className="mt-auto">
                            <button onClick={handleLogout} className="w-full flex items-center px-8 py-6 text-red-600 bg-red-50 rounded-[35px] font-black uppercase tracking-widest text-xs">Sign Out</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
