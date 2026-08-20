package com.proycamila.model;

import jakarta.persistence.*;

@Entity
@Table(name = "admin_users")
public class AdminUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true, length = 50) private String username;
    @Column(nullable = false, length = 100) private String password;
    @Column(nullable = false, length = 20) private String role;

    protected AdminUser() {}
    public AdminUser(String username, String password, String role) {
        this.username = username; this.password = password; this.role = role;
    }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
    public void setPassword(String password) { this.password = password; }
}
