package com.example.serviceplatform.service;

import com.example.serviceplatform.entity.PerformancePost;
import com.example.serviceplatform.repository.PerformancePostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformancePostService {

    private final PerformancePostRepository performancePostRepository;

    public PerformancePost createPost(PerformancePost post) {
        post.setCreatedAt(LocalDateTime.now());
        return performancePostRepository.save(post);
    }

    public List<PerformancePost> getPostsByProvider(String providerId) {
        return performancePostRepository.findByProviderIdOrderByCreatedAtDesc(providerId);
    }

    public void deletePost(String postId) {
        performancePostRepository.deleteById(postId);
    }
}