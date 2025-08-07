package com.healthcare.paymentnotification.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayOrderResponse {
    private String id; // Razorpay order ID
    private String currency;
    private int amount; // in paise
    private String status;
}
