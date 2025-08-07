package com.healthcare.userservice.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
}