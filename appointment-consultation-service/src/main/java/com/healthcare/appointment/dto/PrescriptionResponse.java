package com.healthcare.appointment.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionResponse {
    private Long id;
    private Long appointmentId;
    private Long doctorId;
    private Long userId;
    private String prescriptionUrl;
    private LocalDateTime uploadedAt;
}
