package backend.service;

import backend.dto.AuthResponse;
import backend.dto.LoginRequest;
import backend.dto.RegisterRequest;
import backend.entities.User;
import backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional  // ✅ Au niveau de la méthode
    public AuthResponse register(RegisterRequest request) {
        System.out.println("=== REGISTER DEBUG ===");
        System.out.println("FullName: " + request.getFullName());
        System.out.println("Email: " + request.getEmail());
        System.out.println("Phone: " + request.getPhone());
        System.out.println("Role: " + request.getRole());

        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            System.err.println("❌ Email déjà utilisé");
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        // Créer le nouvel utilisateur
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());

        // Utiliser le rôle du request
        try {
            user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            System.err.println("⚠️ Rôle invalide: " + request.getRole() + ", utilisation de TOURIST");
            user.setRole(User.Role.TOURIST);
        }

        user.setStatus(User.Status.ACTIVE);

        System.out.println("User avant save: " + user);

        // ✅ SOLUTION 1: Utiliser saveAndFlush pour forcer le commit immédiat
        User savedUser = userRepository.saveAndFlush(user);

        System.out.println("✅ User sauvegardé avec ID: " + savedUser.getId());

        // ✅ Vérification immédiate
        boolean exists = userRepository.existsById(savedUser.getId());
        System.out.println("✅ User existe dans la BDD : " + exists);

        // ✅ Vérification par email
        User verification = userRepository.findByEmail(savedUser.getEmail()).orElse(null);
        System.out.println("✅ Vérification par email : " + (verification != null ? "TROUVÉ" : "NON TROUVÉ"));

        System.out.println("=== FIN REGISTER ===");

        // Générer un token
        String token = "mock-jwt-token-" + savedUser.getId();

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        System.out.println("=== LOGIN DEBUG ===");
        System.out.println("Email: " + request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.err.println("❌ Utilisateur non trouvé");
                    return new RuntimeException("Email ou mot de passe incorrect");
                });

        System.out.println("User trouvé: " + user.getFullName());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.err.println("❌ Mot de passe incorrect");
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        if (user.getStatus() != User.Status.ACTIVE) {
            System.err.println("❌ Compte suspendu");
            throw new RuntimeException("Votre compte a été suspendu");
        }

        String token = "mock-jwt-token-" + user.getId();

        System.out.println("✅ Login réussi");
        System.out.println("=== FIN LOGIN ===");

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Transactional(readOnly = true)
    public User getCurrentUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    @Transactional
    public User updateProfile(Long userId, RegisterRequest request) {
        User user = getCurrentUser(userId);

        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRole() != null && !request.getRole().isEmpty()) {
            try {
                user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                System.err.println("⚠️ Rôle invalide ignoré: " + request.getRole());
            }
        }

        return userRepository.saveAndFlush(user);
    }
}