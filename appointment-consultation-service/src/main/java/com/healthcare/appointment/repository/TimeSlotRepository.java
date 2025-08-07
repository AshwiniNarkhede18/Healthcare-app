package com.healthcare.appointment.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthcare.appointment.entity.SlotStatus;
import com.healthcare.appointment.entity.TimeSlot;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
	 List<TimeSlot> findByDoctorId(Long doctorId);

	    List<TimeSlot> findByDoctorIdAndSlotTimeBetween(Long doctorId, LocalDateTime start, LocalDateTime end);

	    List<TimeSlot> findByDoctorIdAndStatus(Long doctorId, SlotStatus status);

	    // ✅ New method for booking validation
	    Optional<TimeSlot> findByDoctorIdAndSlotTime(Long doctorId, LocalDateTime slotTime);
}
