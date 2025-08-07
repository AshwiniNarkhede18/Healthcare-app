package com.healthcare.userservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RatingResponse {
    private Long id;
    private Long userId;
    private Long doctorId;
    private int rating;
    private String review;
}
