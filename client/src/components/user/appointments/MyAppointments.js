// import React, { useEffect, useState } from 'react';
// import { getUser } from '../../../services/auth';
// import { getUserAppointments, cancelAppointment } from '../../../services/appointmentService';
// import moment from 'moment';
// import { prescriptionExists, downloadPrescription } from '../../../services/prescriptionService';
// import { getVideoSession } from '../../../services/videoSessionService';

// import { Modal, Button } from 'react-bootstrap';
// import AppointmentChat from '../../shared/AppointmentChat'; // Import chat component

// const MyAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [prescriptionStatus, setPrescriptionStatus] = useState({}); // { appointmentId: true/false }
//   const [videoSessions, setVideoSessions] = useState({}); // { appointmentId: VideoSession }

//   // Chat modal state
//   const [showChatModal, setShowChatModal] = useState(false);
//   const [chatAppointmentId, setChatAppointmentId] = useState(null);
//   const [chatOtherUserId, setChatOtherUserId] = useState(null);

//   const user = getUser();

//   const loadAppointments = async () => {
//     try {
//       const res = await getUserAppointments(user.id);
//       setAppointments(res);

//       // Load prescription status
//       const prescStatusMap = {};
//       await Promise.all(res.map(async (appt) => {
//         prescStatusMap[appt.id] = await prescriptionExists(appt.id);
//       }));
//       setPrescriptionStatus(prescStatusMap);

//       // Load video sessions
//       const videoSessionMap = {};
//       await Promise.all(res.map(async (appt) => {
//         try {
//           const response = await getVideoSession(appt.id);
//           videoSessionMap[appt.id] = response;
//         } catch {
//           // no video session available
//         }
//       }));
//       setVideoSessions(videoSessionMap);

//     } catch (err) {
//       alert('Failed to load appointments');
//       console.error('Error loading appointments:', err);
//     }
//   };

//   useEffect(() => {
//     loadAppointments();
//   }, []);

//   const handleCancel = async (id) => {
//     if (!window.confirm('Cancel this appointment?')) return;
//     try {
//       await cancelAppointment(id);
//       alert('Appointment canceled.');
//       loadAppointments();
//     } catch (err) {
//       alert('Failed to cancel appointment.');
//     }
//   };

//   const joinConsultation = (link) => {
//     if (!link) {
//       alert('Consultation link not yet available');
//       return;
//     }
//     window.open(link, '_blank');
//   };

