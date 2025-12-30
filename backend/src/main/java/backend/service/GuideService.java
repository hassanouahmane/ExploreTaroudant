package backend.service;

import backend.entities.Guide;
import backend.entities.Role;
import backend.entities.User;
import backend.service.AuthService;
import java.util.Map;
import backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import backend.repositories.GuideRepository;

@Service
//@RequiredArgsConstructor
public class GuideService {

    private final UserRepository userRepository;
    private final AuthService authService; // Inject AuthService
    private final GuideRepository guideRepository; // Inject GuideRepository

    public GuideService(UserRepository userRepository, AuthService authService, GuideRepository guideRepository) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.guideRepository = guideRepository;
    }
 

public User getGuideProfile(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
 
    return user;
}
@Transactional
public User updateTechnicalInfo(String email, Map<String, String> updates) {
    User user = userRepository.findByEmail(email).orElseThrow();
    // On récupère l'entité Guide liée
    Guide guide = guideRepository.findByUserId(user.getId()).orElseThrow();
    
    guide.setBio(updates.get("bio"));
    guide.setLanguages(updates.get("languages"));
    
    guideRepository.save(guide);
    return user;
}
    @Transactional
    public User updateGuideProfile(String email, User updatedGuide) {
        User existingGuide = authService.getUserByEmail(email);
        if (existingGuide.getRole() != Role.GUIDE) {
            throw new RuntimeException("User is not a guide");
        }

        // Only update allowed fields
        existingGuide.setFullName(updatedGuide.getFullName());
        existingGuide.setPhone(updatedGuide.getPhone());
        // Potentially add logic for updating other guide-specific fields if they exist in User or a separate Guide entity

        return userRepository.save(existingGuide);
    }
}