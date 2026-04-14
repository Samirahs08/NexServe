package com.example.serviceplatform.repository;

import com.example.serviceplatform.entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByRoomIdOrderBySentAtAsc(String roomId);
}