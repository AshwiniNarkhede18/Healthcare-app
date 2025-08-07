package com.healthcare.userservice.service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import com.healthcare.userservice.dto.DoctorProfileResponse;
import com.healthcare.userservice.entity.DoctorProfile;
import com.healthcare.userservice.entity.User;
import com.healthcare.userservice.repository.DoctorProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorSearchServiceImpl implements DoctorSearchService {

    private final DoctorProfileRepository doctorProfileRepository;

    @Override
    public List<DoctorProfileResponse> searchDoctors(String specialization, String area, String name, String sortBy) {
        List<DoctorProfile> doctors = doctorProfileRepository.findAll();

        Stream<DoctorProfile> stream = doctors.stream();

        if (specialization != null) {
            stream = stream.filter(d -> d.getSpecialization().equalsIgnoreCase(specialization));
        }
        if (area != null) {
            stream = stream.filter(d -> d.getArea().equalsIgnoreCase(area));
        }
        if (name != null) {
            stream = stream.filter(d -> d.getUser().getFullName().toLowerCase().contains(name.toLowerCase()));
        }

        List<DoctorProfileResponse> result = stream.map(this::mapToResponse).collect(Collectors.toList());

        if ("rating".equalsIgnoreCase(sortBy)) {
            result.sort((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()));
        }

        return result;
    }

    @Override
    public DoctorProfileResponse getDoctorProfile(Long doctorId) {
        DoctorProfile doctor = doctorProfileRepository.findByUser_Id(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return mapToResponse(doctor);
    }

    @Override
    public List<DoctorProfileResponse> getAllDoctors() {
        return doctorProfileRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DoctorProfileResponse mapToResponse(DoctorProfile profile) {
        User user = profile.getUser();

        return DoctorProfileResponse.builder()
                .id(profile.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .specialization(profile.getSpecialization())
                .hospitalName(profile.getHospitalAffiliation()) // ✅ FIXED HERE
                .area(profile.getArea())
                .city(profile.getCity())
                .state(profile.getState())
                .consultationFee(profile.getFee())
                .averageRating(profile.getRatingAvg())
                .totalReviews(profile.getTotalReviews())
                .build();
    }
}
