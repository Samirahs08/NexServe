package com.example.serviceplatform.service;

import com.example.serviceplatform.entity.Booking;
import com.example.serviceplatform.entity.ServiceListing;
import com.example.serviceplatform.entity.User;
import com.example.serviceplatform.repository.BookingRepository;
import com.example.serviceplatform.repository.ServiceListingRepository;
import com.example.serviceplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceListingRepository serviceListingRepository;
    private final UserRepository userRepository;

    public Booking createBooking(Booking booking, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServiceListing service = serviceListingRepository.findById(booking.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        booking.setCustomerId(customer.getId());
        booking.setCustomerName(customer.getFullName());
        booking.setCustomerEmail(customer.getEmail());
        booking.setCustomerPhone(customer.getPhone());
        booking.setServiceTitle(service.getTitle());
        booking.setProviderId(service.getProviderId());
        booking.setProviderName(service.getProviderName());
        booking.setPrice(service.getPrice());
        booking.setStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByCustomer(String email) {
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId());
    }

    public List<Booking> getBookingsByProvider(String email) {
        User provider = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(provider.getId());
    }

    public Booking updateStatus(String bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    public Booking getById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}
