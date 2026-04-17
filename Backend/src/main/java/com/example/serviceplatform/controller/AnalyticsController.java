package com.example.serviceplatform.controller;

import com.example.serviceplatform.dto.AnalyticsResponse;
import com.example.serviceplatform.entity.Booking;
import com.example.serviceplatform.entity.Role;
import com.example.serviceplatform.repository.BookingRepository;
import com.example.serviceplatform.repository.ServiceListingRepository;
import com.example.serviceplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AnalyticsController {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ServiceListingRepository serviceListingRepository;

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics() {

        // ── User counts ──────────────────────────────────────────
        long totalProviders = userRepository.countByRole(Role.PROVIDER);
        long totalCustomers = userRepository.countByRole(Role.USER);
        long totalUsers     = userRepository.count();

        // ── Service counts ───────────────────────────────────────
        long totalServices  = serviceListingRepository.count();

        // ── Booking data ─────────────────────────────────────────
        List<Booking> allBookings      = bookingRepository.findAllByOrderByCreatedAtDesc();
        long totalBookings             = allBookings.size();
        long pendingBookings           = bookingRepository.countByStatus("PENDING");
        long confirmedBookings         = bookingRepository.countByStatus("CONFIRMED");
        long inProgressBookings        = bookingRepository.countByStatus("IN_PROGRESS");
        long completedBookings         = bookingRepository.countByStatus("COMPLETED");
        long cancelledBookings         = bookingRepository.countByStatus("CANCELLED");

        // ── Revenue: sum of COMPLETED booking prices ─────────────
        double totalRevenue = allBookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .mapToDouble(b -> b.getPrice() != null ? b.getPrice() : 0.0)
                .sum();

        // ── Category breakdown ────────────────────────────────────
        Map<String, Long> categoryBreakdown = serviceListingRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        s -> s.getCategory() != null ? s.getCategory() : "Other",
                        Collectors.counting()
                ));

        // ── Monthly trend (last 6 months) ────────────────────────
        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("yyyy-MM");
        Map<String, Long> monthlyTrend = new TreeMap<>();

        // Pre-fill last 6 months with 0
        java.time.YearMonth now = java.time.YearMonth.now();
        for (int i = 5; i >= 0; i--) {
            monthlyTrend.put(now.minusMonths(i).format(monthFmt), 0L);
        }

        allBookings.stream()
                .filter(b -> b.getCreatedAt() != null)
                .forEach(b -> {
                    String month = b.getCreatedAt().format(monthFmt);
                    if (monthlyTrend.containsKey(month)) {
                        monthlyTrend.merge(month, 1L, Long::sum);
                    }
                });

        // ── Top providers (by completed bookings) ─────────────────
        Map<String, List<Booking>> byProvider = allBookings.stream()
                .filter(b -> b.getProviderId() != null)
                .collect(Collectors.groupingBy(Booking::getProviderId));

        List<AnalyticsResponse.ProviderStat> topProviders = byProvider.entrySet().stream()
                .map(e -> {
                    List<Booking> pb = e.getValue();
                    long completed = pb.stream().filter(b -> "COMPLETED".equals(b.getStatus())).count();
                    double earnings = pb.stream()
                            .filter(b -> "COMPLETED".equals(b.getStatus()))
                            .mapToDouble(b -> b.getPrice() != null ? b.getPrice() : 0.0)
                            .sum();
                    String name = pb.get(0).getProviderName();
                    return AnalyticsResponse.ProviderStat.builder()
                            .providerId(e.getKey())
                            .providerName(name)
                            .completedBookings(completed)
                            .totalEarnings(earnings)
                            .build();
                })
                .sorted(Comparator.comparingLong(AnalyticsResponse.ProviderStat::getCompletedBookings).reversed())
                .limit(5)
                .collect(Collectors.toList());

        // ── Recent bookings (last 10) ─────────────────────────────
        DateTimeFormatter dtFmt = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
        List<AnalyticsResponse.RecentBooking> recentBookings = allBookings.stream()
                .limit(10)
                .map(b -> AnalyticsResponse.RecentBooking.builder()
                        .id(b.getId())
                        .serviceTitle(b.getServiceTitle())
                        .customerName(b.getCustomerName())
                        .providerName(b.getProviderName())
                        .status(b.getStatus())
                        .price(b.getPrice() != null ? b.getPrice() : 0.0)
                        .createdAt(b.getCreatedAt() != null ? b.getCreatedAt().format(dtFmt) : "—")
                        .build())
                .collect(Collectors.toList());

        // ── Build response ────────────────────────────────────────
        AnalyticsResponse response = AnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalProviders(totalProviders)
                .totalCustomers(totalCustomers)
                .totalServices(totalServices)
                .totalBookings(totalBookings)
                .pendingBookings(pendingBookings)
                .confirmedBookings(confirmedBookings)
                .inProgressBookings(inProgressBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .totalRevenue(totalRevenue)
                .categoryBreakdown(categoryBreakdown)
                .monthlyTrend(monthlyTrend)
                .topProviders(topProviders)
                .recentBookings(recentBookings)
                .build();

        return ResponseEntity.ok(response);
    }
}
