package com.healthcare.userservice.dto;

import com.healthcare.userservice.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String contact;
    private String location;
    private Role role; // ROLE_USER or ROLE_DOCTOR

    // Doctor-specific fields (used only when role = ROLE_DOCTOR)
    private String specialization;
    private String hospitalName;
    private String qualification;
    private int experienceYears;
    private double fee;
    private String city;
    private String state;
}
