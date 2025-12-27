package backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.entities.Role;
import backend.entities.Status;
import backend.entities.User;
import backend.repositories.UserRepository;

@Service
public class AdminService {
    
    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Récupérer tous les guides
    @Transactional(readOnly = true)
    public List<User> getAllGuides() {
        return userRepository.findByRole(Role.GUIDE);
    }
      // Récupérer tous les TOURIST
    @Transactional(readOnly = true)
    public List<User> getAllTourists() {
        return userRepository.findByRole(Role.TOURIST);
    }
    // Récupérer tous les useres
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Changer le statut d'un guide (Activer/Suspendre)
    @Transactional
    public User updateGuideStatus(Long id, Status status) {
        User user = userRepository.findById(id).orElseThrow(()
                -> new RuntimeException("Utilisateur non trouvé avec l'id: " + id));
        
        if (user.getRole() != Role.GUIDE) {
            throw new RuntimeException("L'utilisateur avec l'id: " + id + " n'est pas un guide");
        }
        
        user.setStatus(status);
        return userRepository.save(user);
    }

    // Supprimer spécifiquement un guide
    @Transactional
    public void deleteGuide(Long id) {
        User user = userRepository.findById(id).orElseThrow(()
                -> new RuntimeException("Utilisateur non trouvé avec l'id: " + id));
        
        if (user.getRole() != Role.GUIDE) {
            throw new RuntimeException("L'utilisateur n'est pas un guide");
        }
        userRepository.deleteById(id);
    }

    // Supprimer un touriste (Votre nouvelle méthode)
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(()
                -> new RuntimeException("Utilisateur non trouvé avec l'id: " + id));
        
        if (user.getRole() != Role.TOURIST) {
            throw new RuntimeException("L'utilisateur n'est pas un touriste");
        }
        userRepository.deleteById(id);
    }

    // Statistiques globales pour l'Admin
    @Transactional(readOnly = true)
    public Map<String, Long> getUserStatistics() {
        Map<String, Long> stats = new HashMap<>();
        
        stats.put("totalUsers", userRepository.count());
        
        List<User> allGuides = userRepository.findByRole(Role.GUIDE);
        stats.put("totalGuides", (long) allGuides.size());
        
        stats.put("totalActiveGuides", allGuides.stream()
                .filter(g -> g.getStatus() == Status.ACTIVE).count());
        
        stats.put("totalSuspendedGuides", allGuides.stream()
                .filter(g -> g.getStatus() == Status.SUSPENDED).count());
        
        stats.put("totalTourists", (long) userRepository.findByRole(Role.TOURIST).size());
        
        return stats;
    }
}