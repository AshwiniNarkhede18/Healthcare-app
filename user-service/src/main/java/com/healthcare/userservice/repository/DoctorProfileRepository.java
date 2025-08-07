package com.healthcare.userservice.repository;

import com.healthcare.userservice.entity.DoctorProfile;
import com.healthcare.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {
    Optional<DoctorProfile> findByUser_Id(Long userId);
}

