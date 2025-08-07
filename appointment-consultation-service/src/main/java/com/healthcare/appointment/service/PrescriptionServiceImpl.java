package com.healthcare.appointment.service;

import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.healthcare.appointment.dto.PrescriptionResponse;
import com.healthcare.appointment.dto.PrescriptionUploadRequest;
import com.healthcare.appointment.entity.Appointment;
import com.healthcare.appointment.entity.AppointmentStatus;
import com.healthcare.appointment.entity.Prescription;
import com.healthcare.appointment.repository.AppointmentRepository;
import com.healthcare.appointment.repository.PrescriptionRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final Path storagePath = Paths.get("uploads/prescriptions");
    private final AppointmentRepository appointmentRepository;

    @PostConstruct
    public void init() throws Exception {
        Files.createDirectories(storagePath);
    }

    @Override
    public PrescriptionResponse uploadPrescription(PrescriptionUploadRequest request) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // ✅ Only doctor who owns the appointment can upload
        if (!appointment.getDoctorId().equals(request.getDoctorId())) {
            throw new RuntimeException("Doctor not authorized for this appointment");
        }

        // ✅ Only for completed appointments
        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Prescription can only be uploaded for completed appointments");
        }

        // ✅ Prevent duplicate prescriptions
        if (prescriptionRepository.findByAppointmentId(request.getAppointmentId()).isPresent()) {
            throw new RuntimeException("Prescription already exists for this appointment");
        }

        Prescription prescription = Prescription.builder()
                .appointmentId(request.getAppointmentId())
                .doctorId(request.getDoctorId())
                .userId(request.getUserId())
                .diagnosis(request.getDiagnosis())
                .medicines(request.getMedicines())
                .notes(request.getNotes())
                .uploadedAt(LocalDateTime.now())
                .build();

        Prescription saved = prescriptionRepository.save(prescription);
        String pdfUrl = generatePdf(saved);
        saved.setPrescriptionUrl(pdfUrl);
        prescriptionRepository.save(saved);

        return mapToResponse(saved);
    }



    @Override
    public PrescriptionResponse getPrescriptionByAppointmentId(Long appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        return mapToResponse(prescription);
    }

    @Override
    public ResponseEntity<Resource> downloadPrescription(Long appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        try {
            Path filePath = storagePath.resolve(prescription.getPrescriptionUrl());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) throw new RuntimeException("PDF not found");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + resource.getFilename())
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException("Error downloading prescription PDF", e);
        }
    }

    private String generatePdf(Prescription p) {
        String fileName = "prescription_" + p.getAppointmentId() + ".pdf";
        Path filePath = storagePath.resolve(fileName);

        try {
            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(filePath.toFile()));
            document.open();

            document.add(new Paragraph("Prescription"));
            document.add(new Paragraph("Date: " + p.getUploadedAt()));
            document.add(new Paragraph("Appointment ID: " + p.getAppointmentId()));
            document.add(new Paragraph("Doctor ID: " + p.getDoctorId()));
            document.add(new Paragraph("User ID: " + p.getUserId()));
            document.add(new Paragraph("Diagnosis: " + p.getDiagnosis()));
            document.add(new Paragraph("Medicines: " + p.getMedicines()));
            document.add(new Paragraph("Notes: " + p.getNotes()));

            document.close();
            return fileName;

        } catch (Exception e) {
            throw new RuntimeException("Failed to create PDF", e);
        }
    }


    private PrescriptionResponse mapToResponse(Prescription p) {
        return PrescriptionResponse.builder()
                .id(p.getId())
                .appointmentId(p.getAppointmentId())
                .doctorId(p.getDoctorId())
                .userId(p.getUserId())
                .uploadedAt(p.getUploadedAt())
                .prescriptionUrl("/api/prescriptions/download/" + p.getAppointmentId())
                .build();
    }
    @Override
    public List<PrescriptionResponse> getPrescriptionsByUser(Long userId) {
        List<Long> appointmentIds = appointmentRepository.findByUserId(userId)
                .stream().map(Appointment::getId).toList();
        List<Prescription> prescriptions = prescriptionRepository.findByAppointmentIdIn(appointmentIds);

        return prescriptions.stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<PrescriptionResponse> getPrescriptionsByDoctor(Long doctorId) {
        List<Long> appointmentIds = appointmentRepository.findByDoctorId(doctorId)
                .stream().map(Appointment::getId).toList();
        List<Prescription> prescriptions = prescriptionRepository.findByAppointmentIdIn(appointmentIds);

        return prescriptions.stream().map(this::mapToResponse).toList();
    }


    @Override
    public boolean prescriptionExists(Long appointmentId) {
        return prescriptionRepository.existsByAppointmentId(appointmentId);
    }

}
