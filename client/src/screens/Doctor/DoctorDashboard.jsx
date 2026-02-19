import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, LogOut, Clipboard, FlaskConical, Check, ChevronRight, Menu, X, Filter, Activity, Pill, History, Send, Percent, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [activeWorkTab, setActiveWorkTab] = useState('vitals'); // vitals, diagnosis, prescriptions, history

    // Treatment Form State
    const [notes, setNotes] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [labTest, setLabTest] = useState('');
    const [vitals, setVitals] = useState({ bp: '', temp: '', pulse: '', weight: '' });
    const [prescriptions, setPrescriptions] = useState([{ drug: '', dosage: '', frequency: '' }]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, [user.id]);

    const fetchAppointments = () => {
        fetch('http://localhost:3001/appointments')
            .then(res => res.json())
            .then(data => {
                setAppointments(data.filter(app => app.doctorId === user.id));
            });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const addPrescription = () => {
        setPrescriptions([...prescriptions, { drug: '', dosage: '', frequency: '' }]);
    };

    const updatePrescription = (index, field, value) => {
        const newP = [...prescriptions];
        newP[index][field] = value;
        setPrescriptions(newP);
    };

    const handleTreatPatient = async () => {
        setLoading(true);
        try {
            const labs = labTest ? [{ id: Date.now().toString(), test: labTest, status: 'pending' }] : [];
            const res = await fetch(`http://localhost:3001/appointments/${selectedAppt._id}/clinical`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    consultationNotes: notes,
                    diagnosis,
                    labs,
                    vitals,
                    prescriptions: prescriptions.filter(p => p.drug),
                    status: 'completed'
                })
            });
            if (res.ok) {
                alert('Medical Record Finalized');
                setSelectedAppt(null);
                resetForm();
                fetchAppointments();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setNotes(''); setDiagnosis(''); setLabTest('');
        setVitals({ bp: '', temp: '', pulse: '', weight: '' });
        setPrescriptions([{ drug: '', dosage: '', frequency: '' }]);
    };

    // Auto-fill for existing
    useEffect(() => {
        if (selectedAppt) {
            setNotes(selectedAppt.consultationNotes || '');
            setDiagnosis(selectedAppt.diagnosis || '');
            if (selectedAppt.vitals) setVitals(selectedAppt.vitals);
            if (selectedAppt.prescriptions) setPrescriptions(selectedAppt.prescriptions);
        }
    }, [selectedAppt]);

    const WorkTab = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveWorkTab(id)}
            className={`flex-1 py-4 flex flex-col items-center justify-center border-b-2 transition-all ${activeWorkTab === id ? 'border-green-600 text-green-600 bg-green-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
            <Icon size={18} className="mb-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="w-full bg-white border-b border-gray-100 flex justify-between items-center px-6 md:px-12 py-6 sticky top-0 z-50">
                <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-green-100 italic">D</div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black uppercase text-gray-900 tracking-tighter italic">Clinical <span className="text-green-600">Workstation</span></h1>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mulago Specialty Center</span>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-black">{user.name}</span>
                        <span className="text-xs font-bold text-green-600 uppercase tracking-widest italic">{user.specialty} Specialist</span>
                    </div>
                    <button onClick={handleLogout} className="p-3 text-red-600 bg-red-50 rounded-2xl hover:bg-red-100 transition-all">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden">
                {/* Patient List */}
                <div className={`w-full lg:w-[450px] border-r border-gray-100 flex flex-col p-8 md:p-12 overflow-y-auto ${selectedAppt ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="mb-10">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">Queue <span className="text-green-600">Today</span></h2>
                        <div className="flex items-center space-x-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{appointments.length} Consultations Pending</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {appointments.map((app) => (
                            <div
                                key={app._id}
                                onClick={() => setSelectedAppt(app)}
                                className={`p-8 rounded-[40px] border-2 transition-all cursor-pointer group flex items-center justify-between ${selectedAppt?._id === app._id ? 'bg-black text-white border-black shadow-2xl scale-[1.02]' : 'bg-white border-gray-50 hover:border-green-100 shadow-sm'}`}
                            >
                                <div className="flex items-center space-x-6">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl italic ${selectedAppt?._id === app._id ? 'bg-green-600' : 'bg-gray-50 text-gray-400'}`}>
                                        {app.patientName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase text-sm tracking-tight">{app.patientName}</h4>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedAppt?._id === app._id ? 'text-gray-400' : 'text-gray-300'}`}>{app.time} • OPD</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className={selectedAppt?._id === app._id ? 'text-green-600' : 'text-gray-200'} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Clinical Workspace */}
                <div className="flex-1 bg-gray-50 flex flex-col relative overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {selectedAppt ? (
                            <motion.div
                                key={selectedAppt._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col h-full"
                            >
                                {/* Workspace Header */}
                                <div className="p-8 md:p-12 bg-white border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
                                    <div>
                                        <button onClick={() => setSelectedAppt(null)} className="lg:hidden mb-6 flex items-center text-xs font-black uppercase tracking-widest text-gray-400 underline decoration-green-600 underline-offset-4"><X size={14} className="mr-2" /> Close Portal</button>
                                        <h3 className="text-4xl font-black uppercase tracking-tighter text-gray-900 leading-none italic">{selectedAppt.patientName}</h3>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">Ref ID: {selectedAppt._id} • Age: 28 • Gender: M</p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button className="px-6 py-3 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center hover:bg-gray-100 transition-all"><History size={14} className="mr-2" /> View Full EHR</button>
                                        <button className="px-6 py-3 bg-green-50 text-green-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center hover:bg-green-100 transition-all"><Send size={14} className="mr-2" /> Referral</button>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex bg-white px-8 border-b border-gray-100">
                                    <WorkTab id="vitals" icon={Activity} label="Vitals Monitor" />
                                    <WorkTab id="diagnosis" icon={Clipboard} label="Clinical Note" />
                                    <WorkTab id="prescriptions" icon={Pill} label="E-Prescribe" />
                                    <WorkTab id="history" icon={History} label="Recent History" />
                                </div>

                                {/* Tab Content */}
                                <div className="p-8 md:p-12 flex-1">
                                    <div className="max-w-4xl mx-auto space-y-12">
                                        {activeWorkTab === 'vitals' && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                                {[
                                                    { label: 'Blood Pressure', unit: 'mmHg', key: 'bp', placeholder: '120/80' },
                                                    { label: 'Temperature', unit: '°C', key: 'temp', placeholder: '36.5' },
                                                    { label: 'Pulse Rate', unit: 'bpm', key: 'pulse', placeholder: '72' },
                                                    { label: 'Weight', unit: 'kg', key: 'weight', placeholder: '70' },
                                                ].map((v) => (
                                                    <div key={v.key} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 group focus-within:border-green-600 transition-all">
                                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{v.label}</label>
                                                        <input
                                                            className="w-full text-3xl font-black tracking-tighter border-none p-0 focus:ring-0 placeholder:text-gray-100 italic"
                                                            placeholder={v.placeholder}
                                                            value={vitals[v.key]}
                                                            onChange={e => setVitals({ ...vitals, [v.key]: e.target.value })}
                                                            disabled={selectedAppt.status === 'completed'}
                                                        />
                                                        <span className="text-[10px] font-bold text-green-600 mt-2 block">{v.unit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {activeWorkTab === 'diagnosis' && (
                                            <div className="space-y-8 animate-in fade-in duration-500">
                                                <div className="bg-white p-12 rounded-[60px] shadow-sm border border-gray-100">
                                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 italic">Differential Diagnosis & Observations</label>
                                                    <textarea
                                                        className="w-full min-h-[300px] border-none focus:ring-0 text-xl font-medium leading-relaxed italic placeholder:text-gray-100"
                                                        placeholder="Type patient symptoms, visual observations, and clinical reasoning..."
                                                        value={notes}
                                                        onChange={e => setNotes(e.target.value)}
                                                        disabled={selectedAppt.status === 'completed'}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="bg-white p-10 rounded-[40px] border border-gray-100">
                                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Final Diagnosis (ICD-10)</label>
                                                        <input
                                                            className="w-full text-xl font-black tracking-tight border-none p-0 focus:ring-0 italic"
                                                            placeholder="e.g., J45.909 Asthma Unspecified"
                                                            value={diagnosis}
                                                            onChange={e => setDiagnosis(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="bg-white p-10 rounded-[40px] border border-gray-100">
                                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Request Labs</label>
                                                        <input
                                                            className="w-full text-xl font-black tracking-tight border-none p-0 focus:ring-0 italic"
                                                            placeholder="Malaria RDT, CBC, etc."
                                                            value={labTest}
                                                            onChange={e => setLabTest(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeWorkTab === 'prescriptions' && (
                                            <div className="space-y-6">
                                                {prescriptions.map((p, i) => (
                                                    <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8 items-end group shadow-sm">
                                                        <div>
                                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Medication</label>
                                                            <input className="w-full font-black border-none focus:ring-0 italic text-lg" placeholder="Amoxicillin 500mg" value={p.drug} onChange={e => updatePrescription(i, 'drug', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Dosage</label>
                                                            <input className="w-full font-black border-none focus:ring-0 italic text-lg" placeholder="1 Tab" value={p.dosage} onChange={e => updatePrescription(i, 'dosage', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Frequency</label>
                                                            <input className="w-full font-black border-none focus:ring-0 italic text-lg" placeholder="3 Times Daily" value={p.frequency} onChange={e => updatePrescription(i, 'frequency', e.target.value)} />
                                                        </div>
                                                    </div>
                                                ))}
                                                <button onClick={addPrescription} className="w-full py-8 border-2 border-dashed border-gray-200 rounded-[40px] text-gray-400 font-black uppercase tracking-widest text-[10px] flex items-center justify-center hover:border-green-600 hover:text-green-600 transition-all">
                                                    <Plus size={16} className="mr-2" /> Add Another Medication
                                                </button>
                                            </div>
                                        )}

                                        {activeWorkTab === 'history' && (
                                            <div className="space-y-6">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-sm relative overflow-hidden">
                                                        <div className="flex justify-between items-center mb-6">
                                                            <span className="px-5 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest italic">Visit 1{i} Oct 2025</span>
                                                            <span className="text-[10px] font-black uppercase text-gray-300">Dr. M. Smith</span>
                                                        </div>
                                                        <h5 className="text-xl font-black tracking-tight mb-4 italic uppercase tracking-tighter">Mild Respiratory Infection</h5>
                                                        <p className="text-gray-400 italic text-sm leading-relaxed">Patient presented with dry cough and low-grade fever. Recommended hydration and rest. Labs were clear for Malaria.</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Bar */}
                                    <div className="mt-20 pt-12 border-t border-gray-100 flex justify-end">
                                        <button
                                            onClick={handleTreatPatient}
                                            disabled={loading || selectedAppt.status === 'completed'}
                                            className="px-16 py-8 bg-green-600 text-white rounded-[40px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-green-100 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {loading ? 'Submitting...' : 'Finalize & Sign Encounter'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                                <div className="h-32 w-32 bg-gray-100 rounded-[50px] flex items-center justify-center text-gray-200 mb-10"><User size={64} /></div>
                                <h3 className="text-4xl font-black uppercase tracking-tighter text-gray-900 italic">Clinical <span className="text-green-600">Standby</span></h3>
                                <p className="text-gray-400 max-w-sm font-bold uppercase text-[10px] tracking-widest mt-4">Select a patient from the queue to start the clinical encounter</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
