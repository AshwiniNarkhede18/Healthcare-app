package com.healthcare.appointment.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.healthcare.appointment.entity.ChatMessage;
import com.healthcare.appointment.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;

    @Override
    public ChatMessage saveMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        return chatMessageRepository.save(message);
    }

    @Override
    public List<ChatMessage> getMessagesByAppointmentId(Long appointmentId) {
        return chatMessageRepository.findByAppointmentIdOrderByTimestampAsc(appointmentId);
    }
}
