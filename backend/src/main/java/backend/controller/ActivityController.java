package backend.controller;


import backend.entities.Activity;
import backend.entities.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import backend.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
//@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    // PUBLIC : Uniquement les activités validées
    @GetMapping
    public ResponseEntity<List<Activity>> getAllActiveActivities() {
        return ResponseEntity.ok(activityService.getAllActiveActivities());
    }

     @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Activity>> getAllForAdmin() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    // ADMIN : Liste de modération
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Activity>> getPendingActivities() {
        return ResponseEntity.ok(activityService.getAllPendingActivities());
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
@PreAuthorize("hasAnyRole('ADMIN', 'GUIDE')")
public ResponseEntity<Activity> createActivity(
        @RequestBody Activity activity, 
        @AuthenticationPrincipal User currentUser) {
    
    // Ajoutez un log ici pour voir si Spring entre dans la méthode
    System.out.println("Création d'activité reçue : " + activity.getTitle());
    
    // Assurez-vous que l'objet activity reçu a bien un ID dans son champ place
    if (activity.getPlace() == null || activity.getPlace().getId() == null) {
         throw new RuntimeException("L'ID du lieu est obligatoire");
    }

    return ResponseEntity.ok(activityService.createActivity(activity, currentUser));
}

@GetMapping("/my-activities")
@PreAuthorize("hasRole('GUIDE')")
public ResponseEntity<List<Activity>> getMyActivities(@AuthenticationPrincipal User currentUser) {
    // Le guide récupère TOUTES ses activités (ACTIVE + PENDING)
    return ResponseEntity.ok(activityService.getActivitiesByUserId(currentUser.getId()));
}

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Activity> updateActivity(
            @PathVariable Long id,
            @RequestBody Activity activity) {
        return ResponseEntity.ok(activityService.updateActivity(id, activity));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Activity> validateActivity(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.validateActivity(id));
    }
}



