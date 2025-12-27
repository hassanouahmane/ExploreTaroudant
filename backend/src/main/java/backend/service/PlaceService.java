package backend.service;
import java.util.stream.Collectors;
import backend.entities.Status;
import backend.entities.User;
import backend.entities.Role;
import backend.entities.Place;
import backend.repositories.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
//@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceService {

    private final PlaceRepository placeRepository;
    
    public PlaceService(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    public Place getPlaceById(Long id) {
        return placeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lieu non trouvé avec l'id: " + id));
    }

    public List<Place> getPendingPlaces() {
        return placeRepository.findByStatus(Status.PENDING);
    }
    public List<Place> searchPlaces(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllPlaces();
        }

        List<Place> placesByName = placeRepository.findByNameContainingIgnoreCase(query);
        List<Place> placesByCity = placeRepository.findByCityContainingIgnoreCase(query);

        placesByName.addAll(placesByCity);
        return placesByName.stream().distinct().collect(Collectors.toList());
    }

    public List<Place> getPlacesByCity(String city) {
        return placeRepository.findByCityContainingIgnoreCase(city);
    }

    @Transactional
    public Place createPlace(Place place, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            place.setStatus(Status.ACTIVE); // L'admin ajoute directement
        } else {
            place.setStatus(Status.PENDING); // Le guide propose, l'admin devra valider
        }
        place.setProposedBy(currentUser);
        return placeRepository.save(place);
    }

    @Transactional
    public Place updatePlace(Long id, Place placeDetails) {
        Place place = getPlaceById(id);

        place.setName(placeDetails.getName());
        place.setDescription(placeDetails.getDescription());
        place.setCity(placeDetails.getCity());
        place.setLatitude(placeDetails.getLatitude());
        place.setLongitude(placeDetails.getLongitude());
        place.setImageUrl(placeDetails.getImageUrl());

        return placeRepository.save(place);
    }

    @Transactional
    public void deletePlace(Long id) {
        Place place = getPlaceById(id);
        placeRepository.delete(place);
    }
    public List<Place> getAllActivePlaces() {
        return placeRepository.findByStatus(Status.ACTIVE);
    }

    @Transactional
    public Place validatePlace(Long id) {
        Place place = getPlaceById(id);
        place.setStatus(Status.ACTIVE);
        return placeRepository.save(place);
    }

}