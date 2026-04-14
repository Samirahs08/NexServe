package com.example.serviceplatform.controller;

import com.example.serviceplatform.dto.*;
import com.example.serviceplatform.service.ServiceListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceListingService serviceListingService;

    // Get all active services
    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAll() {
        return ResponseEntity.ok(serviceListingService.getAll());
    }

    // Get nearby services
    @GetMapping("/nearby")
    public ResponseEntity<List<ServiceResponse>> getNearby(
            @RequestParam double lat,
            @RequestParam double lng) {
        return ResponseEntity.ok(serviceListingService.getNearby(lat, lng));
    }

    // Search by keyword
    @GetMapping("/search")
    public ResponseEntity<List<ServiceResponse>> search(
            @RequestParam String keyword) {
        return ResponseEntity.ok(serviceListingService.search(keyword));
    }

    // Get by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ServiceResponse>> getByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(serviceListingService.getByCategory(category));
    }

    // Get my services (provider only)
    @GetMapping("/my")
    public ResponseEntity<List<ServiceResponse>> getMyServices(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            serviceListingService.getMyServices(userDetails.getUsername()));
    }

    // Create a new service (provider only)
    @PostMapping
    public ResponseEntity<ServiceResponse> create(
            @Valid @RequestBody ServiceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            serviceListingService.create(request, userDetails.getUsername()));
    }

    // Delete a service
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        serviceListingService.delete(id);
        return ResponseEntity.ok().build();
    }
}