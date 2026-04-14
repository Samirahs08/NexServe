package com.example.serviceplatform.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class ServiceRequest {
    @NotBlank private String title;
    @NotBlank private String description;
    @NotBlank private String category;
    @NotNull private Double price;
    @NotNull private Double latitude;
    @NotNull private Double longitude;
    private String address;
}