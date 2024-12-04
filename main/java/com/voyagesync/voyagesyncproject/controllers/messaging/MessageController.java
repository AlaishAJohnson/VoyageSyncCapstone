package com.voyagesync.voyagesyncproject.controllers.messaging;

import com.voyagesync.voyagesyncproject.models.messaging.Messages;
import com.voyagesync.voyagesyncproject.services.messaging.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/threads/messages")
@CrossOrigin(origins = "http://localhost:8081")
public class MessageController {
    private final MessageService messageService;
    public MessageController(final MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllMessages() {
        List<Messages> messagesList = messageService.getAllMessages();
        List<Map<String, Object>> response = messagesList.stream().map(messages -> {
            Map<String,Object> messageMap = new LinkedHashMap<>();
            messageMap.put("messageId", messages.getMessageId().toHexString());
            messageMap.put("senderId", messages.getSenderId().toHexString());
            messageMap.put("receiverId", messages.getReceiverId().toHexString());
            messageMap.put("threadId", messages.getThreadId().toHexString());

            if(messages.getTripId() != null) {
                messageMap.put("tripId", messages.getTripId().toHexString());
            } else {
                messageMap.put("tripId", null);
            }
            messageMap.put("content", messages.getContent());
            messageMap.put("timeSent", messages.getTimeSent());
            messageMap.put("timeReceived", messages.getTimeReceived());
            messageMap.put("messageStatus", messages.getMessageStatus());
            messageMap.put("messageType", messages.getMessageType());
            return messageMap;
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
