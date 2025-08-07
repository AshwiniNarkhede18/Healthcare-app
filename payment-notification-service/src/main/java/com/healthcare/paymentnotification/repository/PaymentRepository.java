package com.healthcare.paymentnotification.repository;

import com.healthcare.paymentnotification.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByAppointmentId(Long appointmentId);
    Optional<Payment> findByTransactionId(String transactionId);
}
