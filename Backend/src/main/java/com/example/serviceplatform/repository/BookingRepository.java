package com.example.serviceplatform.repository;

import com.example.serviceplatform.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(String customerId);
    List<Booking> findByProviderIdOrderByCreatedAtDesc(String providerId);
    List<Booking> findByServiceIdOrderByCreatedAtDesc(String serviceId);
    List<Booking> findByStatus(String status);
}
