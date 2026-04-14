package com.example.serviceplatform.controller;

import com.example.serviceplatform.entity.PerformancePost;
import com.example.serviceplatform.service.PerformancePostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PerformancePostController {

    private final PerformancePostService performancePostService;

    @PostMapping
    public ResponseEntity<PerformancePost> create(@RequestBody PerformancePost post) {
        return ResponseEntity.ok(performancePostService.createPost(post));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<PerformancePost>> getByProvider(
            @PathVariable String providerId) {
        return ResponseEntity.ok(performancePostService.getPostsByProvider(providerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        performancePostService.deletePost(id);
        return ResponseEntity.ok().build();
    }
}
