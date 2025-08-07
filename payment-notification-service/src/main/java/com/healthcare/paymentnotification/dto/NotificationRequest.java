package com.healthcare.paymentnotification.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequest {
    private String toEmail;
    private String subject;
    private String message;
}
