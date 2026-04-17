package com.example.serviceplatform.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class AnalyticsResponse {

    // ── User counts ──────────────────────────────────────────────
    private long totalUsers;
    private long totalProviders;
    private long totalCustomers;

    // ── Service counts ───────────────────────────────────────────
    private long totalServices;

    // ── Booking counts ───────────────────────────────────────────
    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
    private long inProgressBookings;
    private long completedBookings;
    private long cancelledBookings;

    // ── Revenue ──────────────────────────────────────────────────
    private double totalRevenue;

    // ── Category breakdown: { category -> count } ────────────────
    private Map<String, Long> categoryBreakdown;

    // ── Monthly trend: { "2025-01" -> count } ────────────────────
    private Map<String, Long> monthlyTrend;

    // ── Top providers ────────────────────────────────────────────
    private List<ProviderStat> topProviders;

    // ── Recent bookings (last 10) ────────────────────────────────
    private List<RecentBooking> recentBookings;

    @Data
    @Builder
    public static class ProviderStat {
        private String providerId;
        private String providerName;
        private long completedBookings;
        private double totalEarnings;
    }

    @Data
    @Builder
    public static class RecentBooking {
        private String id;
        private String serviceTitle;
        private String customerName;
        private String providerName;
        private String status;
        private double price;
        private String createdAt;
    }
}
