package backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Le nom complet est obligatoire")
    private String fullName;

    @NotBlank(message = "Email est obligatoire")
    @Email(message = "Email invalide")
    private String email;

    @NotBlank(message = "Mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;

    private String phone;
    private String role;
    
    // --- CES CHAMPS SONT OBLIGATOIRES POUR QUE LA SAUVEGARDE FONCTIONNE ---
    private String bio;
    private String languages;

    // --- CONSTRUCTEURS ---

    public RegisterRequest() {
    }

    public RegisterRequest(String fullName, String email, String password, String phone, String role, String bio, String languages) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.bio = bio;
        this.languages = languages;
    }

    // --- GETTERS ET SETTERS (Indispensables) ---

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    // GETTERS/SETTERS POUR BIO ET LANGUAGES
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }
}