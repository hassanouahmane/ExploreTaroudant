package backend.service;

import static java.lang.Math.log;

import backend.dto.AuthResponse;
import backend.dto.LoginRequest;
import backend.dto.RegisterRequest;
import backend.entities.Guide;
import backend.entities.Role;
import backend.entities.User;
import backend.entities.Status;
import backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import backend.repositories.GuideRepository;

import backend.exception.EmailAlreadyExistsException;

@Service
@Slf4j  
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final GuideRepository guideRepository;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                       JwtService jwtService, AuthenticationManager authenticationManager, GuideRepository guideRepository) {
        this.guideRepository = guideRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }
 @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Cet email est déjà utilisé");
        }

        // 1. D'ABORD : Créer et initialiser l'objet User
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());

        Role role = Role.TOURIST;
        try {
            if (request.getRole() != null) {
                role = Role.valueOf(request.getRole().toUpperCase());
            }
        } catch (IllegalArgumentException e) {
            // Log si nécessaire, sinon on garde TOURIST par défaut
        }
        user.setRole(role);

        if (role == Role.GUIDE){
            user.setStatus(Status.PENDING);
        } else {
            user.setStatus(Status.ACTIVE);
        }

        // 2. ENSUITE : Sauvegarder l'utilisateur (maintenant 'user' existe)
        User savedUser = userRepository.save(user);
        
        Guide savedGuide = null; 

        if (savedUser.getRole() == Role.GUIDE) {
            Guide guideProfile = new Guide();
            guideProfile.setUser(savedUser);
            // On utilise les valeurs du request si elles existent, sinon valeurs par défaut
            guideProfile.setBio(request.getBio() != null ? request.getBio() : "Nouveau guide à Taroudant");
            guideProfile.setLanguages(request.getLanguages() != null ? request.getLanguages() : "À préciser");
            
            savedGuide = guideRepository.save(guideProfile);
        }

        String jwtToken = (savedUser.getStatus() == Status.ACTIVE) ? jwtService.generateToken(savedUser) : null;

        // RETOUR INTELLIGENT
        if (savedUser.getRole() == Role.GUIDE) {
            return new AuthResponse(
                jwtToken,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedGuide 
            );
        } else {
            return new AuthResponse(
                jwtToken,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
            );
        }
    }
@Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // ... (authentification inchangée) ...
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        // ... (vérification status inchangée) ...

        String jwtToken = jwtService.generateToken(user);

        // RETOUR INTELLIGENT
        if (user.getRole() == Role.GUIDE) {
            // On va chercher le guide associé
            Guide guide = guideRepository.findByUserId(user.getId()).orElse(null);
            
            return new AuthResponse(
                jwtToken,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                guide // <--- Le guide récupéré
            );
        } else {
            return new AuthResponse(
                jwtToken,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
            );
        }
    }
    @Transactional(readOnly = true)
    public User getCurrentUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

  // Dans backend/service/AuthService.java

  @Transactional
    public User updateProfile(Long userId, RegisterRequest request) {
        User user = getCurrentUser(userId);

        // 1. Mise à jour des infos communes (User)
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        
        // Vérification email
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }
        user.setEmail(request.getEmail());

        // Mot de passe
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // 2. LOGIQUE GUIDE
        if (user.getRole() == Role.GUIDE) {
            
            // Récupérer ou Créer le Guide associé
            Guide guide = guideRepository.findByUserId(user.getId())
                    .orElseGet(() -> {
                        Guide newGuide = new Guide();
                        newGuide.setUser(user);
                        return newGuide;
                    });

            if (request.getBio() != null) {
                guide.setBio(request.getBio());
            }
            if (request.getLanguages() != null) {
                guide.setLanguages(request.getLanguages());
            }
            
            guideRepository.save(guide);
            
        }

        return userRepository.save(user);
    }
}