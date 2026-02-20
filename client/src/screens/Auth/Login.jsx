import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Plus, User, Stethoscope, ShieldCheck, ChevronRight, Activity, Globe, Phone } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                if (data.user.role === 'patient') navigate('/patient');
                else if (data.user.role === 'admin') navigate('/admin');
                else if (data.user.role === 'doctor') navigate('/doctor');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            alert('Cannot connect to server');
        } finally {
            setLoading(false);
        }
    };

    const quickLogin = (role) => {
        if (role === 'patient') { setEmail('patient@clinic.com'); setPassword('123'); }
        else if (role === 'doctor') { setEmail('smith@clinic.com'); setPassword('123'); }
        else if (role === 'admin') { setEmail('admin@clinic.com'); setPassword('123'); }
    };

    return (
        <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden font-sans">
            {/* Visual Brand Side */}
            <div className="hidden lg:flex w-1/2 bg-green-600 relative p-20 flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black rounded-full -translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-2xl">
                        <Plus size={40} strokeWidth={3} />
                    </div>
                    <h1 className="text-8xl font-black text-white mt-12 tracking-tighter leading-none">CASE<br /><span className="text-green-200">CLINIC</span></h1>
                    <p className="text-green-100 text-xl font-medium mt-8 max-w-md opacity-80 uppercase tracking-widest letter-spacing-[0.2em]">Next-Generation Health Management Information System (HMIS)</p>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-10">
                    <div>
                        <h4 className="text-white font-black text-xl mb-2">Mulago Center</h4>
                        <p className="text-green-100 text-sm opacity-60">High-capacity medical facility treating 5,000+ patients monthly.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-black text-xl mb-2">24/7 Care</h4>
                        <p className="text-green-100 text-sm opacity-60">Emergency response and specialized clinical care available across Kampala.</p>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-8 md:p-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xl"
                >
                    <div className="lg:hidden flex items-center space-x-4 mb-12">
                        <div className="h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center text-white"><Plus size={24} strokeWidth={3} /></div>
                        <h1 className="text-3xl font-black tracking-tighter">Case Clinic</h1>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase mb-4">Welcome <span className="text-green-600">Back</span></h2>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Access the medical portal via your credentials</p>
                    </div>

                    <form className="space-y-8" onSubmit={handleLogin}>
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 group-focus-within:text-green-600 transition-colors">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-all font-bold" size={20} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-3xl pl-16 pr-6 py-6 font-bold text-gray-900 transition-all outline-none"
                                        placeholder="your-name@caseclinic.ug"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 group-focus-within:text-green-600 transition-colors">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-all font-bold" size={20} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-3xl pl-16 pr-6 py-6 font-bold text-gray-900 transition-all outline-none"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-gray-200 text-green-600 focus:ring-green-600 transition-all" />
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900 transition-all">Keep me signed in</span>
                            </label>
                            <a href="#" className="text-xs font-black text-green-600 uppercase tracking-widest hover:tracking-[0.2em] transition-all">Reset Password</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white rounded-[40px] py-6 font-black uppercase tracking-widest text-sm shadow-2xl shadow-green-100 flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : <>Continue to Portal <ChevronRight size={20} className="ml-2" /></>}
                        </button>
                    </form>

                    <div className="mt-20">
                        <div className="relative mb-10">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                            <div className="relative flex justify-center"><span className="px-6 bg-white text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Enterprise Quick Access</span></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { role: 'patient', icon: User, label: 'Patient', color: 'bg-green-50 text-green-700' },
                                { role: 'doctor', icon: Stethoscope, label: 'Doctor', color: 'bg-blue-50 text-blue-700' },
                                { role: 'admin', icon: ShieldCheck, label: 'Admin', color: 'bg-purple-50 text-purple-700' }
                            ].map((btn) => (
                                <button
                                    key={btn.role}
                                    onClick={() => quickLogin(btn.role)}
                                    className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all border border-transparent hover:border-current active:scale-95 ${btn.color}`}
                                >
                                    <btn.icon size={28} strokeWidth={2.5} className="mb-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="mt-16 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Authorized Personnel Only. <Link to="/register" className="text-green-600 font-black hover:underline underline-offset-8">Request Access</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
