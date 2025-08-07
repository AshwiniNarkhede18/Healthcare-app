package com.healthcare.appointment.service;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

import com.healthcare.appointment.dto.PrescriptionResponse;
import com.healthcare.appointment.dto.PrescriptionUploadRequest;

public interface PrescriptionService {
    PrescriptionResponse uploadPrescription(PrescriptionUploadRequest request);
    PrescriptionResponse getPrescriptionByAppointmentId(Long appointmentId);
    ResponseEntity<Resource> downloadPrescription(Long appointmentId);
     List<PrescriptionResponse> getPrescriptionsByUser(Long userId);
     List<PrescriptionResponse> getPrescriptionsByDoctor(Long doctorId);
     boolean prescriptionExists(Long appointmentId) ;
}
