package com.healthcare.userservice.service;

import com.healthcare.userservice.dto.RatingRequest;
import com.healthcare.userservice.dto.RatingResponse;

import java.util.List;

public interface RatingService {
    RatingResponse addRating(RatingRequest request);
    List<RatingResponse> getRatingsForDoctor(Long doctorId);
}
