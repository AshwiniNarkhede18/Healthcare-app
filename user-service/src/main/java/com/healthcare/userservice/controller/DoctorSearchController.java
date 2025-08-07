package com.healthcare.userservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.userservice.dto.DoctorProfileResponse;
import com.healthcare.userservice.service.DoctorSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorSearchController {

    private final DoctorSearchService doctorSearchService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'DOCTOR')")
    public ResponseEntity<List<DoctorProfileResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorSearchService.getAllDoctors());
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER', 'DOCTOR')")
    public ResponseEntity<List<DoctorProfileResponse>> searchDoctors(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String sortBy
    ) {
        return ResponseEntity.ok(doctorSearchService.searchDoctors(specialization, area, name, sortBy));
    }

    @GetMapping("/{doctorId}/profile")
    @PreAuthorize("hasAnyRole('USER', 'DOCTOR')")
    public ResponseEntity<DoctorProfileResponse> getDoctorProfile(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorSearchService.getDoctorProfile(doctorId));
    }
}
