package com.healthcare.appointment.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.healthcare.appointment.entity.Appointment;
import com.healthcare.appointment.entity.AppointmentStatus;
import com.healthcare.appointment.entity.VideoSession;
import com.healthcare.appointment.repository.AppointmentRepository;
import com.healthcare.appointment.repository.VideoSessionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VideoSessionServiceImpl implements VideoSessionService {

    private final VideoSessionRepository videoSessionRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public VideoSession createOrGetSession(Long appointmentId) {
        // Check existing session
        return videoSessionRepository.findByAppointmentId(appointmentId)
                .orElseGet(() -> {
                    // Validate appointment
                    Appointment appointment = appointmentRepository.findById(appointmentId)
                            .orElseThrow(() -> new RuntimeException("Appointment not found"));
                    if (!appointment.getStatus().equals(AppointmentStatus.CONFIRMED)) {
                        throw new RuntimeException("Video session allowed only for confirmed appointments");
                    }

                    // Generate Jitsi link
                    String link = "https://meet.jit.si/consult-" + appointmentId + "-" + System.currentTimeMillis();

                    // Create session
                    VideoSession session = VideoSession.builder()
                            .appointmentId(appointmentId)
                            .sessionLink(link)
                            .startedAt(LocalDateTime.now())
                            .build();
                    VideoSession saved = videoSessionRepository.save(session);

                    // Update Appointment with the same link
                    appointment.setConsultationLink(link);
                    appointmentRepository.save(appointment);

                    return saved;
                });
    }

    @Override
    public VideoSession getSessionByAppointmentId(Long appointmentId) {
        return videoSessionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Video session not found for appointment ID: " + appointmentId));
    }

    @Override
    public void endSession(Long appointmentId) {
        VideoSession session = videoSessionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Session not found for appointment ID: " + appointmentId));

        session.setEndedAt(LocalDateTime.now());
        videoSessionRepository.save(session);

        // Optionally mark appointment completed
        appointmentRepository.findById(appointmentId).ifPresent(appointment -> {
            if (appointment.getStatus() == AppointmentStatus.CONFIRMED) {
                appointment.setStatus(AppointmentStatus.COMPLETED);
                appointmentRepository.save(appointment);
            }
        });
    }
}
