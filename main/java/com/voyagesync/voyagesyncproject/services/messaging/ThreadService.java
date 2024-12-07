package com.voyagesync.voyagesyncproject.services.messaging;

import com.voyagesync.voyagesyncproject.models.messaging.Thread;
import com.voyagesync.voyagesyncproject.repositories.messaging.ThreadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThreadService {
    private final ThreadRepository threadRepository;
    public ThreadService(final ThreadRepository threadRepository) {
        this.threadRepository = threadRepository;
    }

    public List<Thread> getAllThreads() {
        return threadRepository.findAll();
    }
}
