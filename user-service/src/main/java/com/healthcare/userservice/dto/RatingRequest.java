package com.healthcare.userservice.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private Long userId;
    private Long doctorId;
    private int rating;
    private String review;
}
