import React, { useState } from 'react';
import axios from 'axios';

const RazorpayCheckout = ({ appointmentId, userId, doctorId, amount, email, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Create order on backend
      const orderRes = await axios.post('/api/razorpay/create-order', {
        amount: amount,  // BigDecimal or number in rupees
        currency: "INR",
        receipt: `receipt_order_${appointmentId}`,
      });

      const { id: orderId, currency } = orderRes.data;

      // 2. Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Add your test key in env variables
        amount: amount * 100, // in paise
        currency: currency,
        name: "Healthcare Appointments",
        description: `Payment for Appointment #${appointmentId}`,
        order_id: orderId,
        prefill: {
          email: email,
          // add phone if you want
        },
        handler: async function (response) {
          // 3. On success, verify payment on backend
          try {
            const verifyRes = await axios.post('/api/payments/verify', {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              appointmentId,
              userId,
              doctorId,
              amount,
              paymentMode: "Razorpay",
              email,
            });
            onPaymentSuccess(verifyRes.data);
          } catch (error) {
            alert('Payment verification failed, please contact support.');
          }
        },
        theme: {
          color: "#007bff",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      alert('Failed to initiate payment. Please try again later.');
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </button>
    </div>
  );
};

export default RazorpayCheckout;
