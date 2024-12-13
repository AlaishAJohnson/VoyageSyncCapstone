package com.voyagesync.voyagesyncproject.services.messaging;

import com.voyagesync.voyagesyncproject.models.messaging.Thread;
import com.voyagesync.voyagesyncproject.repositories.messaging.ThreadRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ThreadService {
    private final ThreadRepository threadRepository;
    public ThreadService(final ThreadRepository threadRepository) {
        this.threadRepository = threadRepository;
    }

    public List<Thread> getAllThreads() {
        return threadRepository.findAll();
    }

    public Thread getThreadById(String threadId) {
        ObjectId threadObjectId = new ObjectId(threadId);
        Optional<Thread> thread = threadRepository.findById(threadObjectId);
        return thread.orElse(null);
    }


}
