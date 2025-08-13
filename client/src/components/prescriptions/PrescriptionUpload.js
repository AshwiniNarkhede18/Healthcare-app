// src/components/prescriptions/PrescriptionUpload.js
import React, { useState } from 'react';
import { uploadPrescription } from '../../services/prescriptionService';
import { getUserId } from '../../services/auth';

const PrescriptionUpload = ({ appointmentId, userId, onSuccess }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      appointmentId,
      doctorId: getUserId(),
      userId,
      diagnosis,
      medicines,
      notes,
    };

    try {
      await uploadPrescription(payload);
      alert('Prescription uploaded successfully');
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading prescription');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-light">
      <h5>Upload Prescription</h5>
      <div className="mb-3">
        <label>Diagnosis</label>
        <input
          type="text"
          className="form-control"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label>Medicines</label>
        <textarea
          className="form-control"
          value={medicines}
          onChange={(e) => setMedicines(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label>Notes</label>
        <textarea
          className="form-control"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit Prescription
      </button>
    </form>
  );
};

export default PrescriptionUpload;
