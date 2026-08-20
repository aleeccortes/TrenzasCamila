package com.proycamila.service;

import com.proycamila.dto.PasswordChangeRequest;
import com.proycamila.exception.BusinessException;
import com.proycamila.model.AdminUser;
import com.proycamila.repository.AdminUserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminUserService implements UserDetailsService {
    private final AdminUserRepository repository;
    private final PasswordEncoder encoder;

    public AdminUserService(AdminUserRepository repository, PasswordEncoder encoder) {
        this.repository = repository; this.encoder = encoder;
    }

    @Override @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminUser admin = repository.findByUsernameIgnoreCase(username.trim())
                .orElseThrow(() -> new UsernameNotFoundException("Credenciales invalidas"));
        return User.withUsername(admin.getUsername()).password(admin.getPassword()).roles(admin.getRole()).build();
    }

    @Transactional
    public void cambiarPassword(String username, PasswordChangeRequest request) {
        AdminUser admin = repository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        if (!encoder.matches(request.actual(), admin.getPassword())) {
            throw new BusinessException("La contrasenia actual no es correcta");
        }
        validarFortaleza(request.nueva(), username);
        if (encoder.matches(request.nueva(), admin.getPassword())) {
            throw new BusinessException("La nueva contrasenia debe ser diferente de la actual");
        }
        admin.setPassword(encoder.encode(request.nueva()));
    }

    private void validarFortaleza(String password, String username) {
        if (password.toLowerCase().contains(username.toLowerCase()) ||
                !password.matches(".*[A-Z].*") || !password.matches(".*[a-z].*") ||
                !password.matches(".*\\d.*") || !password.matches(".*[^A-Za-z0-9].*")) {
            throw new BusinessException("Usa mayuscula, minuscula, numero y simbolo; no incluyas el usuario");
        }
    }
}
