package com.pms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ Allowed specific origins (Frontend URLs)
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:5174"
            // Future: add production domain like "https://your-frontend.com"
        ));

        // ✅ Allow credentials (Cookies / Authorization headers)
        configuration.setAllowCredentials(true);

        // ✅ Allowed HTTP Methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // ✅ Allowed Headers
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // ✅ Expose headers if needed (optional)
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        // ✅ Register the configuration for all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return new CorsFilter(source);
    }
}
