package com.example.serviceplatform.service;

import com.example.serviceplatform.entity.ChatMessage;
import com.example.serviceplatform.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessage saveMessage(ChatMessage message) {
        message.setSentAt(LocalDateTime.now());
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getChatHistory(String roomId) {
        return chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId);
    }

    public String generateRoomId(String userId1, String userId2) {
        // Always same room ID regardless of who initiates
        return userId1.compareTo(userId2) < 0
                ? userId1 + "_" + userId2
                : userId2 + "_" + userId1;
    }
}