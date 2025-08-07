package com.healthcare.appointment.service;

import java.util.List;

import com.healthcare.appointment.entity.ChatMessage;

public interface ChatService {
    ChatMessage saveMessage(ChatMessage message);
    List<ChatMessage> getMessagesByAppointmentId(Long appointmentId);
}
