package com.voyagesync.voyagesyncproject.models.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "Thread")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Thread {
    @Id
    private ObjectId threadId;
    private List<ObjectId> participants;
    private List<ObjectId> messageIds;
    private LocalDate createdDate;
    private ThreadType threadType;

    public enum ThreadType {
        ONE_ON_ONE,
        GROUP
    }

}
