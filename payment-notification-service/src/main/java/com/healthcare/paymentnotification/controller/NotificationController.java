package com.healthcare.paymentnotification.controller;

import com.healthcare.paymentnotification.dto.NotificationRequest;
import com.healthcare.paymentnotification.dto.NotificationResponse;
import com.healthcare.paymentnotification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<NotificationResponse> sendNotification(@RequestBody NotificationRequest request) {
        NotificationResponse response = notificationService.sendEmail(request);
        return ResponseEntity.ok(response);
    }
}
