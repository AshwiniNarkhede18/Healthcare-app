package com.healthcare.userservice.repository;

import com.healthcare.userservice.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByDoctorId(Long doctorId);
}
