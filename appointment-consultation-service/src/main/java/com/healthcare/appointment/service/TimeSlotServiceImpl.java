package com.healthcare.appointment.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.healthcare.appointment.dto.TimeSlotRequest;
import com.healthcare.appointment.dto.TimeSlotResponse;
import com.healthcare.appointment.entity.SlotStatus;
import com.healthcare.appointment.entity.TimeSlot;
import com.healthcare.appointment.repository.TimeSlotRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    @Override
    public TimeSlotResponse createTimeSlot(TimeSlotRequest request) {
        TimeSlot slot = TimeSlot.builder()
                .doctorId(request.getDoctorId())
                .slotTime(request.getSlotTime())
                .status(SlotStatus.AVAILABLE)
                .build();

        return mapToDto(timeSlotRepository.save(slot));
    }

    @Override
    public List<TimeSlotResponse> getDoctorSlots(Long doctorId) {
        return timeSlotRepository.findByDoctorId(doctorId)
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private TimeSlotResponse mapToDto(TimeSlot slot) {
        return TimeSlotResponse.builder()
                .id(slot.getId())
                .doctorId(slot.getDoctorId())
                .slotTime(slot.getSlotTime())
                .status(slot.getStatus())
                .build();
    }
}
