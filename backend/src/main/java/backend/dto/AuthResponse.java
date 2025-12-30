package backend.dto;

import backend.entities.Guide;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private String role;
    
    // Nouveau champ pour le Guide
    private Guide guide;

    // --- CONSTRUCTEURS ---

    // 1. Constructeur SANS Guide (Pour Tourist et Admin)
    public AuthResponse(String token, Long id, String fullName, String email, String role) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    // 2. Constructeur AVEC Guide (Pour les Guides)
    public AuthResponse(String token, Long id, String fullName, String email, String role, Guide guide) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.guide = guide;
    }

    // --- GETTERS ET SETTERS ---

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Guide getGuide() {
        return guide;
    }

    public void setGuide(Guide guide) {
        this.guide = guide;
    }
}