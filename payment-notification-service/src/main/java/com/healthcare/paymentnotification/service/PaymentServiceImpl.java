package com.healthcare.paymentnotification.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.healthcare.paymentnotification.dto.NotificationRequest;
import com.healthcare.paymentnotification.dto.PaymentRequest;
import com.healthcare.paymentnotification.dto.PaymentResponse;
import com.healthcare.paymentnotification.entity.Payment;
import com.healthcare.paymentnotification.entity.PaymentStatus;
import com.healthcare.paymentnotification.exception.ResourceNotFoundException;
import com.healthcare.paymentnotification.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService; // ✅ Injected

    @Override
    public PaymentResponse processPayment(PaymentRequest request) {
        Payment payment = Payment.builder()
                .appointmentId(request.getAppointmentId())
                .userId(request.getUserId())
                .doctorId(request.getDoctorId())
                .amount(request.getAmount())
                .paymentMode(request.getPaymentMode())
                .status(PaymentStatus.SUCCESS)
                .paymentTime(LocalDateTime.now())
                .transactionId(generateTransactionId())
                .build();

        Payment saved = paymentRepository.save(payment);

        // ✅ Send notification
        sendPaymentSuccessEmail(request.getEmail(), saved);

        return mapToResponse(saved);
    }

    @Override
    public PaymentResponse getPaymentByAppointmentId(Long appointmentId) {
        Payment payment = paymentRepository.findByAppointmentId(appointmentId)
        		.orElseThrow(() -> new ResourceNotFoundException("Payment not found for appointment ID: " + appointmentId));

        return mapToResponse(payment);
    }

    @Override
    public PaymentResponse getPaymentByTransactionId(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
        		.orElseThrow(() -> new ResourceNotFoundException("Payment not found for transaction ID: " + transactionId));
        return mapToResponse(payment);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .appointmentId(payment.getAppointmentId())
                .userId(payment.getUserId())
                .doctorId(payment.getDoctorId())
                .amount(payment.getAmount())
                .paymentMode(payment.getPaymentMode())
                .status(payment.getStatus())
                .paymentTime(payment.getPaymentTime())
                .transactionId(payment.getTransactionId())
                .build();
    }

    private String generateTransactionId() {
        return UUID.randomUUID().toString();
    }

    private void sendPaymentSuccessEmail(String email, Payment payment) {
        if (email == null || email.isBlank()) return;

        String body = String.format("""
                Dear User,

                Your payment of ₹%s for Appointment ID #%d was successful.

                ➤ Transaction ID: %s
                ➤ Payment Method: %s
                ➤ Date: %s

                Thank you for using our service!

                Regards,
                Healthcare Team
                """,
                payment.getAmount(),
                payment.getAppointmentId(),
                payment.getTransactionId(),
                payment.getPaymentMode(),
                payment.getPaymentTime()
        );

        NotificationRequest notificationRequest = NotificationRequest.builder()
                .toEmail(email)
                .subject("Payment Confirmation - Healthcare")
                .message(body)
                .build();

        notificationService.sendEmail(notificationRequest);
    }
    @Override
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
            .map(this::mapToResponse)
            .toList();
    }

}
