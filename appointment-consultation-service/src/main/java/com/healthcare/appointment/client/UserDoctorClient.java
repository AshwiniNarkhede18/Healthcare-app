package com.healthcare.appointment.client;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class UserDoctorClient {

    @Autowired
    private RestTemplate restTemplate;
    private HttpServletRequest request; 

    public String getUserEmail(Long userId) {
        Map<?, ?> response = restTemplate.getForObject(
            "http://localhost:8081/api/users/" + userId, Map.class
        );
        return response != null ? (String) response.get("email") : null;
    }

    public String getDoctorEmail(Long doctorId) {
        HttpServletRequest request = getCurrentHttpRequest();
        if (request == null) {
            throw new IllegalStateException("No current HTTP request available");
        }

        String token = request.getHeader("Authorization");

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:8081/api/doctors/" + doctorId + "/profile",
                HttpMethod.GET,
                entity,
                Map.class
        );

        Map<String, Object> responseBody = response.getBody();
        return responseBody != null ? (String) responseBody.get("email") : null;
    }


    private HttpServletRequest getCurrentHttpRequest() {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes instanceof ServletRequestAttributes servletRequestAttributes) {
            return servletRequestAttributes.getRequest();
        }
        return null;
    }
}

