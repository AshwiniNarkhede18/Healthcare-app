package com.healthcare.appointment.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.appointment.dto.AppointmentHistoryResponse;
import com.healthcare.appointment.dto.AppointmentRequest;
import com.healthcare.appointment.dto.AppointmentResponse;
import com.healthcare.appointment.service.AppointmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping
    public ResponseEntity<AppointmentResponse> bookAppointment(@RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.bookAppointment(request));
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByUser(userId));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_DOCTOR')")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build(); // 204
    }

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_DOCTOR')")
    @GetMapping("/{id}/consultation-link")
    public ResponseEntity<String> getConsultationLink(@PathVariable Long id) {
        String link = appointmentService.getConsultationLink(id);
        return ResponseEntity.ok(link);
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/history/user/{userId}")
    public ResponseEntity<List<AppointmentHistoryResponse>> getUserHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(appointmentService.getAppointmentHistoryForUser(userId));
    }

    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    @GetMapping("/history/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentHistoryResponse>> getDoctorHistory(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentHistoryForDoctor(doctorId));
    }
    
    @PatchMapping("/{appointmentId}/complete")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    public ResponseEntity<String> markAppointmentCompleted(@PathVariable Long appointmentId,
                                                           @RequestParam Long doctorId) {
        appointmentService.markAsCompleted(appointmentId, doctorId);
        return ResponseEntity.ok("Appointment marked as completed.");
    }

}
