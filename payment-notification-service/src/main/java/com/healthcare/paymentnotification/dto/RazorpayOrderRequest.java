package com.healthcare.paymentnotification.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayOrderRequest {
    private BigDecimal amount; // in INR
    private String currency; // typically "INR"
    private String receipt;
}
