package com.healthcare.paymentnotification.service;

import java.util.List;

import com.healthcare.paymentnotification.dto.PaymentRequest;
import com.healthcare.paymentnotification.dto.PaymentResponse;

public interface PaymentService {
    PaymentResponse processPayment(PaymentRequest request);
    PaymentResponse getPaymentByAppointmentId(Long appointmentId);
    PaymentResponse getPaymentByTransactionId(String transactionId);
    List<PaymentResponse> getAllPayments();
}
