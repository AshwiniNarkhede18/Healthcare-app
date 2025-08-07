package com.healthcare.appointment.config;

import java.security.Principal;

public class WebSocketPrincipal implements Principal {

    private final String name;
    private final String role;

    public WebSocketPrincipal(String name, String role) {
        this.name = name;
        this.role = role;
    }

    @Override
    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }
}
