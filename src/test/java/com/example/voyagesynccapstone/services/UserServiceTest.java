package com.example.voyagesynccapstone.services;


import com.example.voyagesynccapstone.enums.VerificationStatus;
import com.example.voyagesynccapstone.interfaces.users.UserRepository;
import com.example.voyagesynccapstone.model.users.Users;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private Users user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new Users(
                new ObjectId(),
                "John",
                "Doe",
                "john.doe@example.com",
                "password123",
                "1234567890",
                "USER",
                null,
                LocalDateTime.now(),
                VerificationStatus.PENDING,
                null,
                null
        );
    }

    @Test
    void testGetAllUsers() {
        // Arrange
        when(userRepository.findAll()).thenReturn(Arrays.asList(user));

        // Act
        List<Users> users = userService.getAllUsers();

        // Assert
        assertEquals(1, users.size());
        assertEquals(user, users.get(0));
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetUserById() {
        // Arrange
        ObjectId userId = user.getUserID();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act
        Users foundUser = userService.getUserById(userId);

        // Assert
        assertEquals(user, foundUser);
        verify(userRepository, times(1)).findById(userId); /
    }

    @Test
    void testCreateUser() {
        // Arrange
        when(userRepository.save(any(Users.class))).thenReturn(user);

        // Act
        Users createdUser = userService.createUser(user);

        // Assert
        assertEquals(user, createdUser);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testDeleteUser() {
        // Arrange
        ObjectId userId = user.getUserID();

        // Act
        userService.deleteUser(userId);

        // Assert
        verify(userRepository, times(1)).deleteUsersByUserID(userId); /
    }

    @Test
    void testFindUsersByRole() {
        // Arrange
        when(userRepository.findByRole("USER")).thenReturn(Arrays.asList(user));

        // Act
        List<Users> users = userService.findUsersByRole("USER");

        // Assert
        assertEquals(1, users.size());
        assertEquals(user, users.get(0));
        verify(userRepository, times(1)).findByRole("USER");
    }

    @Test
    void testFindUsersByVerificationStatus() {
        // Arrange
        when(userRepository.findByVerificationStatus(VerificationStatus.PENDING)).thenReturn(Arrays.asList(user));

        // Act
        List<Users> users = userService.findUsersByVerificationStatus(VerificationStatus.PENDING);

        // Assert
        assertEquals(1, users.size());
        assertEquals(user, users.get(0));
        verify(userRepository, times(1)).findByVerificationStatus(VerificationStatus.PENDING);
    }
}
