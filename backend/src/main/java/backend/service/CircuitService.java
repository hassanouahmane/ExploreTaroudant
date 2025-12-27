package backend.service;

import backend.entities.Circuit;
import backend.entities.Guide;
import backend.entities.Role;
import backend.entities.User;
import backend.entities.Status;
import backend.repositories.CircuitRepository;
import backend.repositories.GuideRepository;
import backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
//@RequiredArgsConstructor
public class CircuitService {

    private final CircuitRepository circuitRepository;
    private final GuideRepository guideRepository; // To fetch Guide entity
    public CircuitService(CircuitRepository circuitRepository, GuideRepository guideRepository) {
        this.circuitRepository = circuitRepository;
        this.guideRepository = guideRepository;
    }
    @Transactional
    public Circuit createCircuit(Circuit circuit, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            circuit.setStatus(Status.ACTIVE);
        } else {
            Guide guide = guideRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Profil Guide non trouvé"));
            circuit.setGuide(guide);
            circuit.setStatus(Status.PENDING);
        }
        return circuitRepository.save(circuit);
    }

    public List<Circuit> getActiveCircuits() {
        return circuitRepository.findByStatus(Status.ACTIVE);
    }

    public List<Circuit> getPendingCircuits() {
        return circuitRepository.findByStatus(Status.PENDING);
    }

    @Transactional(readOnly = true)
    public List<Circuit> getAllCircuits() {
        return circuitRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Circuit> getCircuitById(Long id) {
        return circuitRepository.findById(id);
    }

    @Transactional
    public Circuit validateCircuit(Long id) {
        Circuit circuit = circuitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit non trouvé"));
        circuit.setStatus(Status.ACTIVE);
        return circuitRepository.save(circuit);
    }

   public List<Circuit> getCircuitsByGuide(User currentUser) {
        Guide guide = guideRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Profil Guide non trouvé"));
        return circuitRepository.findByGuide(guide);
    }

   @Transactional
    public Circuit updateCircuit(Long id, Circuit updatedCircuit, User currentUser) {
        Circuit existingCircuit = circuitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit non trouvé"));

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isOwner = existingCircuit.getGuide() != null && 
                          existingCircuit.getGuide().getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier ce circuit");
        }

        existingCircuit.setTitle(updatedCircuit.getTitle());
        existingCircuit.setDescription(updatedCircuit.getDescription());
        existingCircuit.setDuration(updatedCircuit.getDuration());
        existingCircuit.setPrice(updatedCircuit.getPrice());
        
        if (!isAdmin) {
            existingCircuit.setStatus(Status.PENDING);
        }else{
            existingCircuit.setStatus(Status.ACTIVE);
        }

        return circuitRepository.save(existingCircuit);
    }

    @Transactional
    public void deleteCircuit(Long id, User currentUser) {
        Circuit existingCircuit = circuitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit non trouvé"));

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isOwner = existingCircuit.getGuide() != null && 
                          existingCircuit.getGuide().getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer ce circuit");
        }

        circuitRepository.deleteById(id);
    }
}