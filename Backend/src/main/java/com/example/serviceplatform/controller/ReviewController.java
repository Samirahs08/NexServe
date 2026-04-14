package com.example.serviceplatform.controller;

import com.example.serviceplatform.entity.Review;
import com.example.serviceplatform.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Review>> getByProvider(@PathVariable String providerId) {
        return ResponseEntity.ok(reviewService.getReviewsByProvider(providerId));
    }
}
