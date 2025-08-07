package com.healthcare.appointment.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.healthcare.appointment.client.UserDoctorClient;
import com.healthcare.appointment.dto.AppointmentHistoryResponse;
import com.healthcare.appointment.dto.AppointmentRequest;
import com.healthcare.appointment.dto.AppointmentResponse;
import com.healthcare.appointment.entity.Appointment;
import com.healthcare.appointment.entity.AppointmentStatus;
import com.healthcare.appointment.entity.Prescription;
import com.healthcare.appointment.entity.SlotStatus;
import com.healthcare.appointment.entity.TimeSlot;
import com.healthcare.appointment.repository.AppointmentRepository;
import com.healthcare.appointment.repository.PrescriptionRepository;
import com.healthcare.appointment.repository.TimeSlotRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

	private final AppointmentRepository appointmentRepository;
	private final TimeSlotRepository timeSlotRepository;
	private final EmailService emailService;
	private final PrescriptionRepository prescriptionRepository;
	private final UserDoctorClient userDoctorClient; 
	@Override
	public AppointmentResponse bookAppointment(AppointmentRequest request) {
		TimeSlot slot = timeSlotRepository
				.findByDoctorIdAndSlotTime(request.getDoctorId(), request.getAppointmentDateTime())
				.stream().findFirst().orElse(null);

		if (slot == null || slot.getStatus() != SlotStatus.AVAILABLE) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected time slot is not available.");

		}

		Appointment appointment = Appointment.builder()
				.userId(request.getUserId())
				.doctorId(request.getDoctorId())
				.doctorName(request.getDoctorName())
				.specialization(request.getSpecialization())
				.appointmentDateTime(request.getAppointmentDateTime())
				.status(AppointmentStatus.CONFIRMED)
				
				.build();

		Appointment saved = appointmentRepository.save(appointment);

		slot.setStatus(SlotStatus.BOOKED);
		timeSlotRepository.save(slot);

		String userEmail = userDoctorClient.getUserEmail(saved.getUserId());      // ✅
		String doctorEmail = userDoctorClient.getDoctorEmail(saved.getDoctorId()); // ✅

		String subject = "Appointment Confirmed";
		String body = String.format("Your appointment with Dr. %s (%s) is scheduled for %s.\nConsultation link: %s",
				saved.getDoctorName(), saved.getSpecialization(), saved.getAppointmentDateTime(),
				saved.getConsultationLink());

		emailService.sendAppointmentConfirmation(userEmail, subject, body);
		emailService.sendAppointmentConfirmation(doctorEmail, subject, body);

		return mapToResponse(saved);
	}

	@Override
	public List<AppointmentResponse> getAppointmentsByUser(Long userId) {
		return appointmentRepository.findByUserId(userId).stream().map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	@Override
	public List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId) {
		return appointmentRepository.findByDoctorId(doctorId).stream().map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	private AppointmentResponse mapToResponse(Appointment appointment) {
		return AppointmentResponse.builder().id(appointment.getId()).userId(appointment.getUserId())
				.doctorId(appointment.getDoctorId()).doctorName(appointment.getDoctorName())
				.specialization(appointment.getSpecialization())
				.appointmentDateTime(appointment.getAppointmentDateTime()).status(appointment.getStatus())
				.consultationLink(appointment.getConsultationLink()).build();
	}

	@Override
	public void cancelAppointment(Long appointmentId) {
		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));

		if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
			throw new RuntimeException("Appointment already cancelled");
		}

		// Update status
		appointment.setStatus(AppointmentStatus.CANCELLED);
		appointmentRepository.save(appointment);

		// Free the slot
		timeSlotRepository.findByDoctorIdAndSlotTime(appointment.getDoctorId(), appointment.getAppointmentDateTime())
				.ifPresent(slot -> {
					slot.setStatus(SlotStatus.AVAILABLE);
					timeSlotRepository.save(slot);
				});
	}

	@Override
	public String getConsultationLink(Long appointmentId) {
		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));

		if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
			throw new RuntimeException("Consultation link is only available for confirmed appointments");
		}

		return appointment.getConsultationLink();
	}
	
	@Override
    public List<AppointmentHistoryResponse> getAppointmentHistoryForUser(Long userId) {
        return appointmentRepository
                .findByUserIdAndStatus(userId, AppointmentStatus.COMPLETED)
                .stream()
                .map(this::mapToHistoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentHistoryResponse> getAppointmentHistoryForDoctor(Long doctorId) {
        return appointmentRepository
                .findByDoctorIdAndStatus(doctorId, AppointmentStatus.COMPLETED)
                .stream()
                .map(this::mapToHistoryResponse)
                .collect(Collectors.toList());
    }

    private AppointmentHistoryResponse mapToHistoryResponse(Appointment appointment) {
    	
        String prescriptionUrl = prescriptionRepository.findByAppointmentId(appointment.getId())
                .map(Prescription::getPrescriptionUrl)
                .orElse(null);

        return AppointmentHistoryResponse.builder()
                .appointmentId(appointment.getId())
                .userId(appointment.getUserId())
                .doctorId(appointment.getDoctorId())
                .doctorName(appointment.getDoctorName())
                .specialization(appointment.getSpecialization())
                .appointmentDateTime(appointment.getAppointmentDateTime())
                .status(appointment.getStatus())
                .consultationLink(appointment.getConsultationLink())
                .prescriptionUrl(prescriptionUrl)
                .build();
    }
    @Override
    public void markAsCompleted(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctorId().equals(doctorId)) {
            throw new RuntimeException("Only assigned doctor can mark this appointment as completed.");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setUpdatedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
    }


}
