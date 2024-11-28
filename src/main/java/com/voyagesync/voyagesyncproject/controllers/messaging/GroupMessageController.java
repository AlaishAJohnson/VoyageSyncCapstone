package com.voyagesync.voyagesyncproject.controllers.messaging;

import com.voyagesync.voyagesyncproject.models.messaging.GroupMessages;
import com.voyagesync.voyagesyncproject.services.messaging.GroupMessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/thread/messages/group")
@CrossOrigin(origins = "http://localhost:8081")
public class GroupMessageController {
    private final GroupMessageService groupMessageService;
    public GroupMessageController(final GroupMessageService groupMessageService) {
        this.groupMessageService = groupMessageService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllGroupMessages() {
        List< GroupMessages> groupMessagesList = groupMessageService.getAllGroupMessages();
        List<Map<String, Object>> response = groupMessagesList.stream().map(groupMessages -> {
            Map<String, Object> groupMessageMap = new HashMap<>();
            groupMessageMap.put("groupMessageId", groupMessages.getGroupMessageId().toHexString());
            groupMessageMap.put("groupTripId", groupMessages.getGroupTripId().toHexString());
            groupMessageMap.put("messageId", groupMessages.getMessageId().toHexString());
            groupMessageMap.put("threadId", groupMessages.getThreadId().toHexString());
            return groupMessageMap;
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
