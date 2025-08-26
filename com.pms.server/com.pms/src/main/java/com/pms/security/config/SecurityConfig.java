package com.pms.security.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.pms.parcelServiceImple.CustomUserDetailsService;
import com.pms.security.jwt.JwtAuthFilter;



@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors().and()
            .csrf(AbstractHttpConfigurer::disable)
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())) // 👈 This is important
            .authorizeHttpRequests(auth -> auth
            		
            	// Public endpoints
                .requestMatchers("/api/auth/*").permitAll()
                
                .requestMatchers("/api/parcels/*/report").permitAll() // ✅ ADD THIS LINE
                .requestMatchers(HttpMethod.GET, "/api/parcels/image/**").permitAll()
                
             // ADMIN-only endpoints (using specific HTTP methods)
                .requestMatchers(HttpMethod.POST, "/api/parcels").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/parcels/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/parcels/*/update").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/parcels/*").hasRole("ADMIN")
                //.requestMatchers(HttpMethod.GET, "/api/parcels/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/parcels/image/**").hasRole("ADMIN")
                
                .requestMatchers(HttpMethod.GET, "/api/reports/*").hasRole("ADMIN")

                // Shared read endpoints
                .requestMatchers(HttpMethod.GET, "/api/parcels").hasAnyRole("ADMIN", "USER")
                .requestMatchers(HttpMethod.GET, "/api/parcels/**").hasAnyRole("ADMIN", "USER")
              //  .requestMatchers(HttpMethod.GET, "/api/parcels/*").hasAnyRole("ADMIN", "USER")


                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    } 

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
