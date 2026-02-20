import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Activity, Check, X, LogOut, Clock, CreditCard, DollarSign, PieChart, Shield, ChevronRight, Menu, Search } from 'lucide-react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');
const socket = io(API_URL);

export default function AdminDashboard({ tab = 'appointments' }) {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [activeTab, setActiveTab] = useState(tab);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
        socket.on('appointmentUpdated', fetchAppointments);
        socket.on('appointmentBooked', fetchAppointments);
        return () => socket.off();
    }, []);

    const fetchAppointments = () => fetch(`${API_URL}/appointments`).then(res => res.json()).then(setAppointments);
    const fetchDoctors = () => fetch(`${API_URL}/doctors`).then(res => res.json()).then(setDoctors);

    const updateBilling = async (id, status) => {
        await fetch(`${API_URL}/appointments/${id}/billing`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        fetchAppointments();
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const totalRevenue = appointments.filter(a => a.billing?.status === 'paid').reduce((acc, a) => acc + (a.billing?.amount || 0), 0);
    const totalPending = appointments.filter(a => a.billing?.status === 'unpaid').reduce((acc, a) => acc + (a.billing?.amount || 0), 0);

    const SidebarItem = ({ id, icon: Icon, label, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${activeTab === id ? 'bg-green-600 text-white shadow-xl shadow-green-200' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
        >
            <div className="flex items-center">
                <Icon size={20} className="mr-4" />
                <span className="font-bold uppercase tracking-widest text-xs">{label}</span>
            </div>
            {count !== undefined && <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${activeTab === id ? 'bg-white/20' : 'bg-gray-100 text-gray-400'}`}>{count}</span>}
        </button>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
            {/* Sidebar - Desktop Only */}
            <aside className="hidden md:flex flex-col w-[320px] border-r border-gray-100 p-8 h-screen sticky top-0">
                <div className="flex items-center space-x-4 mb-12">
                    <div className="h-12 w-12 bg-green-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-green-200">A</div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black uppercase tracking-tighter">Case <span className="text-green-600">Admin</span></h1>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">HMIS Enterprise</span>
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <SidebarItem id="appointments" icon={Calendar} label="Appointments" count={appointments.length} />
                    <SidebarItem id="billing" icon={CreditCard} label="Billing & Invoicing" />
                    <SidebarItem id="doctors" icon={Users} label="Medical Team" count={doctors.length} />
                    <SidebarItem id="stats" icon={PieChart} label="Performance" />
                </div>

                <div className="pt-8 border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full flex items-center px-6 py-4 text-red-600 bg-red-50 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-100 transition-all">
                        <LogOut size={18} className="mr-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Nav */}
            <header className="md:hidden w-full px-6 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-50">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-black">A</div>
                    <h1 className="font-black uppercase tracking-tighter">CaseAdmin</h1>
                </div>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 bg-gray-50 rounded-xl"><Menu size={20} /></button>
            </header>

            {/* Main Content Area - Full Width */}
            <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-x-hidden">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 space-y-6 sm:space-y-0 text-gray-900">
                    <div>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-[0.3em] mb-2 block">Enterprise Management</span>
                        <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Global <span className="text-green-600">Overview</span></h2>
                    </div>
                    <div className="flex items-center space-x-4 bg-gray-50 p-2 rounded-2xl">
                        <div className="flex -space-x-3">
                            {doctors.slice(0, 3).map((d, i) => (
                                <div key={i} className="h-10 w-10 rounded-full bg-white border-2 border-gray-50 flex items-center justify-center text-xs font-black text-green-600">{d.name.charAt(4)}</div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Team Online</span>
                    </div>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {[
                        { label: 'Revenue (UGX)', value: totalRevenue.toLocaleString(), icon: DollarSign, color: 'text-green-600' },
                        { label: 'Pending Collections', value: totalPending.toLocaleString(), icon: CreditCard, color: 'text-orange-500' },
                        { label: 'Total Visits', value: appointments.length, icon: Calendar, color: 'text-blue-500' },
                        { label: 'Staff Capacity', value: '92%', icon: Users, color: 'text-purple-500' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all"
                        >
                            <stat.icon size={24} className={`${stat.color} mb-6`} />
                            <p className="text-4xl font-black tracking-tighter text-gray-900">{stat.value}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {activeTab === 'appointments' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Active <span className="text-green-600 underline">Bookings</span></h3>
                            <button className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:tracking-[0.4em] transition-all">View All History</button>
                        </div>
                        <div className="overflow-x-auto -mx-6 px-6">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                                    <tr>
                                        <th className="pb-6">Patient</th>
                                        <th className="pb-6">Service Area</th>
                                        <th className="pb-6">Clinical Status</th>
                                        <th className="pb-6">Billing</th>
                                        <th className="pb-6">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {appointments.map((app) => (
                                        <tr key={app._id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-8">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black">{app.patientName.charAt(0)}</div>
                                                    <div>
                                                        <p className="font-black uppercase text-sm tracking-tight">{app.patientName}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{app.patientPhone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-8">
                                                <p className="font-black text-xs uppercase tracking-widest text-green-600">{app.doctorName || 'General Ward'}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{app.time} • TODAY</p>
                                            </td>
                                            <td className="py-8">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="py-8">
                                                <p className="font-black text-sm tracking-tighter">UGX {app.billing?.amount?.toLocaleString() || '20,000'}</p>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${app.billing?.status === 'paid' ? 'text-green-600' : 'text-red-500'}`}>{app.billing?.status}</span>
                                            </td>
                                            <td className="py-8">
                                                <button className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'billing' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-10">Financial <span className="text-green-600">Reconciliation</span></h3>
                        <div className="grid grid-cols-1 gap-4">
                            {appointments.filter(a => a.billing?.status === 'unpaid').map(app => (
                                <div key={app._id} className="bg-white border-2 border-orange-50 p-8 rounded-[40px] flex items-center justify-between">
                                    <div className="flex items-center space-x-6">
                                        <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center font-black leading-none">
                                            <DollarSign size={32} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black uppercase tracking-tighter">{app.patientName}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Outstanding: UGX {app.billing.amount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => updateBilling(app._id, 'paid')}
                                        className="px-10 py-5 bg-black text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-green-600 transition-all shadow-xl shadow-orange-50"
                                    >
                                        Mark as Settled
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
