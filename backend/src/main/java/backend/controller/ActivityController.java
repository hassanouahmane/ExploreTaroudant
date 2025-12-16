package backend.controller;


import backend.entities.Activity;
import backend.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.getActivityById(id));
    }

    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<Activity>> getActivitiesByPlace(@PathVariable Long placeId) {
        return ResponseEntity.ok(activityService.getActivitiesByPlace(placeId));
    }

    @GetMapping("/guide/{guideId}")
    public ResponseEntity<List<Activity>> getActivitiesByGuide(@PathVariable Long guideId) {
        return ResponseEntity.ok(activityService.getActivitiesByGuide(guideId));
    }

    @PostMapping
    public ResponseEntity<Activity> createActivity(@RequestBody Activity activity) {
        return ResponseEntity.ok(activityService.createActivity(activity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(
            @PathVariable Long id,
            @RequestBody Activity activity) {
        return ResponseEntity.ok(activityService.updateActivity(id, activity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }
}



