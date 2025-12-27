package backend.service;

import backend.entities.Report;
import backend.entities.ReportStatus;
import backend.entities.User;
import backend.repositories.ReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @Transactional
    public Report createReport(Report report, User currentUser) {
        report.setReporter(currentUser);
        report.setStatus(ReportStatus.OPEN);
        return reportRepository.save(report);
    }

    // Uniquement pour l'Admin
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Transactional
    public Report updateReportStatus(Long id, ReportStatus status) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rapport non trouvé"));
        report.setStatus(status);
        return reportRepository.save(report);
    }
}