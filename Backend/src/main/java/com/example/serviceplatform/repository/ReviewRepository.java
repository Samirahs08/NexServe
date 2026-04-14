package com.example.serviceplatform.repository;

import com.example.serviceplatform.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByProviderId(String providerId);
    List<Review> findByCustomerId(String customerId);
}