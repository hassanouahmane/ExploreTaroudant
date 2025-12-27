package backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import backend.entities.Status;
import backend.entities.User;
import backend.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // Seul l'admin peut accéder à ce contrôleur
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/guides")
    public ResponseEntity<List<User>> getAllGuides() {
        return ResponseEntity.ok(adminService.getAllGuides());
    }

    @GetMapping("/tourists")
    public ResponseEntity<List<User>> getAllTourists() {
        return ResponseEntity.ok(adminService.getAllTourists());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/guides/{id}/status")
    public ResponseEntity<User> updateGuideStatus(@PathVariable Long id, @RequestParam Status status) {
        return ResponseEntity.ok(adminService.updateGuideStatus(id, status));
    }

    @DeleteMapping("/guides/{id}")
    public ResponseEntity<Void> deleteGuide(@PathVariable Long id) {
        adminService.deleteGuide(id);
        return ResponseEntity.noContent().build();
    }

    // Nouvel endpoint pour supprimer un touriste
    @DeleteMapping("/tourists/{id}")
    public ResponseEntity<Void> deleteTourist(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats/users")
    public ResponseEntity<Map<String, Long>> getUserStats() {
        return ResponseEntity.ok(adminService.getUserStatistics());
    }
}