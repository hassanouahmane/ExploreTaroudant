package backend.controller;


import backend.entities.Event;
import backend.service.EventService;
import backend.entities.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/events")
//@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService =  eventService;
    }

  


    @GetMapping("/all") 
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // PUBLIC : Uniquement les événements validés
    @GetMapping
    public ResponseEntity<List<Event>> getAllActiveEvents() {
        return ResponseEntity.ok(eventService.getAllActiveEvents());
    }

    // ADMIN : Modération
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Event>> getPendingEvents() {
        return ResponseEntity.ok(eventService.getPendingEvents());
    }

    @GetMapping("/my-proposals")
@PreAuthorize("hasRole('GUIDE')")
public ResponseEntity<List<Event>> getMyProposedEvents(@AuthenticationPrincipal User currentUser) {
    // Utilisation du service pour filtrer par utilisateur connecté
    return ResponseEntity.ok(eventService.getEventsByProposer(currentUser));
}

    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIDE')")
    public ResponseEntity<Event> createEvent(
            @RequestBody Event event, 
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(eventService.createEvent(event, currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @RequestBody Event event) {
        return ResponseEntity.ok(eventService.updateEvent(id, event));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Event> validateEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.validateEvent(id));
    }
}
