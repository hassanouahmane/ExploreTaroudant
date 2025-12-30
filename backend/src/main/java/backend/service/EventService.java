package backend.service;

import backend.entities.Event;
import backend.entities.Status;
import backend.entities.User;
import backend.entities.Role;
import backend.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
//@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }
    public List<Event> getAllEvents() {
        return eventRepository.findAllByOrderByStartDateDesc();
    }

    public List<Event> getAllActiveEvents() {
        return eventRepository.findByStatusAndEndDateAfterOrderByStartDateAsc(Status.ACTIVE, LocalDate.now());
    }

    public List<Event> getPendingEvents() {
        return eventRepository.findByStatus(Status.PENDING);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByEndDateAfterOrderByStartDateAsc(LocalDate.now());
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'id: " + id));
    }

   @Transactional
    public Event createEvent(Event event, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            event.setStatus(Status.ACTIVE);
        } else {
            event.setStatus(Status.PENDING);
        }
        event.setProposedBy(currentUser);
        return eventRepository.save(event);
    }

  
    @Transactional
    public Event updateEvent(Long id, Event eventDetails) {
        Event event = getEventById(id);

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setStartDate(eventDetails.getStartDate());
        event.setEndDate(eventDetails.getEndDate());
        event.setLocation(eventDetails.getLocation());

        return eventRepository.save(event);
    }
      public List<Event> getEventsByProposer(User user) {
    // On récupère les événements proposés par cet utilisateur spécifique
    return eventRepository.findByProposedByOrderByStartDateDesc(user);
}
    @Transactional
    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }

    @Transactional
    public Event validateEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        event.setStatus(Status.ACTIVE);
        return eventRepository.save(event);
    }
}