package com.example.serviceplatform.service;

import com.example.serviceplatform.entity.ProviderProfile;
import com.example.serviceplatform.repository.ProviderProfileRepository;
import com.example.serviceplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;

    public ProviderProfile getOrCreateProfile(String userId) {
        return providerProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ProviderProfile profile = ProviderProfile.builder()
                            .userId(userId)
                            .rating(0.0)
                            .totalReviews(0)
                            .build();
                    return providerProfileRepository.save(profile);
                });
    }

    public ProviderProfile updateProfile(String userId, ProviderProfile updated) {
        ProviderProfile profile = getOrCreateProfile(userId);
        profile.setFullName(updated.getFullName());
        profile.setBio(updated.getBio());
        profile.setPhone(updated.getPhone());
        profile.setAddress(updated.getAddress());
        profile.setSpecialities(updated.getSpecialities());
        profile.setProfileImageUrl(updated.getProfileImageUrl());
        return providerProfileRepository.save(profile);
    }

    public ProviderProfile getByUserId(String userId) {
        return providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }
}