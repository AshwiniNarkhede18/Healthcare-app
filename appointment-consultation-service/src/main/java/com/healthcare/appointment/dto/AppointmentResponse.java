package com.healthcare.appointment.dto;

import java.time.LocalDateTime;

import com.healthcare.appointment.entity.AppointmentStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppointmentResponse {
    private Long id;
    private Long userId;
    private Long doctorId;
    private String doctorName;
    private String specialization;
    private LocalDateTime appointmentDateTime;
    private AppointmentStatus status;
    private String consultationLink;
}
