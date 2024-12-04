package com.voyagesync.voyagesyncproject.services.messaging;

import com.voyagesync.voyagesyncproject.models.messaging.GroupMessages;
import com.voyagesync.voyagesyncproject.repositories.messaging.GroupMessagesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupMessageService {
    private final GroupMessagesRepository groupMessagesRepository;
    public GroupMessageService(final GroupMessagesRepository groupMessagesRepository) {
        this.groupMessagesRepository = groupMessagesRepository;
    }

    public List<GroupMessages> getAllGroupMessages() {
        return groupMessagesRepository.findAll();
    }
}
