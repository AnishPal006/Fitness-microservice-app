package com.anish.userservice.dto;


import lombok.Data;

import java.time.LocalDate;

@Data
public class UserResponse {
    private String id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
