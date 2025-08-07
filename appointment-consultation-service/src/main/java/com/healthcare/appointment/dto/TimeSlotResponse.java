package com.healthcare.appointment.dto;

import java.time.LocalDateTime;

import com.healthcare.appointment.entity.SlotStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TimeSlotResponse {
    private Long id;
    private Long doctorId;
    private LocalDateTime slotTime;
    private SlotStatus status;
}
