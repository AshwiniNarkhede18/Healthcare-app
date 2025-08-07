package com.healthcare.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {
    private Long appointmentId;     // ✅ Add this field
    private String senderId;
    private String receiverId;
    private String message;
    private String timestamp;
}
