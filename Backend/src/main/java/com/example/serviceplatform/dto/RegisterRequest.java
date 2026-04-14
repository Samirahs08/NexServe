package com.example.serviceplatform.dto;

import com.example.serviceplatform.entity.Role;
import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class RegisterRequest {
    @NotBlank private String fullName;
    @Email @NotBlank private String email;
    @NotBlank @Size(min = 6) private String password;
    private String phone;
    private Role role;
}