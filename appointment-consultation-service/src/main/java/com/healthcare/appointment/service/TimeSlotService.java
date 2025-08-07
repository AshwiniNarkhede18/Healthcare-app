package com.healthcare.appointment.service;

import java.util.List;

import com.healthcare.appointment.dto.TimeSlotRequest;
import com.healthcare.appointment.dto.TimeSlotResponse;

public interface TimeSlotService {
    TimeSlotResponse createTimeSlot(TimeSlotRequest request);
    List<TimeSlotResponse> getDoctorSlots(Long doctorId);
}
