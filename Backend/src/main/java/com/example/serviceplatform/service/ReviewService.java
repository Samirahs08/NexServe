package com.example.serviceplatform.service;

import com.example.serviceplatform.entity.Review;
import com.example.serviceplatform.entity.ProviderProfile;
import com.example.serviceplatform.repository.ReviewRepository;
import com.example.serviceplatform.repository.ProviderProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProviderProfileRepository providerProfileRepository;

    public Review addReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        Review saved = reviewRepository.save(review);

        // Update provider rating
        List<Review> allReviews = reviewRepository.findByProviderId(review.getProviderId());
        double avgRating = allReviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        providerProfileRepository.findByUserId(review.getProviderId())
                .ifPresent(profile -> {
                    profile.setRating(avgRating);
                    profile.setTotalReviews(allReviews.size());
                    providerProfileRepository.save(profile);
                });

        return saved;
    }

    public List<Review> getReviewsByProvider(String providerId) {
        return reviewRepository.findByProviderId(providerId);
    }
}