package backend.service;

import backend.entities.Role;
import backend.entities.User;
import backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
//@RequiredArgsConstructor
public class GuideService {

    private final UserRepository userRepository;
    private final AuthService authService; // Inject AuthService
    public GuideService(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }
    @Transactional(readOnly = true)
    public User getGuideProfile(String email) {
        User guide = authService.getUserByEmail(email);
        if (guide.getRole() != Role.GUIDE) {
            throw new RuntimeException("User is not a guide");
        }
        return guide;
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