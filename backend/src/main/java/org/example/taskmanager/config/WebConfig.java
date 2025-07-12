package org.example.taskmanager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:3000", "http://192.168.1.3:3000")// or your frontend URL
                .allowedMethods("*")
                .allowCredentials(true)
                .allowedHeaders("*");
    }
}
