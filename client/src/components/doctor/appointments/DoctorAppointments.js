import React, { useEffect, useState } from 'react';
import { getUser } from '../../../services/auth';
import { 
  getDoctorAppointments, 
  markAppointmentCompleted, 
  cancelAppointment 
} from '../../../services/appointmentService';
import moment from 'moment';

import PrescriptionUpload from '../../prescriptions/PrescriptionUpload';
import { prescriptionExists } from '../../../services/prescriptionService';
import { 
  createOrGetVideoSession, 
  getVideoSession, 
  endVideoSession 
} from '../../../services/videoSessionService';

import { Modal, Button } from 'react-bootstrap';
import AppointmentChat from '../../shared/AppointmentChat'; // Import chat component

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptionStatus, setPrescriptionStatus] = useState({}); // { [appointmentId]: true/false }
  const [videoSessions, setVideoSessions] = useState({}); // { [appointmentId]: VideoSession }
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Chat modal state
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatAppointmentId, setChatAppointmentId] = useState(null);
  const [chatOtherUserId, setChatOtherUserId] = useState(null);

  const doctor = getUser();

  const loadAppointments = async () => {
    try {
      const res = await getDoctorAppointments(doctor.id);
      setAppointments(res);

      // Load prescription status for each appointment
      const prescStatusMap = {};
      await Promise.all(res.map(async (appt) => {
        prescStatusMap[appt.id] = await prescriptionExists(appt.id);
      }));
      setPrescriptionStatus(prescStatusMap);

      // Load video sessions for each appointment
      const videoSessionMap = {};
      await Promise.all(res.map(async (appt) => {
        try {
          const response = await getVideoSession(appt.id);
          videoSessionMap[appt.id] = response;
        } catch {
          // no session found
        }
      }));
      setVideoSessions(videoSessionMap);

    } catch (err) {
      alert('Failed to load appointments');
      console.error(err);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleComplete = async (id) => {
    try {
      await markAppointmentCompleted(id, doctor.id);
      alert('Appointment marked as COMPLETED');
      loadAppointments();
    } catch (err) {
      alert('Failed to mark completed');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      alert('Appointment cancelled');
      loadAppointments();
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };

  // Open video modal for selected appointment
  const openVideoModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setSelectedAppointmentId(null);
    setShowVideoModal(false);
    setLoading(false);
  };

  // Generate a session link if none exists
  const handleGenerateSession = async () => {
    if (!selectedAppointmentId) return;
    if (videoSessions[selectedAppointmentId]) {
      alert('Session already exists for this appointment');
      return;
    }
    setLoading(true);
    try {
      const response = await createOrGetVideoSession(selectedAppointmentId);
      setVideoSessions(prev => ({ ...prev, [selectedAppointmentId]: response }));
      alert('Video session link generated!');
      await loadAppointments();
    } catch (err) {
      alert('Failed to generate video session link');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Join existing session
  const handleJoinSession = () => {
    if (!selectedAppointmentId) return;
    const session = videoSessions[selectedAppointmentId];
    if (session?.sessionLink) {
      window.open(session.sessionLink, '_blank');
    } else {
      alert('No video session link available');
    }
  };

  // End session and mark appointment complete
  const handleEndSession = async () => {
    if (!selectedAppointmentId) return;
    if (!window.confirm('Are you sure you want to end this video session?')) return;
    setLoading(true);
    try {
      await endVideoSession(selectedAppointmentId);
      setVideoSessions(prev => {
        const copy = { ...prev };
        delete copy[selectedAppointmentId];
        return copy;
      });
      alert('Video session ended and appointment marked as completed');
      await loadAppointments();
      closeVideoModal();
    } catch (err) {
      alert('Failed to end video session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Called after prescription upload
  const onPrescriptionUploaded = (appointmentId) => {
    setPrescriptionStatus(prev => ({ ...prev, [appointmentId]: true }));
  };

  // Chat modal open handler
  const openChatModal = (appt) => {
    setChatAppointmentId(appt.id);
    setChatOtherUserId(appt.userId); // patient userId
    setShowChatModal(true);
  };

  const closeChatModal = () => {
    setChatAppointmentId(null);
    setChatOtherUserId(null);
    setShowChatModal(false);
  };

  // Disable video session modal buttons based on session and loading states
  const sessionExists = selectedAppointmentId && Boolean(videoSessions[selectedAppointmentId]);
  const appointment = appointments.find(appt => appt.id === selectedAppointmentId);
  const canGenerateSession = !sessionExists && appointment?.status === 'CONFIRMED';
  const canJoinSession = sessionExists;
  const canEndSession = sessionExists && !loading;

  return (
    <div className="container mt-4">
      <h3>My Patient Appointments</h3>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="table table-bordered table-striped mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Patient (userId)</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Action</th>
              <th>Video Session</th>
              <th>Chat</th> {/* New chat column */}
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => {
              const session = videoSessions[appt.id];
              const isConfirmed = appt.status === 'CONFIRMED';
              const disableVideoBtn = !isConfirmed || appt.status === 'COMPLETED' || appt.status === 'CANCELED';
              const disableChatBtn = disableVideoBtn; // chat same restrictions

              return (
                <tr key={appt.id}>
                  <td>{index + 1}</td>
                  <td>{appt.userId}</td> {/* Replace with patient name if available */}
                  <td>{moment(appt.appointmentDateTime).format('MMMM Do YYYY, h:mm A')}</td>
                  <td>{appt.status}</td>
                  <td>
                    {isConfirmed && (
                      <>
                        <button 
                          className="btn btn-success btn-sm me-2" 
                          onClick={() => handleComplete(appt.id)}
                          disabled={loading}
                        >
                          Complete
                        </button>
                        <button 
                          className="btn btn-danger btn-sm me-2" 
                          onClick={() => handleCancel(appt.id)}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                  <td>
                    <button
                      className={`btn btn-outline-primary btn-sm ${disableVideoBtn ? 'disabled' : ''}`}
                      onClick={() => !disableVideoBtn && openVideoModal(appt.id)}
                      disabled={disableVideoBtn}
                      title={disableVideoBtn ? `Video session not available for status: ${appt.status}` : 'Open video session modal'}
                    >
                      Video Session
                    </button>
                  </td>
                  <td>
                    <button
                      className={`btn btn-outline-success btn-sm ${disableChatBtn ? 'disabled' : ''}`}
                      onClick={() => !disableChatBtn && openChatModal(appt)}
                      disabled={disableChatBtn}
                      title={disableChatBtn ? `Chat not available for status: ${appt.status}` : 'Open chat modal'}
                    >
                      Chat
                    </button>
                  </td>
                  <td style={{ minWidth: 300 }}>
                    {appt.status === 'COMPLETED' ? (
                      prescriptionStatus[appt.id] ? (
                        <span>Prescription uploaded ✅</span>
                      ) : (
                        <PrescriptionUpload
                          appointmentId={appt.id}
                          userId={appt.userId}
                          onSuccess={() => onPrescriptionUploaded(appt.id)}
                        />
                      )
                    ) : (
                      <span className="text-muted">No prescription yet</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Video Session Modal */}
      <Modal show={showVideoModal} onHide={closeVideoModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Video Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selectedAppointmentId && <p>No appointment selected.</p>}
          {selectedAppointmentId && (
            <>
              <p>
                Appointment ID: <strong>{selectedAppointmentId}</strong>
              </p>

              <div className="d-flex flex-column gap-2">
                <Button
                  variant="primary"
                  onClick={handleGenerateSession}
                  disabled={loading || !canGenerateSession}
                >
                  {loading ? 'Generating...' : 'Generate Link'}
                </Button>

                <Button
                  variant="success"
                  onClick={handleJoinSession}
                  disabled={!canJoinSession}
                >
                  Join Session
                </Button>

                <Button
                  variant={canEndSession ? "danger" : "secondary"}
                  onClick={handleEndSession}
                  disabled={!canEndSession}
                  style={{ opacity: canEndSession ? 1 : 0.5 }}
                >
                  End Session
                </Button>
              </div>

              {videoSessions[selectedAppointmentId]?.sessionLink && (
                <p className="mt-3">
                  <small>
                    Session Link: <a href={videoSessions[selectedAppointmentId].sessionLink} target="_blank" rel="noreferrer">{videoSessions[selectedAppointmentId].sessionLink}</a>
                  </small>
                </p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeVideoModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Chat Modal */}
      <Modal show={showChatModal} onHide={closeChatModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chat - Appointment #{chatAppointmentId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {chatAppointmentId && chatOtherUserId && (
            <AppointmentChat
              appointmentId={chatAppointmentId}
              currentUserId={doctor.username} // or doctor.id as string matching backend JWT username
              otherUserId={chatOtherUserId}
              disabled={
                appointments.find(a => a.id === chatAppointmentId)?.status !== 'CONFIRMED'
              }
            />
          )}
          {!chatAppointmentId && <p>No appointment selected for chat.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeChatModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DoctorAppointments;
