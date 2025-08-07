package com.healthcare.paymentnotification.dto;

import com.healthcare.paymentnotification.entity.PaymentMode;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {
    private Long appointmentId;
    private Long userId;
    private Long doctorId;
    private BigDecimal amount;
    private PaymentMode paymentMode; // Now using enum instead of string
    private String email; // ✅ Add this to send confirmation
}
