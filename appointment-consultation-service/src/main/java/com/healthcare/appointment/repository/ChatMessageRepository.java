package com.healthcare.appointment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthcare.appointment.entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByAppointmentIdOrderByTimestampAsc(Long appointmentId);
}
