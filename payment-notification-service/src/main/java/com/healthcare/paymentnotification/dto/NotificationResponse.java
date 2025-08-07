package com.healthcare.paymentnotification.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private String toEmail;
    private String subject;
    private String message;
    private boolean success;
    private LocalDateTime sentAt;
}
