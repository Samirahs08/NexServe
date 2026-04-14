package com.example.serviceplatform.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    private String id;

    private String senderId;
    private String receiverId;
    private String senderName;
    private String message;
    private String roomId;
    private LocalDateTime sentAt;
}