package com.healthcare.userservice.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.healthcare.userservice.dto.JwtResponse;
import com.healthcare.userservice.dto.LoginRequest;
import com.healthcare.userservice.dto.RegisterRequest;
import com.healthcare.userservice.entity.DoctorProfile;
import com.healthcare.userservice.entity.Role;
import com.healthcare.userservice.entity.User;
import com.healthcare.userservice.repository.DoctorProfileRepository;
import com.healthcare.userservice.repository.UserRepository;
import com.healthcare.userservice.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final DoctorProfileRepository doctorProfileRepository;

    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Save base User entity
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .contact(request.getContact())
                .location(request.getLocation())
                .role(request.getRole())
                .build();

        userRepository.save(user);

        // If role = DOCTOR, save doctor-specific profile
        if (user.getRole().equals(Role.ROLE_DOCTOR)) {
            // Validate doctor fields (optional: add real validation)
            if (request.getSpecialization() == null || request.getHospitalName() == null) {
                throw new RuntimeException("Specialization and Hospital Name are required for doctors");
            }

            DoctorProfile profile = DoctorProfile.builder()
                    .user(user)
                    .specialization(request.getSpecialization())
                    .qualification(request.getQualification())
                    .experienceYears(request.getExperienceYears())
                    .fee(request.getFee())
                    .ratingAvg(0.0f)  // default
                    .totalReviews(0)  // default
                    .area(user.getLocation())
                    .city(request.getCity())
                    .state(request.getState())
                    .hospitalAffiliation(request.getHospitalName())
                    .build();

            doctorProfileRepository.save(profile);
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);
        return new JwtResponse(token);
    }

    public JwtResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);
        return new JwtResponse(token);
    }
}
