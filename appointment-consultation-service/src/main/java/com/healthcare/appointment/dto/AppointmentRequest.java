package com.healthcare.appointment.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AppointmentRequest {
    private Long userId;
    private Long doctorId;
    private String doctorName;
    private String specialization;
    private LocalDateTime appointmentDateTime;
}
