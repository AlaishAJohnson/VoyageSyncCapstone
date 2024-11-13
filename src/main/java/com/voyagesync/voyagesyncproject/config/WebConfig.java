package com.voyagesync.voyagesyncproject.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://1daa-68-234-200-22.ngrok-free.app", "http://localhost:8080") // Corrected front end URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
