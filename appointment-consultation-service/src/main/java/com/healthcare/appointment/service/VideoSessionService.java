package com.healthcare.appointment.service;

import com.healthcare.appointment.entity.VideoSession;

public interface VideoSessionService {
    VideoSession createOrGetSession(Long appointmentId);
    VideoSession getSessionByAppointmentId(Long appointmentId);
    void endSession(Long appointmentId);
}
