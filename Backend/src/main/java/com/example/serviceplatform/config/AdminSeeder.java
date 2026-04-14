package com.example.serviceplatform.config;

import com.example.serviceplatform.entity.Role;
import com.example.serviceplatform.entity.User;
import com.example.serviceplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedAdmin() {
        return args -> {
            String adminEmail = "admin@nexserve.com";

            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = User.builder()
                        .fullName("NexServe Admin")
                        .email(adminEmail)
                        .password(passwordEncoder.encode("Admin@123"))
                        .phone("0000000000")
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin);
                System.out.println("✅ Admin user created: " + adminEmail);
            } else {
                System.out.println("ℹ️ Admin user already exists: " + adminEmail);
            }
        };
    }
}
