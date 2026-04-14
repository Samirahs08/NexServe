package com.example.serviceplatform.repository;

import com.example.serviceplatform.entity.ProviderProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface ProviderProfileRepository extends MongoRepository<ProviderProfile, String> {
    Optional<ProviderProfile> findByUserId(String userId);
}