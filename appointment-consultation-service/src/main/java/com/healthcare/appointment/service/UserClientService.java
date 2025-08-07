// service/UserClientService.java
package com.healthcare.appointment.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.healthcare.appointment.dto.UserResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserClientService {

    private final RestTemplate restTemplate;

    @Value("${auth.service.base-url}")
    private String authServiceBaseUrl;

    public UserResponse getUserById(Long userId) {
        return restTemplate.getForObject(authServiceBaseUrl + "/api/users/" + userId, UserResponse.class);
    }

    public UserResponse getDoctorById(Long doctorId) {
        return restTemplate.getForObject(authServiceBaseUrl + "/api/doctors/" + doctorId, UserResponse.class);
    }
}
