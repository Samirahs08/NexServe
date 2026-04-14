package com.example.serviceplatform.controller;

import com.example.serviceplatform.entity.Booking;
import com.example.serviceplatform.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> create(
            @RequestBody Booking booking,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            bookingService.createBooking(booking, userDetails.getUsername()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            bookingService.getBookingsByCustomer(userDetails.getUsername()));
    }

    @GetMapping("/provider")
    public ResponseEntity<List<Booking>> getProviderBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            bookingService.getBookingsByProvider(userDetails.getUsername()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable String id,
            @RequestParam String status) {
        return ResponseEntity.ok(bookingService.updateStatus(id, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getById(id));
    }
}
