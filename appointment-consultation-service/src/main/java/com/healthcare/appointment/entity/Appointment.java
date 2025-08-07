package com.healthcare.appointment.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long doctorId;

    private String doctorName;
    private String specialization;

    private LocalDateTime appointmentDateTime;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private String consultationLink; // Jitsi/Zoom/WebRTC

    private LocalDateTime updatedAt;  // ✅ Add this field
}
