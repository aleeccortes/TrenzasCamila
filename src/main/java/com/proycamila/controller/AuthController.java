package com.proycamila.controller;

import com.proycamila.dto.PasswordChangeRequest;
import com.proycamila.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AdminUserService service;
    public AuthController(AdminUserService service) { this.service = service; }

    @GetMapping("/csrf") public Map<String, String> csrf(CsrfToken token) {
        return Map.of("headerName", token.getHeaderName(), "token", token.getToken());
    }
    @GetMapping("/me") public Map<String, Object> me(Authentication authentication) {
        return Map.of("authenticated", true, "username", authentication.getName());
    }
    @PutMapping("/password") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cambiar(@Valid @RequestBody PasswordChangeRequest request, Authentication authentication) {
        service.cambiarPassword(authentication.getName(), request);
    }
}
