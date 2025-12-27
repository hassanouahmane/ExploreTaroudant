package backend.service;

import backend.entities.Activity;
import backend.entities.Role;
import backend.entities.Status;
import backend.entities.User;
import backend.repositories.ActivityRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;



@Service
//@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActivityService {

    private final ActivityRepository activityRepository;
    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
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

   @Transactional
    public Activity createActivity(Activity activity, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            activity.setStatus(Status.ACTIVE);
        } else {
            activity.setStatus(Status.PENDING);
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