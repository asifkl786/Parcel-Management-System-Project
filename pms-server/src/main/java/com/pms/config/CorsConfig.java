//package com.pms.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.filter.CorsFilter;
//import java.util.Arrays;
//import java.util.List;
//
//@Configuration
//public class CorsConfig {
//
//    // List of allowed frontend origins
//    private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
//        "http://localhost:5173",  // Default Vite port
//        "http://localhost:5174",  // Alternative port
//        "http://localhost:3000"   // Common React port
//    );
//
//    // List of allowed HTTP methods
//    private static final List<String> ALLOWED_METHODS = Arrays.asList(
//        "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
//    );
//
//    // List of allowed headers
//    private static final List<String> ALLOWED_HEADERS = Arrays.asList(
//        "Authorization",
//        "Content-Type",
//        "Accept",
//        "X-Requested-With",
//        "Cache-Control",
//        "Origin",
//        "Access-Control-Request-Method",
//        "Access-Control-Request-Headers"
//    );
//
//    // Headers to expose to the client
//    private static final List<String> EXPOSED_HEADERS = Arrays.asList(
//        "Access-Control-Allow-Origin",
//        "Access-Control-Allow-Credentials",
//        "Content-Disposition"  // Important for file downloads
//    );
//
//    @Bean
//    public CorsFilter corsFilter() {
//        CorsConfiguration configuration = new CorsConfiguration();
//
//        // Apply settings
//        configuration.setAllowedOrigins(ALLOWED_ORIGINS);
//        configuration.setAllowedMethods(ALLOWED_METHODS);
//        configuration.setAllowedHeaders(ALLOWED_HEADERS);
//        configuration.setExposedHeaders(EXPOSED_HEADERS);
//        
//        // Enable credentials support
//        configuration.setAllowCredentials(true);
//        
//        // Set max age for preflight requests
//        configuration.setMaxAge(3600L);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        
//        // Apply to all endpoints
//        source.registerCorsConfiguration("/**", configuration);
//        
//        return new CorsFilter(source);
//    }
//}
//
//
////package com.pms.config;
////
////import org.springframework.context.annotation.Bean;
////import org.springframework.context.annotation.Configuration;
////import org.springframework.web.cors.CorsConfiguration;
////import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
////import org.springframework.web.filter.CorsFilter;
////import java.util.Arrays;
////
////@Configuration
////public class CorsConfig {
////
////    @Bean
////    public CorsFilter corsFilter() {
////        CorsConfiguration configuration = new CorsConfiguration();
////        
////        configuration.setAllowedOrigins(Arrays.asList(
////            "http://localhost:5174",
////            "http://localhost:5173"
////        ));
////        
////        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
////        
////        // Important headers to allow
////        configuration.setAllowedHeaders(Arrays.asList(
////            "Authorization", 
////            "Content-Type",
////            "Accept",
////            "X-Requested-With",
////            "Cache-Control"
////        ));
////        
////        // For preflight requests
////        configuration.setExposedHeaders(Arrays.asList(
////            "Access-Control-Allow-Origin",
////            "Access-Control-Allow-Credentials"
////        ));
////        
////        configuration.setAllowCredentials(true);
////        configuration.setMaxAge(3600L); // 1 hour cache for preflight
////
////        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
////        source.registerCorsConfiguration("/**", configuration);
////        
////        return new CorsFilter(source);
////    }
////}