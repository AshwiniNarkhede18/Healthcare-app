package com.healthcare.appointment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.appointment.entity.VideoSession;
import com.healthcare.appointment.repository.VideoSessionRepository;
import com.healthcare.appointment.service.VideoSessionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/video")
@RequiredArgsConstructor
public class VideoSessionController {

    private final VideoSessionService videoSessionService;
    private final VideoSessionRepository videoSessionRepository;

    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping("/{appointmentId}")
    public ResponseEntity<VideoSession> createOrFetchVideoSession(@PathVariable Long appointmentId) {
        VideoSession session = videoSessionService.createOrGetSession(appointmentId);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<VideoSession> getSession(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(videoSessionService.getSessionByAppointmentId(appointmentId));
    }
    
    @PreAuthorize("hasRole('DOCTOR')")
    @PutMapping("/{appointmentId}/end")
    public ResponseEntity<Void> endSession(@PathVariable Long appointmentId) {
        videoSessionService.endSession(appointmentId);
        return ResponseEntity.ok().build();
    }
}
