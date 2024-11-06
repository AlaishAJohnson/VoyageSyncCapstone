package com.voyagesync.voyagesyncproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Enables @PreAuthorize annotations
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disables CSRF; only do this if necessary
                // ^^ to expand on this:
                // disable CSRF since our application probably won't rely on cookies for authentication
                // and our endpoints are mostly accessed by like mobile apps rather than browsers.
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/service/**").hasRole("VENDOR") // Restrict /api/service endpoints to VENDOR role
                        .requestMatchers("/api/service-availability/**").permitAll()
                        .anyRequest().authenticated() // Requires authentication for all other requests
                )
                .httpBasic(Customizer.withDefaults()); // Use HTTP Basic authentication; consider form login or JWT in production

        return http.build();
    }
}
