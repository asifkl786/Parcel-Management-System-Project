package com.pms.service;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

import com.pms.dto.DeliveryPerformanceReportDTO;
import com.pms.dto.ReportSummaryDTO;
import com.pms.dto.StatusReportDTO;

public interface ReportService {
	
	ReportSummaryDTO generateSummaryReport(Instant startDate, Instant endDate);
	List<StatusReportDTO> generateStatusReport();
  //DeliveryPerformanceReportDTO generateDeliveryPerformanceReport(Integer month, Integer year);
    DeliveryPerformanceReportDTO generateDeliveryPerformanceReport(Integer month, Integer year, String city, String parcelType);
    ResponseEntity<Resource> exportToExcel(Instant startDate, Instant endDate) throws IOException;

}
