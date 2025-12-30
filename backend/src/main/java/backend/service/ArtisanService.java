package backend.service;

import backend.entities.Artisan;
import backend.entities.Role;
import backend.entities.Status;
import backend.entities.User;
import backend.repositories.ArtisanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ArtisanService {

    private final ArtisanRepository artisanRepository;

    public ArtisanService(ArtisanRepository artisanRepository) {
        this.artisanRepository = artisanRepository;
    }

    public List<Artisan> getAllArtisans() {
    return artisanRepository.findAll();
}
    public List<Artisan> getAllActiveArtisans() {
        return artisanRepository.findByStatus(Status.ACTIVE);
    }

    public List<Artisan> getPendingArtisans() {
        return artisanRepository.findByStatus(Status.PENDING);
    }
    public List<Artisan> getArtisansForDashboard(User currentUser) {
    if (currentUser.getRole() == Role.ADMIN) {
        return artisanRepository.findAll(); // L'admin voit tout
    }
    // Le guide voit : TOUT ce qui est ACTIVE + ses propres PENDING
    // Note : Il faudra ajouter 'proposedBy' dans votre entité Artisan pour filtrer
    return artisanRepository.findByStatus(Status.ACTIVE); 
}

   @Transactional
public Artisan createArtisan(Artisan artisan, User currentUser) {
    if (currentUser.getRole() == Role.ADMIN) {
        artisan.setStatus(Status.ACTIVE);
    } else {
        artisan.setStatus(Status.PENDING);
    }
    
    // AJOUT : Lier l'utilisateur connecté à l'artisan
    artisan.setProposedBy(currentUser); 
    
    return artisanRepository.save(artisan);
}
  // backend/service/ArtisanService.java
@Transactional
public Artisan updateArtisan(Long id, Artisan details, User currentUser) {
    Artisan artisan = artisanRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));

    boolean isAdmin = currentUser.getRole() == Role.ADMIN;
    // On ajoute une sécurité pour éviter le NullPointerException et autoriser l'admin
    boolean isOwner = artisan.getProposedBy() != null && 
                      artisan.getProposedBy().getId().equals(currentUser.getId());

    if (!isAdmin && !isOwner) {
        throw new RuntimeException("Non autorisé à modifier cet artisan");
    }

    artisan.setName(details.getName());
    artisan.setSpeciality(details.getSpeciality());
    artisan.setPhone(details.getPhone());
    artisan.setCity(details.getCity());

    if (!isAdmin) {
        artisan.setStatus(Status.PENDING);
    }

    return artisanRepository.save(artisan);
}

    @Transactional
    public Artisan validateArtisan(Long id) {
        Artisan artisan = artisanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));
        artisan.setStatus(Status.ACTIVE);
        return artisanRepository.save(artisan);
    }

    @Transactional
    public void deleteArtisan(Long id) {
        artisanRepository.deleteById(id);
    }
    
}