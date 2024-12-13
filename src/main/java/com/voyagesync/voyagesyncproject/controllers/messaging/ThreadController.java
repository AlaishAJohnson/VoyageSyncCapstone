package com.voyagesync.voyagesyncproject.controllers.messaging;

import com.voyagesync.voyagesyncproject.models.messaging.Thread;
import com.voyagesync.voyagesyncproject.services.messaging.ThreadService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/threads")
@CrossOrigin(origins = "http://localhost:8081")
public class ThreadController {
    private final ThreadService threadService;
    public ThreadController(final ThreadService threadService) {
        this.threadService = threadService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllThreads() {
        List<Thread> threadList = threadService.getAllThreads();
        List<Map<String, Object>> response =threadList.stream().map(thread -> {
            Map<String, Object> threadMap = new LinkedHashMap<>();
            threadMap.put("threadId", thread.getThreadId());
            threadMap.put("createdDate", thread.getCreatedDate());
            threadMap.put("threadType", thread.getThreadType());
            List<String> participantIds = thread.getParticipants().stream().map(ObjectId::toHexString).collect(Collectors.toList());
            threadMap.put("participants", participantIds);
            if(thread.getMessageIds() != null) {
                List<String> messageIds = thread.getMessageIds().stream().map(ObjectId::toHexString).collect(Collectors.toList());
                threadMap.put("messageIds", messageIds);
            } else {
                threadMap.put("messageIds", new ArrayList<>());
            }
            return threadMap;
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);

    }
    @GetMapping("/threads/{threadId}")
    public ResponseEntity<Map<String, Object>> getThreadById(@PathVariable("threadId") String threadId) {
        Thread thread = threadService.getThreadById(threadId);

        if (thread == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Map<String, Object> threadMap = new LinkedHashMap<>();
        threadMap.put("threadId", thread.getThreadId());
        threadMap.put("createdDate", thread.getCreatedDate());
        threadMap.put("threadType", thread.getThreadType());

        List<String> participantIds = thread.getParticipants().stream()
                .map(ObjectId::toHexString)
                .collect(Collectors.toList());
        threadMap.put("participants", participantIds);

        if (thread.getMessageIds() != null) {
            List<String> messageIds = thread.getMessageIds().stream()
                    .map(ObjectId::toHexString)
                    .collect(Collectors.toList());
            threadMap.put("messageIds", messageIds);
        } else {
            threadMap.put("messageIds", new ArrayList<>());
        }

        return new ResponseEntity<>(threadMap, HttpStatus.OK);
    }


}
