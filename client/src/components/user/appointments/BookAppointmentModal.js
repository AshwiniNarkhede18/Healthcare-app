// // //

import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  getDoctorTimeSlots,
  bookAppointment,
  updateAppointmentTimeSlot,
} from "../../../services/appointmentService";
import { getUser } from "../../../services/auth";
import moment from "moment";

const BookAppointmentModal = ({ show, handleClose, doctor, appointmentId }) => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    if (doctor?.userId) {
      getDoctorTimeSlots(doctor.userId).then(setSlots);
    }
  }, [doctor]);

  const handleBookingOrReschedule = async () => {
    const user = getUser();

    try {
      if (appointmentId) {
        // Rescheduling existing appointment
        await updateAppointmentTimeSlot(appointmentId, selectedSlot);
        alert("Appointment rescheduled successfully!");
      } else {
        // Booking a new appointment
        const payload = {
          userId: user.id,
          doctorId: doctor.userId,
          doctorName: doctor.fullName,
          specialization: doctor.specialization,
          appointmentDateTime: selectedSlot,
        };

        await bookAppointment(payload);
        alert("Appointment booked successfully!");
      }
      handleClose();
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
      alert("Failed to process request.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {appointmentId
            ? `Reschedule Appointment with Dr. ${
                doctor?.doctorName || doctor?.fullName
              }`
            : `Book Appointment with Dr. ${
                doctor?.doctorName || doctor?.fullName
              }`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
        >
          <option value="">Select a time slot</option>
          {slots
            .filter((slot) => slot.status === "AVAILABLE")
            .map((slot) => (
              <option key={slot.id} value={slot.slotTime}>
                {moment(slot.slotTime).format("MMMM Do YYYY, h:mm A")}
              </option>
            ))}
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleBookingOrReschedule}
          disabled={!selectedSlot}
        >
          {appointmentId ? "Reschedule" : "Book"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookAppointmentModal;

//

// import React from "react";
// import axios from "axios";
// import { loadRazorpayScript } from "../../../utils/razorpayUtils";
// import {
//   bookAppointment,
//   updateAppointmentTimeSlot,
// } from "../../../services/appointmentService";

// // Local getUser helper to avoid dependency on utils/auth
// const getUser = () => {
//   try {
//     const user = localStorage.getItem("user");
//     return user ? JSON.parse(user) : null;
//   } catch (error) {
//     console.error("Error parsing user from localStorage", error);
//     return null;
//   }
// };

// const BookAppointmentModal = ({
//   doctor,
//   selectedSlot,
//   isReschedule,
//   appointmentId,
//   handleClose,
// }) => {
//   const handleBookingOrReschedule = async () => {
//     const user = getUser();
//     if (!user) {
//       alert("User not logged in!");
//       return;
//     }

//     try {
//       // Rescheduling without payment
//       if (isReschedule && appointmentId) {
//         await updateAppointmentTimeSlot(appointmentId, selectedSlot);
//         alert("Appointment rescheduled successfully!");
//         handleClose();
//         return;
//       }

//       // 1️⃣ Load Razorpay SDK
//       const scriptLoaded = await loadRazorpayScript();
//       if (!scriptLoaded) {
//         alert("Razorpay SDK failed to load. Please check your internet.");
//         return;
//       }

//       // 2️⃣ Create an order on the backend
//       const { data: orderData } = await axios.post(
//         "/api/razorpay/create-order",
//         {
//           amount: doctor.consultationFee || 500,
//           currency: "INR",
//           receipt: `appt_${Date.now()}`,
//         }
//       );

//       // 3️⃣ Razorpay checkout options
//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID", // use env var in production
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: "Healthcare Platform",
//         description: `Consultation with Dr. ${doctor.fullName}`,
//         order_id: orderData.id,
//         handler: async (response) => {
//           try {
//             // 4️⃣ Verify payment on backend
//             await axios.post("/api/payments/verify", {
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpayOrderId: response.razorpay_order_id,
//               razorpaySignature: response.razorpay_signature,
//               userId: user.id,
//               doctorId: doctor.userId,
//               amount: doctor.consultationFee || 500,
//               paymentMode: "ONLINE",
//               email: user.email,
//             });

//             // 5️⃣ Book appointment after successful payment verification
//             const appointmentPayload = {
//               userId: user.id,
//               doctorId: doctor.userId,
//               doctorName: doctor.fullName,
//               specialization: doctor.specialization,
//               appointmentDateTime: selectedSlot,
//             };
//             const apptRes = await bookAppointment(appointmentPayload);

//             alert("Appointment booked successfully!");
//             handleClose();
//           } catch (err) {
//             console.error(
//               "Error verifying payment or booking appointment:",
//               err
//             );
//             alert("Payment verification failed. Please contact support.");
//           }
//         },
//         theme: { color: "#3399cc" },
//       };

//       // 6️⃣ Open Razorpay payment modal
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error(
//         "Error in booking flow:",
//         err.response?.data || err.message
//       );
//       alert("Something went wrong while booking the appointment.");
//     }
//   };

//   return (
//     <div className="modal">
//       <h2>
//         Book Appointment with Dr. {doctor?.fullName} - {doctor?.specialization}
//       </h2>
//       <p>Selected Slot: {selectedSlot}</p>
//       <button onClick={handleBookingOrReschedule}>
//         {isReschedule ? "Reschedule" : "Book & Pay"}
//       </button>
//       <button onClick={handleClose}>Cancel</button>
//     </div>
//   );
// };

// export default BookAppointmentModal;
