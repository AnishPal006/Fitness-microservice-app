package com.anish.gateway.user;

import lombok.Data;

// 1. --- IMPORT LocalDate INSTEAD ---
import java.time.LocalDate;

@Data
public class UserResponse {
    private String id;
    private String keycloakId;
    private String email;
    private String password;
    private String firstName;
    private String lastName;

    // 2. --- CHANGE THESE TWO LINES TO LocalDate ---
    private LocalDate createdAt;
    private LocalDate updatedAt;
}