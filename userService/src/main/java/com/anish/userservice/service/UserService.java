package com.anish.userservice.service;

import com.anish.userservice.dto.RegisterRequest;
import com.anish.userservice.dto.UserResponse;
import com.anish.userservice.model.User;
import com.anish.userservice.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
@Slf4j
@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    public UserResponse register(RegisterRequest request) {

        if (repository.existsByEmail(request.getEmail())) {
            log.info("User already exists with email: {}", request.getEmail());
            User existingUser = repository.findByEmail(request.getEmail());

            // --- THIS IS THE FIX ---
            // If the existing user doesn't have a keycloakId, update it.
            if (existingUser.getKeycloakId() == null || existingUser.getKeycloakId().isEmpty()) {
                log.info("Updating existing user with Keycloak ID: {}", request.getKeycloakId());
                existingUser.setKeycloakId(request.getKeycloakId());
                existingUser.setFirstName(request.getFirstName()); // Also update names
                existingUser.setLastName(request.getLastName());
                existingUser = repository.save(existingUser); // Save the update
            }
            // --- END OF FIX ---

            UserResponse userResponse = new UserResponse();
            userResponse.setId(existingUser.getId());
            userResponse.setKeycloakId(existingUser.getKeycloakId());
            userResponse.setPassword(existingUser.getPassword());
            userResponse.setEmail(existingUser.getEmail());
            userResponse.setFirstName(existingUser.getFirstName());
            userResponse.setLastName(existingUser.getLastName());
            userResponse.setCreatedAt(existingUser.getCreatedAt());
            userResponse.setUpdatedAt(existingUser.getUpdatedAt());
            return userResponse;
        }

        // This is the original logic for a completely new user
        log.info("Registering new user with email: {}", request.getEmail());
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // Note: this is saving "dummy@123123"
        user.setKeycloakId(request.getKeycloakId());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = repository.save(user);
        UserResponse userResponse = new UserResponse();
        userResponse.setKeycloakId(savedUser.getKeycloakId());
        userResponse.setId(savedUser.getId());
        userResponse.setPassword(savedUser.getPassword());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setFirstName(savedUser.getFirstName());
        userResponse.setLastName(savedUser.getLastName());
        userResponse.setCreatedAt(savedUser.getCreatedAt());
        userResponse.setUpdatedAt(savedUser.getUpdatedAt());

        return userResponse;
    }

    public UserResponse getUserProfile(String userId) {
        User user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setPassword(user.getPassword());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());

        return userResponse;
    }

    public Boolean existByUserId(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);
        return repository.existsByKeycloakId(userId);
    }
}
