package com.healthcare.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String specialization;
    private String qualification;
    private int experienceYears;
    private double fee;
    private float ratingAvg;
    private int totalReviews;
    private String area;
    private String city;
    private String state;
    private String hospitalAffiliation;
}
