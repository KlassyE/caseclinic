const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientName: String,
    patientPhone: String,
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Refers to the Doctor (User)
    date: Date,
    time: String,
    status: { type: String, enum: ['booked', 'confirmed', 'cancelled'], default: 'booked' }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
