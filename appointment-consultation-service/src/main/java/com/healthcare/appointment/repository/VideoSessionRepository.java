package com.healthcare.appointment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthcare.appointment.entity.VideoSession;

public interface VideoSessionRepository extends JpaRepository<VideoSession, Long> {
    Optional<VideoSession> findByAppointmentId(Long appointmentId);
}
