package com.voyagesync.voyagesyncproject.models.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "GroupTripMessages")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupMessages {
    @Id
    private ObjectId groupMessageId;
    private ObjectId groupTripId;
    private ObjectId messageId;
    private ObjectId threadId;
}
