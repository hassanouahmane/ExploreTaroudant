package backend.service;

import backend.entities.Activity;
import backend.repositories.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;



@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActivityService {

    private final ActivityRepository activityRepository;

    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    public Activity getActivityById(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activité non trouvée avec l'id: " + id));
    }

    public List<Activity> getActivitiesByPlace(Long placeId) {
        return activityRepository.findByPlaceId(placeId);
    }

    public List<Activity> getActivitiesByGuide(Long guideId) {
        return activityRepository.findByGuideId(guideId);
    }

    @Transactional
    public Activity createActivity(Activity activity) {
        return activityRepository.save(activity);
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
}