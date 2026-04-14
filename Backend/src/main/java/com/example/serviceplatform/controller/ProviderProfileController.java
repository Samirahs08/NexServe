package com.example.serviceplatform.controller;

import com.example.serviceplatform.entity.ProviderProfile;
import com.example.serviceplatform.entity.User;
import com.example.serviceplatform.service.ProviderProfileService;
import com.example.serviceplatform.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProviderProfileController {

    private final ProviderProfileService providerProfileService;
    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<ProviderProfile> getProfile(@PathVariable String userId) {
        return ResponseEntity.ok(providerProfileService.getOrCreateProfile(userId));
    }

    @PutMapping
    public ResponseEntity<ProviderProfile> updateProfile(
            @RequestBody ProviderProfile profile,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(
            providerProfileService.updateProfile(user.getId(), profile));
    }
}
