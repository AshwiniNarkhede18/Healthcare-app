package com.healthcare.appointment.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.appointment.dto.PrescriptionResponse;
import com.healthcare.appointment.dto.PrescriptionUploadRequest;
import com.healthcare.appointment.service.PrescriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping("/submit")
    public ResponseEntity<PrescriptionResponse> submitPrescription(@RequestBody PrescriptionUploadRequest request) {
        return ResponseEntity.ok(prescriptionService.uploadPrescription(request));
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<PrescriptionResponse> getByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionByAppointmentId(appointmentId));
    }

    @GetMapping("/download/{appointmentId}")
    public ResponseEntity<Resource> downloadPrescription(@PathVariable Long appointmentId) {
        return prescriptionService.downloadPrescription(appointmentId);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionsByUser(@PathVariable Long userId) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByUser(userId);
        return ResponseEntity.ok(prescriptions);
    }
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionsByDoctor(@PathVariable Long doctorId) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByDoctor(doctorId);
        return ResponseEntity.ok(prescriptions);
    }
    @GetMapping("/exists/{appointmentId}")
    public ResponseEntity<Boolean> prescriptionExists(@PathVariable Long appointmentId) {
        boolean exists = prescriptionService.prescriptionExists(appointmentId);
        return ResponseEntity.ok(exists);
    }

}
