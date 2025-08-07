package com.healthcare.paymentnotification.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appointmentId;

    private Long userId;

    private Long doctorId;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private LocalDateTime paymentTime;

    private String transactionId;
}
