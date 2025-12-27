package backend.service;

import backend.entities.Artisan;
import backend.entities.Status;
import backend.entities.User;
import backend.entities.Role;
import backend.repositories.ArtisanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ArtisanService {

    private final ArtisanRepository artisanRepository;

    public ArtisanService(ArtisanRepository artisanRepository) {
        this.artisanRepository = artisanRepository;
    }

    public List<Artisan> getAllActiveArtisans() {
        return artisanRepository.findByStatus(Status.ACTIVE);
    }

    public List<Artisan> getPendingArtisans() {
        return artisanRepository.findByStatus(Status.PENDING);
    }

    @Transactional
    public Artisan createArtisan(Artisan artisan, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            artisan.setStatus(Status.ACTIVE);
        } else {
            artisan.setStatus(Status.PENDING);
        }
        artisan.setProposedBy(currentUser);
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