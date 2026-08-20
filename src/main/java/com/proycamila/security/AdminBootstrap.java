package com.proycamila.security;

import com.proycamila.model.AdminUser;
import com.proycamila.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrap implements CommandLineRunner {
    private final AdminUserRepository repository;
    private final PasswordEncoder encoder;
    private final String username;
    private final String password;

    public AdminBootstrap(AdminUserRepository repository, PasswordEncoder encoder,
            @Value("${app.admin.username}") String username, @Value("${app.admin.password}") String password) {
        this.repository = repository; this.encoder = encoder; this.username = username; this.password = password;
    }

    @Override public void run(String... args) {
        if (!repository.existsByUsernameIgnoreCase(username)) {
            if (!username.matches("[A-Za-z0-9._-]{3,50}")) {
                throw new IllegalStateException("ADMIN_USERNAME debe tener entre 3 y 50 caracteres validos");
            }
            if (password.length() < 12 || !password.matches(".*[A-Z].*") ||
                    !password.matches(".*[a-z].*") || !password.matches(".*\\d.*") ||
                    !password.matches(".*[^A-Za-z0-9].*")) {
                throw new IllegalStateException("Define ADMIN_PASSWORD con al menos 12 caracteres, mayuscula, minuscula, numero y simbolo");
            }
            repository.save(new AdminUser(username, encoder.encode(password), "ADMIN"));
        }
    }
}
