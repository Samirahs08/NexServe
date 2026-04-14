package com.example.serviceplatform.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ServiceResponse {
    private String id;
    private String title;
    private String description;
    private String category;
    private Double price;
    private Double latitude;
    private Double longitude;
    private String address;
    private String providerId;
    private String providerName;
    private boolean active;
}