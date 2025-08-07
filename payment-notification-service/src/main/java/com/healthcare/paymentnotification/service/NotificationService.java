package com.healthcare.paymentnotification.service;

import com.healthcare.paymentnotification.dto.NotificationRequest;
import com.healthcare.paymentnotification.dto.NotificationResponse;

public interface NotificationService {
    NotificationResponse sendEmail(NotificationRequest request);
}