//   const handleDownload = async (appointmentId) => {
//     try {
//       const res = await downloadPrescription(appointmentId);
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `prescription_${appointmentId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       alert('Failed to download prescription');
//     }
//   };

//   // Chat modal open handler
//   const openChatModal = (appt) => {
//     setChatAppointmentId(appt.id);
//     setChatOtherUserId(appt.doctorUsername || appt.doctorId); // Adjust according to your data
//     setShowChatModal(true);
//   };

//   const closeChatModal = () => {
//     setChatAppointmentId(null);
//     setChatOtherUserId(null);
//     setShowChatModal(false);
//   };

//   return (
//     <div className="container mt-4">
//       <h3>My Appointments</h3>
//       {appointments.length === 0 ? (
//         <p>No appointments found.</p>
//       ) : (
//         <table className="table table-bordered table-striped mt-3">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Doctor Name</th>
//               <th>Specialization</th>
//               <th>Date & Time</th>
//               <th>Status</th>
//               <th>Action</th>
//               <th>Chat</th> {/* New chat column */}
//               <th>Prescription</th>
//             </tr>
//           </thead>
//           <tbody>
//             {appointments.map((appt, index) => {
//               const disableChatBtn = appt.status !== 'CONFIRMED';

//               return (
//                 <tr key={appt.id}>
//                   <td>{index + 1}</td>
//                   <td>{appt.doctorName}</td>
//                   <td>{appt.specialization}</td>
//                   <td>{moment(appt.appointmentDateTime).format('MMMM Do YYYY, h:mm A')}</td>
//                   <td>{appt.status}</td>
//                   <td>
//                     {appt.status === 'CONFIRMED' ? (
//                         <>
//                       <button
//                         className="btn btn-danger btn-sm me-2"
//                         onClick={() => handleCancel(appt.id)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         className="btn btn-outline-primary btn-sm"
//                         onClick={() => joinConsultation(videoSessions[appt.id]?.sessionLink || appt.consultationLink)}
//                       >
//                         Join
//                       </button>
//                     </>
//                     ) : (
//                       <span className="text-muted">N/A</span>
//                     )}
//                   </td>
//                   <td>
//                     <button
//                       className={`btn btn-outline-success btn-sm ${disableChatBtn ? 'disabled' : ''}`}
//                       onClick={() => !disableChatBtn && openChatModal(appt)}
//                       disabled={disableChatBtn}
//                       title={disableChatBtn ? `Chat not available for status: ${appt.status}` : 'Open chat modal'}
//                     >
//                       Chat
//                     </button>
//                   </td>
//                   <td>
//                     {prescriptionStatus[appt.id] ? (
//                       <button
//                         className="btn btn-sm btn-success"
//                         onClick={() => handleDownload(appt.id)}
//                       >
//                         Download Prescription
//                       </button>
//                     ) : (
//                       <span className="text-muted">Not available</span>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}

//       {/* Chat Modal */}
//       <Modal show={showChatModal} onHide={closeChatModal} size="md" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Chat - Appointment #{chatAppointmentId}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {chatAppointmentId && chatOtherUserId && (
//             <AppointmentChat
//               appointmentId={chatAppointmentId}
//               currentUserId={user.username} // or user.id as string matching backend JWT username
//               otherUserId={chatOtherUserId}
//               disabled={
//                 appointments.find(a => a.id === chatAppointmentId)?.status !== 'CONFIRMED'
//               }
//             />
//           )}
//           {!chatAppointmentId && <p>No appointment selected for chat.</p>}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={closeChatModal}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default MyAppointments;

// src/components/user/appointments/MyAppointments.js

import React, { useEffect, useState } from "react";
import { getUser } from "../../../services/auth";
import {
  getUserAppointments,
  cancelAppointment,
  getDoctorTimeSlots,
  updateAppointmentTimeSlot,
} from "../../../services/appointmentService";
import moment from "moment";
import {
  prescriptionExists,
  downloadPrescription,
} from "../../../services/prescriptionService";
import { getVideoSession } from "../../../services/videoSessionService";

import { Modal, Button } from "react-bootstrap";
import AppointmentChat from "../../shared/AppointmentChat";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptionStatus, setPrescriptionStatus] = useState({});
  const [videoSessions, setVideoSessions] = useState({});

  // Chat modal
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatAppointmentId, setChatAppointmentId] = useState(null);
  const [chatOtherUserId, setChatOtherUserId] = useState(null);

  // Reschedule modal
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const user = getUser();

  const loadAppointments = async () => {
    try {
      const res = await getUserAppointments(user.id);
      setAppointments(res);

      // Load prescription status
      const prescStatusMap = {};
      await Promise.all(
        res.map(async (appt) => {
          prescStatusMap[appt.id] = await prescriptionExists(appt.id);
        })
      );
      setPrescriptionStatus(prescStatusMap);

      // Load video sessions
      const videoSessionMap = {};
      await Promise.all(
        res.map(async (appt) => {
          try {
            const response = await getVideoSession(appt.id);
            videoSessionMap[appt.id] = response;
          } catch {
            /* ignore */
          }
        })
      );
      setVideoSessions(videoSessionMap);
    } catch (err) {
      alert("Failed to load appointments");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      alert("Appointment canceled.");
      loadAppointments();
    } catch {
      alert("Failed to cancel appointment.");
    }
  };

  const joinConsultation = (link) => {
    if (!link) {
      alert("Consultation link not yet available");
      return;
    }
    window.open(link, "_blank");
  };

  const handleDownload = async (appointmentId) => {
    try {
      const res = await downloadPrescription(appointmentId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription_${appointmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to download prescription");
    }
  };

  // Chat handlers
  const openChatModal = (appt) => {
    setChatAppointmentId(appt.id);
    setChatOtherUserId(appt.doctorUsername || appt.doctorId);
    setShowChatModal(true);
  };
  const closeChatModal = () => {
    setChatAppointmentId(null);
    setChatOtherUserId(null);
    setShowChatModal(false);
  };

  // Reschedule handlers
  const openRescheduleModal = async (appt) => {
    setRescheduleAppointment(appt);
    try {
      const slots = await getDoctorTimeSlots(appt.doctorId);
      setAvailableSlots(slots.filter((s) => s.status === "AVAILABLE"));
      setShowRescheduleModal(true);
    } catch {
      alert("Failed to load available slots");
    }
  };

  const handleReschedule = async () => {
    if (!selectedSlot) {
      alert("Please select a new slot");
      return;
    }
    try {
      await updateAppointmentTimeSlot(rescheduleAppointment.id, selectedSlot); // pass slotId
      alert("Appointment rescheduled successfully");
      setShowRescheduleModal(false);
      setSelectedSlot("");
      loadAppointments();
    } catch (err) {
      console.error(err);
      alert("Failed to reschedule");
    }
  };

  return (
    <div className="container mt-4">
      <h3>My Appointments</h3>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="table table-bordered table-striped mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Action</th>
              <th>Chat</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => {
              const disableChatBtn = appt.status !== "CONFIRMED";

              return (
                <tr key={appt.id}>
                  <td>{index + 1}</td>
                  <td>{appt.doctorName}</td>
                  <td>{appt.specialization}</td>
                  <td>
                    {moment(appt.appointmentDateTime).format(
                      "MMMM Do YYYY, h:mm A"
                    )}
                  </td>
                  <td>{appt.status}</td>
                  <td>
                    {appt.status === "CONFIRMED" ? (
                      <>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => openRescheduleModal(appt)}
                        >
                          Reschedule
                        </button>
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleCancel(appt.id)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            joinConsultation(
                              videoSessions[appt.id]?.sessionLink ||
                                appt.consultationLink
                            )
                          }
                        >
                          Join
                        </button>
                      </>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>
                  <td>
                    <button
                      className={`btn btn-outline-success btn-sm ${
                        disableChatBtn ? "disabled" : ""
                      }`}
                      onClick={() => !disableChatBtn && openChatModal(appt)}
                      disabled={disableChatBtn}
                    >
                      Chat
                    </button>
                  </td>
                  <td>
                    {prescriptionStatus[appt.id] ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleDownload(appt.id)}
                      >
                        Download Prescription
                      </button>
                    ) : (
                      <span className="text-muted">Not available</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Chat Modal */}
      <Modal show={showChatModal} onHide={closeChatModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chat - Appointment #{chatAppointmentId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {chatAppointmentId && chatOtherUserId && (
            <AppointmentChat
              appointmentId={chatAppointmentId}
              currentUserId={user.username}
              otherUserId={chatOtherUserId}
              disabled={
                appointments.find((a) => a.id === chatAppointmentId)?.status !==
                "CONFIRMED"
              }
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeChatModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        show={showRescheduleModal}
        onHide={() => setShowRescheduleModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Reschedule Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-control"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            <option value="">Select a new time slot</option>
            {availableSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {moment(slot.slotTime).format("MMMM Do YYYY, h:mm A")}
              </option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRescheduleModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleReschedule}
            disabled={!selectedSlot}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyAppointments;
