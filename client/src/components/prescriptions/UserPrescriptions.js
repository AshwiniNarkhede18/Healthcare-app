// src/components/prescriptions/UserPrescriptions.js
import React, { useEffect, useState } from 'react';
import { getPrescriptionsByUser, downloadPrescription } from '../../services/prescriptionService';
import { getUserId } from '../../services/auth';

const UserPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
  getPrescriptionsByUser(getUserId()).then(res => {
    setPrescriptions(res.data || []);  // fallback to empty array
  }).catch(() => {
    setPrescriptions([]);  // on error also clear prescriptions to avoid crash
  });
}, []);


  const handleDownload = async (appointmentId) => {
    const res = await downloadPrescription(appointmentId);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `prescription_${appointmentId}.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="container mt-4">
      <h3>My Prescriptions</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Doctor ID</th>
            <th>Date</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map(p => (
            <tr key={p.id}>
              <td>{p.appointmentId}</td>
              <td>{p.doctorId}</td>
              <td>{new Date(p.uploadedAt).toLocaleString()}</td>
              <td>
                <button className="btn btn-sm btn-success" onClick={() => handleDownload(p.appointmentId)}>
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPrescriptions;
