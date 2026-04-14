package com.example.serviceplatform.repository;

import com.example.serviceplatform.entity.PerformancePost;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PerformancePostRepository extends MongoRepository<PerformancePost, String> {
    List<PerformancePost> findByProviderIdOrderByCreatedAtDesc(String providerId);
}