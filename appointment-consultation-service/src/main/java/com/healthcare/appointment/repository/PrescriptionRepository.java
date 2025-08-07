package com.healthcare.appointment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthcare.appointment.entity.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    Optional<Prescription> findByAppointmentId(Long appointmentId);
    List<Prescription> findByAppointmentIdIn(List<Long> appointmentIds);

    boolean existsByAppointmentId(Long appointmentId);

}
