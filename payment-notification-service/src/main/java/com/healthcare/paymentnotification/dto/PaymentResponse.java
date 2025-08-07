package com.healthcare.paymentnotification.dto;

import com.healthcare.paymentnotification.entity.PaymentMode;
import com.healthcare.paymentnotification.entity.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long id;
    private Long appointmentId;
    private Long userId;
    private Long doctorId;
    private BigDecimal amount;
    private PaymentMode paymentMode;
    private PaymentStatus status;
    private String transactionId;
    private LocalDateTime paymentTime;
}
