package com.example.serviceplatform.repository;

import com.example.serviceplatform.entity.ServiceListing;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface ServiceListingRepository extends MongoRepository<ServiceListing, String> {
    List<ServiceListing> findByProviderId(String providerId);
    List<ServiceListing> findByCategoryAndActiveTrue(String category);
    List<ServiceListing> findByActiveTrue();
    List<ServiceListing> findByTitleContainingIgnoreCaseAndActiveTrue(String keyword);

    @Query("{ 'latitude': { $gte: ?0, $lte: ?1 }, 'longitude': { $gte: ?2, $lte: ?3 }, 'active': true }")
    List<ServiceListing> findNearby(double minLat, double maxLat, double minLng, double maxLng);
}