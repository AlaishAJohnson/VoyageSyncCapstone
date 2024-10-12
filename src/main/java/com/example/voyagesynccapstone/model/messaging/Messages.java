package com.example.voyagesynccapstone.model.messaging;

import com.mongodb.lang.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Messages extends Thread {

    @Id
    private ObjectId messageID;
    private String content;
    private LocalDateTime timeSent;
    private LocalDateTime timeReceived;
    private MessageType messageType;
    private MessageStatus messageStatus;

    // References
    private ObjectId senderID;
    private ObjectId receiverID;
    @Nullable private ObjectId tripID;

    // Enums
    public enum MessageType {
        TEXT,
        IMAGE,
        VIDEO,
        DOCUMENT
    }

    public enum MessageStatus {
        SENT,
        DELIVERED,
        READ,
        ERROR
    }
}
