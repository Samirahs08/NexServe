package com.example.serviceplatform.service;

import com.example.serviceplatform.dto.*;
import com.example.serviceplatform.entity.ServiceListing;
import com.example.serviceplatform.entity.User;
import com.example.serviceplatform.repository.ServiceListingRepository;
import com.example.serviceplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceListingService {

    private final ServiceListingRepository serviceListingRepository;
    private final UserRepository userRepository;

    public ServiceResponse create(ServiceRequest request, String email) {
        User provider = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ServiceListing listing = ServiceListing.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .providerId(provider.getId())
                .providerName(provider.getFullName())
                .build();
        return toResponse(serviceListingRepository.save(listing));
    }

    public List<ServiceResponse> getAll() {
        return serviceListingRepository.findByActiveTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ServiceResponse> getByCategory(String category) {
        return serviceListingRepository.findByCategoryAndActiveTrue(category)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ServiceResponse> search(String keyword) {
        return serviceListingRepository.findByTitleContainingIgnoreCaseAndActiveTrue(keyword)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ServiceResponse> getNearby(double lat, double lng) {
        double range = 0.05;
        return serviceListingRepository.findNearby(
                lat - range, lat + range, lng - range, lng + range)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ServiceResponse> getMyServices(String email) {
        User provider = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return serviceListingRepository.findByProviderId(provider.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public void delete(String id) {
        ServiceListing listing = serviceListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        listing.setActive(false);
        serviceListingRepository.save(listing);
    }

    private ServiceResponse toResponse(ServiceListing listing) {
        return ServiceResponse.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .description(listing.getDescription())
                .category(listing.getCategory())
                .price(listing.getPrice())
                .latitude(listing.getLatitude())
                .longitude(listing.getLongitude())
                .address(listing.getAddress())
                .providerId(listing.getProviderId())
                .providerName(listing.getProviderName())
                .active(listing.isActive())
                .build();
    }
}