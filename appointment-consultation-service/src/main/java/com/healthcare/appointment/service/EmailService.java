package com.healthcare.appointment.service;

public interface EmailService {
    void sendAppointmentConfirmation(String to, String subject, String body);
}
