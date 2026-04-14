package com.example.serviceplatform.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    private String id;

    private String serviceId;
    private String serviceTitle;
    private String providerId;
    private String providerName;
    private String customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String notes;
    private Double price;

    @Builder.Default
    private String status = "PENDING"; // PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED

    private LocalDateTime bookingDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
