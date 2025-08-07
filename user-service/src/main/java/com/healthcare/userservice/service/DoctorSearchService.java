package com.healthcare.userservice.service;

import com.healthcare.userservice.dto.DoctorProfileResponse;

import java.util.List;

public interface DoctorSearchService {
    List<DoctorProfileResponse> searchDoctors(String specialization, String area, String name, String sortBy);
    DoctorProfileResponse getDoctorProfile(Long doctorId);
    List<DoctorProfileResponse> getAllDoctors();
}
