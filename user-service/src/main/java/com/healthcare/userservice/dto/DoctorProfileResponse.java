package com.healthcare.userservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorProfileResponse {
    private Long id;
    private String fullName;
    private String email; 
    private String specialization;
    private String hospitalName;
    private String area;
    private String city;
    private String state;
    private double consultationFee;
    private float averageRating;
    private int totalReviews;
}
