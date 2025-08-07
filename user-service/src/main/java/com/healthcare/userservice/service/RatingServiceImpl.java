package com.healthcare.userservice.service;

import com.healthcare.userservice.dto.RatingRequest;
import com.healthcare.userservice.dto.RatingResponse;
import com.healthcare.userservice.entity.Rating;
import com.healthcare.userservice.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;

    @Override
    public RatingResponse addRating(RatingRequest request) {
        Rating rating = Rating.builder()
                .userId(request.getUserId())
                .doctorId(request.getDoctorId())
                .rating(request.getRating())
                .review(request.getReview())
                .build();
        Rating saved = ratingRepository.save(rating);
        return mapToResponse(saved);
    }

    @Override
    public List<RatingResponse> getRatingsForDoctor(Long doctorId) {
        return ratingRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private RatingResponse mapToResponse(Rating rating) {
        return RatingResponse.builder()
                .id(rating.getId())
                .userId(rating.getUserId())
                .doctorId(rating.getDoctorId())
                .rating(rating.getRating())
                .review(rating.getReview())
                .build();
    }
}
