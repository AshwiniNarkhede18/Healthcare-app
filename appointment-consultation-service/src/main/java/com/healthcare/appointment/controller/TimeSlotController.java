package com.healthcare.appointment.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.appointment.dto.TimeSlotRequest;
import com.healthcare.appointment.dto.TimeSlotResponse;
import com.healthcare.appointment.service.TimeSlotService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/timeslots")
@RequiredArgsConstructor
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    @PostMapping
    public ResponseEntity<TimeSlotResponse> createSlot(@RequestBody TimeSlotRequest request) {
        return ResponseEntity.ok(timeSlotService.createTimeSlot(request));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<TimeSlotResponse>> getDoctorSlots(@PathVariable Long doctorId) {
        return ResponseEntity.ok(timeSlotService.getDoctorSlots(doctorId));
    }
}
