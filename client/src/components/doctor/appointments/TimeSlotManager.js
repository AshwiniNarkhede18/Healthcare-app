// // src/components/doctor/appointments/TimeSlotManager.js

// import React, { useEffect, useState } from 'react';
// import { getUser } from '../../../services/auth';
// import { getDoctorTimeSlots, addDoctorTimeSlot, deleteDoctorTimeSlot } from '../../../services/appointmentService';
// import moment from 'moment';

// const TimeSlotManager = () => {
//   const doctor = getUser();
//   const [slots, setSlots] = useState([]);
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');

//   const loadSlots = async () => {
//     try {
//       const data = await getDoctorTimeSlots(doctor.id);
//       setSlots(data);
//     } catch (err) {
//       alert('Failed to load time slots');
//     }
//   };

//   useEffect(() => {
//     loadSlots();
//   }, []);

//   const handleAddSlot = async () => {
//   if (!date || !time) {
//     alert('Please select both date and time');
//     return;
//   }
//   try {
//     const dateTime = `${date}T${time}:00`; // ISO format
//     await addDoctorTimeSlot({
//       doctorId: doctor.id,
//       slotTime: dateTime,
//       status: 'AVAILABLE'
//     });
//     alert('Slot added successfully');
//     setDate('');
//     setTime('');
//     loadSlots();
//   } catch (err) {
//     alert('Failed to add slot');
//   }
// };

//   const handleDeleteSlot = async (id) => {
//     if (window.confirm('Are you sure you want to delete this slot?')) {
//       try {
//         await deleteDoctorTimeSlot(id);
//         alert('Slot deleted successfully');
//         loadSlots();
//       } catch (err) {
//         alert('Failed to delete slot');
//       }
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h3>Manage Time Slots</h3>
//       <div className="row mb-3">
//         <div className="col-md-4">
//           <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
//         </div>
//         <div className="col-md-4">
//           <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} />
//         </div>
//         <div className="col-md-4">
//           <button className="btn btn-primary" onClick={handleAddSlot}>Add Slot</button>
//         </div>
//       </div>

//       <table className="table table-bordered table-striped">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {slots.length === 0 ? (
//             <tr>
//               <td colSpan="4" className="text-center">No slots available</td>
//             </tr>
//           ) : (
//             slots.map((slot, index) => (
//               <tr key={slot.id}>
//                 <td>{index + 1}</td>
//                 <td>{moment(slot.slotTime).format('YYYY-MM-DD')}</td>
//                 <td>{moment(slot.slotTime).format('HH:mm')}</td>
//                 <td>
//                   <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSlot(slot.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TimeSlotManager;

// src/components/doctor/appointments/TimeSlotManager.js

import React, { useEffect, useState } from "react";
import { getUser } from "../../../services/auth";
import {
  getDoctorTimeSlots,
  addDoctorTimeSlot,
  deleteDoctorTimeSlot,
  updateDoctorTimeSlot, // ✅ New API method
} from "../../../services/appointmentService";
import moment from "moment";

const TimeSlotManager = () => {
  const doctor = getUser();
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [editingSlotId, setEditingSlotId] = useState(null); // ✅ Track which slot is being edited

  const loadSlots = async () => {
    try {
      const data = await getDoctorTimeSlots(doctor.id);
      setSlots(data);
    } catch (err) {
      alert("Failed to load time slots");
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleAddSlot = async () => {
    if (!date || !time) {
      alert("Please select both date and time");
      return;
    }
    try {
      const dateTime = `${date}T${time}:00`; // ISO format
      await addDoctorTimeSlot({
        doctorId: doctor.id,
        slotTime: dateTime,
        status: "AVAILABLE",
      });
      alert("Slot added successfully");
      setDate("");
      setTime("");
      loadSlots();
    } catch (err) {
      alert("Failed to add slot");
    }
  };

  const handleDeleteSlot = async (id) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      try {
        await deleteDoctorTimeSlot(id);
        alert("Slot deleted successfully");
        loadSlots();
      } catch (err) {
        alert("Failed to delete slot");
      }
    }
  };

  // ✅ New: Handle Edit Button Click
  const handleEditClick = (slot) => {
    setEditingSlotId(slot.id);
    setDate(moment(slot.slotTime).format("YYYY-MM-DD"));
    setTime(moment(slot.slotTime).format("HH:mm"));
  };

  // ✅ New: Handle Update Slot
  const handleUpdateSlot = async () => {
    if (!date || !time) {
      alert("Please select both date and time");
      return;
    }
    try {
      const dateTime = `${date}T${time}:00`;
      await updateDoctorTimeSlot(editingSlotId, {
        doctorId: doctor.id,
        slotTime: dateTime,
        status: "AVAILABLE",
      });
      alert("Slot updated successfully");
      setDate("");
      setTime("");
      setEditingSlotId(null);
      loadSlots();
    } catch (err) {
      alert("Failed to update slot");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Time Slots</h3>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="time"
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          {editingSlotId ? (
            <>
              <button
                className="btn btn-success me-2"
                onClick={handleUpdateSlot}
              >
                Update Slot
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditingSlotId(null);
                  setDate("");
                  setTime("");
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleAddSlot}>
              Add Slot
            </button>
          )}
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {slots.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No slots available
              </td>
            </tr>
          ) : (
            slots.map((slot, index) => (
              <tr key={slot.id}>
                <td>{index + 1}</td>
                <td>{moment(slot.slotTime).format("YYYY-MM-DD")}</td>
                <td>{moment(slot.slotTime).format("HH:mm")}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditClick(slot)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteSlot(slot.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TimeSlotManager;
