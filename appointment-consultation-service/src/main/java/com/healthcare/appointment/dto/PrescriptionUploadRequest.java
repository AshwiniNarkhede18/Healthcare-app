package com.healthcare.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionUploadRequest {
    private Long appointmentId;
    private Long doctorId;
    private Long userId;
    private String diagnosis;
    private String medicines;
    private String notes;
}
