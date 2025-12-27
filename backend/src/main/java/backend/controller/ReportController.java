package backend.controller;

import backend.entities.Report;
import backend.entities.User;
import backend.service.ReportService;
import backend.entities.ReportStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // Tout utilisateur connecté peut envoyer un rapport
    @PostMapping
    public ResponseEntity<Report> submitReport(
            @RequestBody Report report,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(reportService.createReport(report, currentUser));
    }

    // Réservé à l'Admin pour la modération
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Report> updateStatus(
            @PathVariable Long id,
            @RequestParam ReportStatus status) {
        return ResponseEntity.ok(reportService.updateReportStatus(id, status));
    }
}