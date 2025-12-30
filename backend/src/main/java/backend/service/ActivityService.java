package backend.service;

import backend.entities.Activity;
import backend.entities.Guide;
import backend.entities.Place;
import backend.entities.Role;
import backend.entities.Status;
import backend.entities.User;
import backend.repositories.ActivityRepository;

import lombok.RequiredArgsConstructor;
import backend.repositories.GuideRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import backend.repositories.PlaceRepository;



@Service
//@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final GuideRepository guideRepository;
   private final PlaceRepository placeRepository; // AJOUTEZ CECI

    public ActivityService(ActivityRepository activityRepository, 
                           GuideRepository guideRepository, 
                           PlaceRepository placeRepository) {
        this.activityRepository = activityRepository;
        this.guideRepository = guideRepository;
        this.placeRepository = placeRepository;
    }
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    public Activity getActivityById(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activité non trouvée avec l'id: " + id));
    }

   public List<Activity> getActivitiesByPlace(Long placeId) {
    // On ne montre que les activités validées pour ce lieu
    return activityRepository.findByPlaceIdAndStatus(placeId, Status.ACTIVE);
}
    public List<Activity> getActivitiesByGuide(Long guideId) {
        return activityRepository.findByGuideId(guideId);
    }

    public List<Activity> getActivitiesByUserId(Long userId) {
    // Cette requête va chercher les activités où le guide possède le user_id fourni
    return activityRepository.findByGuideUserId(userId);
}

   // backend/service/ActivityService.java
@Transactional
public Activity createActivity(Activity activity, User currentUser) {
    // 1. Si c'est un GUIDE, on doit impérativement lui associer son profil Guide
    if (currentUser.getRole() == Role.GUIDE) {
        Guide guide = guideRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Erreur : Votre profil de guide n'est pas encore créé ou activé."));
        activity.setGuide(guide);
        activity.setStatus(Status.PENDING);
    } 
    // 2. Si c'est un ADMIN, on valide direct et on ne cherche pas de profil guide
    else if (currentUser.getRole() == Role.ADMIN) {
        activity.setStatus(Status.ACTIVE);
        // Optionnel : activity.setGuide(null); 
    }

    // 3. Récupération propre du lieu
    if (activity.getPlace() != null && activity.getPlace().getId() != null) {
        Place place = placeRepository.findById(activity.getPlace().getId())
                .orElseThrow(() -> new RuntimeException("Lieu introuvable."));
        activity.setPlace(place);
    }

    return activityRepository.save(activity);
}

    public List<Activity> getAllActiveActivities() {
    return activityRepository.findByStatus(Status.ACTIVE);
    }
    public List<Activity> getAllPendingActivities() {
    return activityRepository.findByStatus(Status.PENDING);
    }

    @Transactional

    public Activity updateActivity(Long id, Activity activityDetails) {
        Activity activity = getActivityById(id);

        activity.setTitle(activityDetails.getTitle());
        activity.setDescription(activityDetails.getDescription());
        activity.setPrice(activityDetails.getPrice());
        activity.setDuration(activityDetails.getDuration());
        activity.setPlace(activityDetails.getPlace());
        activity.setGuide(activityDetails.getGuide());

        return activityRepository.save(activity);
    }

    @Transactional
    public void deleteActivity(Long id) {
        Activity activity = getActivityById(id);
        activityRepository.delete(activity);
    }

    @Transactional
public Activity validateActivity(Long id) {
    Activity activity = getActivityById(id);
    activity.setStatus(Status.ACTIVE);
    return activityRepository.save(activity);
}
}