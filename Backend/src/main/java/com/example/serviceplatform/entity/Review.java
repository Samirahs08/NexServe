package com.example.serviceplatform.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    private String id;

    private String providerId;
    private String customerId;
    private String customerName;
    private String comment;
    private int rating;
    private LocalDateTime createdAt;
}