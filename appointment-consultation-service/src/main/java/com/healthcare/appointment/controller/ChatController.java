package com.healthcare.appointment.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.appointment.dto.ChatMessageDto;
import com.healthcare.appointment.entity.ChatMessage;
import com.healthcare.appointment.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @MessageMapping("/chat.send") // /app/chat.send
    public void sendMessage(@Payload ChatMessageDto chatMessageDto) {
        // Save message to DB
        ChatMessage saved = chatService.saveMessage(
                ChatMessage.builder()
                        .appointmentId(chatMessageDto.getAppointmentId())
                        .senderId(chatMessageDto.getSenderId())
                        .content(chatMessageDto.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build()
        );

        // Send real-time message
        messagingTemplate.convertAndSendToUser(
                chatMessageDto.getReceiverId(),
                "/queue/messages",
                ChatMessageDto.builder()
                        .senderId(saved.getSenderId())
                        .receiverId(chatMessageDto.getReceiverId())
                        .message(saved.getContent())
                        .timestamp(saved.getTimestamp().toString())
                        .appointmentId(saved.getAppointmentId())
                        .build()
        );
    }
    @GetMapping("/api/chats/{appointmentId}")
    public List<ChatMessageDto> getMessages(@PathVariable Long appointmentId) {
        List<ChatMessage> messages = chatService.getMessagesByAppointmentId(appointmentId);

        return messages.stream()
            .map((ChatMessage msg) -> ChatMessageDto.builder()
                .appointmentId(msg.getAppointmentId())
                .senderId(msg.getSenderId())
                .receiverId(null) // You can populate this if needed
                .message(msg.getContent())
                .timestamp(msg.getTimestamp().format(formatter))
                .build())
            .collect(Collectors.toList());
    }

}
