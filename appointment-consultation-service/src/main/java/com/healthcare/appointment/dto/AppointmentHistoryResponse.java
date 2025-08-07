package com.healthcare.appointment.dto;

import java.time.LocalDateTime;

import com.healthcare.appointment.entity.AppointmentStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppointmentHistoryResponse {
    private Long appointmentId;
    private Long doctorId;
    private String doctorName;
    private String specialization;

    private Long userId;
    private LocalDateTime appointmentDateTime;
    private AppointmentStatus status;

    private String consultationLink;
    private String prescriptionUrl; // optional
}
