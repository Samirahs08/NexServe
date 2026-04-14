package com.example.serviceplatform.entity;

import lombok.*;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "service_listings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceListing {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;
    private Double price;

    private Double latitude;
    private Double longitude;
    private String address;

    @Builder.Default
    private boolean active = true;

    private String providerId;
    private String providerName;
}