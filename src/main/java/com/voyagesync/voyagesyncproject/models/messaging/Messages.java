package com.voyagesync.voyagesyncproject.models.messaging;

import com.mongodb.lang.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "Messages")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Messages {
    @Id
    private ObjectId messageId;
    private ObjectId senderId;
    private ObjectId receiverId;
    private ObjectId threadId;
    @Nullable
    private ObjectId tripId;
    private String content;
    private LocalDateTime timeSent;
    private LocalDateTime timeReceived;
    private MessageStatus messageStatus = MessageStatus.PENDING;
    private MessageType messageType;

    public enum MessageStatus {
        PENDING,
        SENT,
        ERROR
    }

    public enum MessageType {
        TEXT,
        IMAGE,
        VIDEO,
        COMBINED
    }

}
