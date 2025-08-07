package com.healthcare.userservice.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.userservice.dto.RatingRequest;
import com.healthcare.userservice.dto.RatingResponse;
import com.healthcare.userservice.service.RatingService;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public RatingResponse addRating(@RequestBody RatingRequest request) {
        return ratingService.addRating(request);
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('USER', 'DOCTOR')")
    public List<RatingResponse> getRatingsByDoctor(@PathVariable Long doctorId) {
        return ratingService.getRatingsForDoctor(doctorId);
    }
}
