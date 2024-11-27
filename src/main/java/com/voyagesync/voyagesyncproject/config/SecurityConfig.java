package com.voyagesync.voyagesyncproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity() // Enables @PreAuthorize and @PostAuthorize
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for development; enable in production
                .csrf(AbstractHttpConfigurer::disable)

                // Configure endpoint security
                .authorizeHttpRequests(auth -> auth
                        // Open access to specific endpoints
                        .requestMatchers("/api/users/login").permitAll()
                        .requestMatchers("/api/service-availability/**").permitAll()
                        .requestMatchers("/api/vendors/feedback/new").permitAll()

                        // Restrict access to other endpoints based on roles
                        .requestMatchers("/api/service/**").hasRole("VENDOR")

                        // Authenticate all other requests
                        .anyRequest().authenticated()
                )

                // Use HTTP Basic Authentication
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}

