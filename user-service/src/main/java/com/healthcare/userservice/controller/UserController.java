package com.healthcare.userservice.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.userservice.entity.User;
import com.healthcare.userservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // Used by other services
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, String>> getUserById(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> Map.of("email", user.getEmail()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get full profile for current user
    @GetMapping("/profile/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
}
