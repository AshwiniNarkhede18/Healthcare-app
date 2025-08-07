package com.healthcare.paymentnotification.service;

import com.healthcare.paymentnotification.dto.NotificationRequest;
import com.healthcare.paymentnotification.dto.NotificationResponse;
import com.healthcare.paymentnotification.entity.Notification;
import com.healthcare.paymentnotification.entity.NotificationStatus;
import com.healthcare.paymentnotification.entity.NotificationType;
import com.healthcare.paymentnotification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender javaMailSender;
    private final NotificationRepository notificationRepository;

    @Override
    public NotificationResponse sendEmail(NotificationRequest request) {
        boolean success;
        String errorMessage = "";
        LocalDateTime now = LocalDateTime.now();

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getToEmail());
            message.setSubject(request.getSubject());
            message.setText(request.getMessage());
            javaMailSender.send(message);
            success = true;
        } catch (Exception e) {
            success = false;
            errorMessage = e.getMessage();
        }

        // Save notification log
        Notification notification = Notification.builder()
                .toEmail(request.getToEmail())
                .subject(request.getSubject())
                .body(request.getMessage())
                .status(success ? NotificationStatus.SENT : NotificationStatus.FAILED)
                .type(NotificationType.EMAIL)
                .createdAt(now)
                .build();
        notificationRepository.save(notification);

        return NotificationResponse.builder()
                .id(notification.getId())
                .toEmail(request.getToEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .success(success)
                .sentAt(now)
                .build();
    }
}
