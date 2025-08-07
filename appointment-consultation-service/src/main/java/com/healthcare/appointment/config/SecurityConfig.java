package com.healthcare.appointment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.healthcare.appointment.security.JwtAuthFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> {}) // ✅ Enable CORS
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/ws/**").permitAll() // ✅ Allow WebSocket
                .requestMatchers("/api/prescriptions/submit", "/api/video/**")
                    .hasAuthority("ROLE_DOCTOR")
                .requestMatchers(
                    "/api/appointments/**",
                    "/api/timeslots/**",
                    "/api/prescriptions/**",
                    "/api/chats/**"
                ).authenticated()
                .anyRequest().permitAll()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint()))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        var configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.addAllowedOrigin("*"); // or set specific frontend domain
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        var source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return new Http403ForbiddenEntryPoint();
    }
}
