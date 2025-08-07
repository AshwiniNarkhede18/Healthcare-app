package com.healthcare.appointment.service;

import java.util.List;

import com.healthcare.appointment.dto.AppointmentHistoryResponse;
import com.healthcare.appointment.dto.AppointmentRequest;
import com.healthcare.appointment.dto.AppointmentResponse;

public interface AppointmentService {
    AppointmentResponse bookAppointment(AppointmentRequest request);
    List<AppointmentResponse> getAppointmentsByUser(Long userId);
    List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId);
    void cancelAppointment(Long appointmentId);
    String getConsultationLink(Long appointmentId);

    List<AppointmentHistoryResponse> getAppointmentHistoryForUser(Long userId);
    List<AppointmentHistoryResponse> getAppointmentHistoryForDoctor(Long doctorId);
    void markAsCompleted(Long appointmentId, Long doctorId);

}
