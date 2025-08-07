package com.healthcare.paymentnotification.repository;

import com.healthcare.paymentnotification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
