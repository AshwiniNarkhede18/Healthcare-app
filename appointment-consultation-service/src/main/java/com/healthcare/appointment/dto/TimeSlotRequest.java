package com.healthcare.appointment.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TimeSlotRequest {
    private Long doctorId;
    private LocalDateTime slotTime;
}
