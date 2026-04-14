package com.example.serviceplatform.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "performance_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformancePost {

    @Id
    private String id;

    private String providerId;
    private String providerName;
    private String title;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;
}