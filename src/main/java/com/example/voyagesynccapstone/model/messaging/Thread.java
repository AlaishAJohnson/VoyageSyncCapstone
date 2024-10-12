package com.example.voyagesynccapstone.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "threads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Thread {

    @Id
    private ObjectId threadID;
    private LocalDateTime createdDate;
    private ThreadType threadType;
    private List<ObjectId> participants;
    private  List<ObjectId> messageIDs;

    public enum ThreadType {
        USER_THREAD,
        GROUP_THREAD
    }
}
