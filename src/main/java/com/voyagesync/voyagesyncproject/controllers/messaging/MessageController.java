package com.voyagesync.voyagesyncproject.controllers.messaging;

import com.voyagesync.voyagesyncproject.models.messaging.Messages;
import com.voyagesync.voyagesyncproject.repositories.messaging.MessagesRepository;
import com.voyagesync.voyagesyncproject.services.messaging.MessageService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/threads/messages")
@CrossOrigin(origins = "http://localhost:8081")
public class MessageController {
    private final MessageService messageService;
    private final MessagesRepository messagesRepository;

    public MessageController(final MessageService messageService, MessagesRepository messagesRepository) {
        this.messageService = messageService;
        this.messagesRepository = messagesRepository;
    }

    /* Get Methods */
    @GetMapping("/")
    public ResponseEntity<List<Map<String, Object>>> getAllMessages() {
        List<Messages> messagesList = messageService.getAllMessages();
        List<Map<String, Object>> response = messagesList.stream()
                .map(this::mapMessageToResponse)
                .toList();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<Map<String, Object>> getMessageById(@PathVariable String messageId) {
        ObjectId messageObjectId = new ObjectId(messageId);
        Optional<Messages> messageOptional = messagesRepository.findById(messageObjectId);

        if (messageOptional.isEmpty()) {
            return new ResponseEntity<>(Map.of("error", "Message not found"), HttpStatus.NOT_FOUND);
        }

        Map<String, Object> response = mapMessageToResponse(messageOptional.get());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/sender/{senderId}")
    public ResponseEntity<List<Map<String, Object>>> getMessagesBySenderId(@PathVariable String senderId) {
        ObjectId senderObjectId = new ObjectId(senderId);
        List<Messages> messages = messageService.getMessagesBySenderId(senderObjectId);

        List<Map<String, Object>> response = messages.stream()
                .map(this::mapMessageToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }


    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<List<Map<String, Object>>> getMessagesByReceiverId(@PathVariable String receiverId) {
        ObjectId receiverObjectId = new ObjectId(receiverId);
        List<Messages> messages = messageService.getMessagesByReceiverId(receiverObjectId);

        List<Map<String, Object>> response = messages.stream()
                .map(this::mapMessageToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/create/{senderId}/{receiverId}")
    public ResponseEntity<Map<String, Object>> sendMessage(
            @PathVariable String senderId,
            @PathVariable String receiverId,
            @RequestBody Map<String, Object> messageRequest) {

        // Check for null or empty sender/receiver IDs
        if (senderId == null || senderId.isEmpty() || receiverId == null || receiverId.isEmpty()) {
            return new ResponseEntity<>(Map.of("error", "Sender or receiver ID cannot be null or empty"), HttpStatus.BAD_REQUEST);
        }

        try {
            // Convert senderId and receiverId to ObjectIds
            ObjectId senderObjectId = new ObjectId(senderId);
            ObjectId receiverObjectId = new ObjectId(receiverId);

            // Handle threadId (generate if not provided)
            String threadIdStr = (String) messageRequest.get("threadId");
            ObjectId threadId;
            if (threadIdStr == null || threadIdStr.isEmpty()) {
                threadId = new ObjectId();  // Generate new threadId if not provided
            } else {
                threadId = new ObjectId(threadIdStr);  // Use provided threadId
            }
            // Create and populate the message object
            Messages message = new Messages();
            message.setSenderId(senderObjectId);
            message.setReceiverId(receiverObjectId);
            message.setContent((String) messageRequest.get("content"));

            String messageTypeStr = (String) messageRequest.get("messageType");
            Messages.MessageType messageType = Messages.MessageType.valueOf(messageTypeStr.toUpperCase());
            message.setMessageType(messageType);

            message.setMessageStatus(Messages.MessageStatus.PENDING);  // Set initial status as PENDING

            message.setThreadId(threadId);  // Set the threadId (either from request or generated)

            LocalDateTime now = LocalDateTime.now();
            message.setTimeSent(now);
            message.setTimeReceived(now);

            // Save the message to the repository
            Messages savedMessage = messagesRepository.save(message);

            // Return the response with the saved message details
            Map<String, Object> response = mapMessageToResponse(savedMessage);
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            // Catch invalid ObjectId format and return a meaningful error message
            return new ResponseEntity<>(Map.of("error", "Invalid ID format provided"), HttpStatus.BAD_REQUEST);
        }
    }

    /* Put Methods*/
    @PutMapping("/update/{messageId}")
    public ResponseEntity<Map<String, Object>> updateMessage(@PathVariable String messageId, @RequestBody Map<String, Object> messageRequest) {
        ObjectId messageObjectId = new ObjectId(messageId);
        Optional<Messages> messageOptional = messagesRepository.findById(messageObjectId);

        if (messageOptional.isEmpty()) {
            return new ResponseEntity<>(Map.of("error", "Message not found"), HttpStatus.NOT_FOUND);
        }

        Messages message = messageOptional.get();
        message.setContent((String) messageRequest.get("content"));
        message.setMessageStatus(Messages.MessageStatus.PENDING);

        Messages updatedMessage = messagesRepository.save(message);
        Map<String, Object> response = mapMessageToResponse(updatedMessage);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Map<String, Object>> markMessageAsRead(@PathVariable String messageId) {
        ObjectId messageObjectId = new ObjectId(messageId);
        Optional<Messages> messageOptional = messagesRepository.findById(messageObjectId);

        if (messageOptional.isEmpty()) {
            return new ResponseEntity<>(Map.of("error", "Message not found"), HttpStatus.NOT_FOUND);
        }

        Messages message = messageOptional.get();
        message.setMessageStatus(Messages.MessageStatus.READ);
        Messages updatedMessage = messagesRepository.save(message);

        Map<String, Object> response = mapMessageToResponse(updatedMessage);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    /* Delete Methods */
    @DeleteMapping("/delete/{messageId}")
    public ResponseEntity<Map<String, Object>> deleteMessage(@PathVariable String messageId) {
        ObjectId messageObjectId = new ObjectId(messageId);

        Optional<Messages> messageOptional = messagesRepository.findById(messageObjectId);
        if (messageOptional.isEmpty()) {
            return new ResponseEntity<>(Map.of("error", "Message not found"), HttpStatus.NOT_FOUND);
        }

        messagesRepository.deleteById(messageObjectId);

        return new ResponseEntity<>(Map.of("message", "Message deleted successfully"), HttpStatus.OK);
    }
    // Helper Function
    public Map<String, Object> mapMessageToResponse(Messages message) {
        Map<String, Object> messageMap = new LinkedHashMap<>();

        messageMap.put("messageId", message.getMessageId().toHexString());
        messageMap.put("senderId", message.getSenderId().toHexString());
        messageMap.put("receiverId", message.getReceiverId().toHexString());
        messageMap.put("threadId", message.getThreadId().toHexString());

        if (message.getTripId() != null) {
            messageMap.put("tripId", message.getTripId().toHexString());
        } else {
            messageMap.put("tripId", null);
        }

        messageMap.put("content", message.getContent());
        messageMap.put("timeSent", message.getTimeSent());
        messageMap.put("timeReceived", message.getTimeReceived());
        messageMap.put("messageStatus", message.getMessageStatus());
        messageMap.put("messageType", message.getMessageType());

        return messageMap;
    }
}
