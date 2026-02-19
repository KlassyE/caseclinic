const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT"] }
});

app.use(cors());
app.use(express.json());

// --- CONSTANTS ---
const SPECIALTIES = ['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'General Medicine', 'Neurology', 'Oncology'];

// --- MOCK DATABASE ---
const MOCK_USERS = [
  { _id: 'admin-1', name: 'System Admin', email: 'admin@clinic.com', password: '123', role: 'admin' },
  { _id: 'patient-1', name: 'John Doe', email: 'patient@clinic.com', password: '123', role: 'patient', phone: '+256 700 000 001' },
  { _id: 'patient-2', name: 'Sarah Connor', email: 'sarah@clinic.com', password: '123', role: 'patient', phone: '+256 700 000 002' },
];

// Generate 12 Doctors
const docNames = ['Dr. Smith', 'Dr. Jane', 'Dr. Musoke', 'Dr. Kato', 'Dr. Nansubuga', 'Dr. Brown', 'Dr. Garcia', 'Dr. Chen', 'Dr. Wilson', 'Dr. Taylor', 'Dr. Anderson', 'Dr. Thomas'];
docNames.forEach((name, i) => {
  const spec = SPECIALTIES[i % SPECIALTIES.length];
  MOCK_USERS.push({
    _id: `doc-${i + 1}`,
    name,
    email: `${name.toLowerCase().replace('. ', '').replace(' ', '')}@clinic.com`,
    password: '123',
    role: 'doctor',
    specialty: spec,
    bio: `Dedicated specialist in ${spec} with over 10 years of experience at Mulago Hospital.`,
    availableSlots: [
      { date: new Date().toISOString(), time: '09:00 AM', isBooked: false },
      { date: new Date().toISOString(), time: '11:30 AM', isBooked: false },
      { date: new Date().toISOString(), time: '02:00 PM', isBooked: false },
      { date: new Date().toISOString(), time: '04:30 PM', isBooked: false }
    ]
  });
});

let MOCK_APPOINTMENTS = [
  {
    _id: 'hist-1',
    patientName: 'John Doe',
    patientPhone: '+256 700 000 001',
    doctorId: 'doc-2', // Dr. Jane
    doctorName: 'Dr. Jane',
    date: '2026-02-10T10:00:00.000Z',
    time: '10:00 AM',
    status: 'completed',
    consultationNotes: 'Patient presented with recurring skin rash. Recommended allergy tests.',
    diagnosis: 'Atopic Dermatitis',
    labs: [
      { id: 'L1', test: 'Skin Allergy Panel', result: 'Positive (Dust Mites)', status: 'completed' }
    ],
    billing: { amount: 85000, status: 'paid' }
  }
];

// --- ROUTES ---

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({
      token: 'mock-token-hmis',
      user: { id: user._id, name: user.name, role: user.role, specialty: user.specialty, phone: user.phone }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/doctors', (req, res) => {
  res.json(MOCK_USERS.filter(u => u.role === 'doctor'));
});

app.get('/appointments', (req, res) => {
  // Return with doctor details populated for history
  const populated = MOCK_APPOINTMENTS.map(a => {
    const doc = MOCK_USERS.find(u => u._id === a.doctorId);
    return { ...a, doctorName: doc?.name || a.doctorName };
  });
  res.json(populated);
});

app.post('/book', (req, res) => {
  const { patientName, patientPhone, doctorId, date, time } = req.body;
  const doctor = MOCK_USERS.find(u => u._id === doctorId);

  const newAppt = {
    _id: `APT-${Date.now()}`,
    patientName,
    patientPhone,
    doctorId,
    doctorName: doctor?.name || 'Unknown',
    date,
    time,
    status: 'booked',
    labs: [],
    billing: { amount: 20000, status: 'unpaid' } // Base consultation fee
  };

  MOCK_APPOINTMENTS.push(newAppt);
  if (doctor && doctor.availableSlots) {
    const slot = doctor.availableSlots.find(s => s.time === time);
    if (slot) slot.isBooked = true;
  }

  io.emit('appointmentBooked', newAppt);
  res.json({ success: true, appointment: newAppt });
});

// Update clinical data (Doctor only)
app.put('/appointments/:id/clinical', (req, res) => {
  const { id } = req.params;
  const { consultationNotes, diagnosis, labs, status, vitals, prescriptions } = req.body;
  const appIndex = MOCK_APPOINTMENTS.findIndex(a => a._id === id);
  if (appIndex > -1) {
    MOCK_APPOINTMENTS[appIndex] = {
      ...MOCK_APPOINTMENTS[appIndex],
      consultationNotes,
      diagnosis,
      labs,
      status: status || MOCK_APPOINTMENTS[appIndex].status,
      vitals,
      prescriptions
    };
    io.emit('appointmentUpdated', MOCK_APPOINTMENTS[appIndex]);
    res.json({ success: true, appointment: MOCK_APPOINTMENTS[appIndex] });
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
});

// Update billing (Admin only)
app.put('/appointments/:id/billing', (req, res) => {
  const { amount, status } = req.body;
  const appt = MOCK_APPOINTMENTS.find(a => a._id === req.params.id);
  if (appt) {
    if (amount) appt.billing.amount = amount;
    if (status) appt.billing.status = status;

    io.emit('appointmentUpdated');
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.post('/seed', (req, res) => {
  MOCK_APPOINTMENTS = [];
  res.json({ message: 'Data reset' });
});

const PORT = 3001;
server.listen(PORT, () => console.log(`HMIS Server running on port ${PORT}`));
