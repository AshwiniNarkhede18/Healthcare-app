// dto/UserResponse.java
package com.healthcare.appointment.dto;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role; // USER or DOCTOR
    private String specialization; // only applicable for doctors
}
