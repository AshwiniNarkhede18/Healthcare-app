package com.healthcare.appointment.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.healthcare.appointment.security.JwtService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class WebSocketSecurityConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
                List<String> authHeader = accessor.getNativeHeader("Authorization");

                if (authHeader != null && !authHeader.isEmpty()) {
                    String token = authHeader.get(0).replace("Bearer ", "");
                    if (jwtService.isTokenValid(token)) {
                        String username = jwtService.extractUsername(token);
                        String role = jwtService.extractRole(token);
                        accessor.setUser(new WebSocketPrincipal(username, role));
                    }
                }

                return message;
            }
        });
    }
}
