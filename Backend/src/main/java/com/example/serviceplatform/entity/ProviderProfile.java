package com.example.serviceplatform.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "provider_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderProfile {

    @Id
    private String id;

    private String userId;
    private String fullName;
    private String bio;
    private String phone;
    private String address;
    private List<String> specialities;
    private double rating;
    private int totalReviews;
    private String profileImageUrl;
}