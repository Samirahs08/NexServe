package com.example.serviceplatform.controller;

import com.example.serviceplatform.entity.ChatMessage;
import com.example.serviceplatform.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/history/{roomId}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable String roomId) {
        return ResponseEntity.ok(chatService.getChatHistory(roomId));
    }

    @GetMapping("/room")
    public ResponseEntity<String> getRoom(
            @RequestParam String user1,
            @RequestParam String user2) {
        return ResponseEntity.ok(chatService.generateRoomId(user1, user2));
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage message) {
        ChatMessage saved = chatService.saveMessage(message);
        messagingTemplate.convertAndSend(
            "/topic/chat/" + message.getRoomId(), saved);
    }

    // REST fallback for sending messages without WebSocket
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessageRest(@RequestBody ChatMessage message) {
        ChatMessage saved = chatService.saveMessage(message);
        return ResponseEntity.ok(saved);
    }
}
