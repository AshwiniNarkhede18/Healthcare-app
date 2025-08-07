package com.healthcare.userservice.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
