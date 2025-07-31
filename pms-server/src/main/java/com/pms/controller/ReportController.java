package com.pms.controller;

import java.time.Instant;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pms.dto.DeliveryPerformanceReportDTO;
import com.pms.dto.ReportSummaryDTO;
import com.pms.dto.StatusReportDTO;
import com.pms.service.ReportService;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Parcel reporting API")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // Build  Summary Report REST API
    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryDTO> getSummaryReport(
        @Parameter(description = "Start date in ISO format (e.g., 2023-01-01T00:00:00Z)", required = true)
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
        
        @Parameter(description = "End date in ISO format (e.g., 2023-12-31T23:59:59Z)", required = true)
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {
        
        ReportSummaryDTO report = reportService.generateSummaryReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }
    
   // Build  Status Report REST API
    @GetMapping("/status")
    public ResponseEntity<List<StatusReportDTO>> getStatusReport() {
        List<StatusReportDTO> report = reportService.generateStatusReport();
        return ResponseEntity.ok(report);
    }
    
    // Build Delivery Performance Report REST API
    @GetMapping("/delivery-performance")
    public ResponseEntity<DeliveryPerformanceReportDTO> getDeliveryPerformanceReport(
            @RequestParam Integer month,
            @RequestParam Integer year,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String parcelType) {
        DeliveryPerformanceReportDTO dto = reportService.generateDeliveryPerformanceReport(month, year, city, parcelType);
        return ResponseEntity.ok(dto);
    }

}