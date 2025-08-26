package com.pms.parcelServiceImple;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.pms.dto.DeliveryPerformanceReportDTO;
import com.pms.dto.ReportSummaryDTO;
import com.pms.dto.ReportSummaryProjection;
import com.pms.dto.StatusReportDTO;
import com.pms.entity.Parcel;
import com.pms.repository.ReportRepository;
import com.pms.service.ReportService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    @Override
    public ReportSummaryDTO generateSummaryReport(Instant start, Instant end) {
        List<ReportSummaryProjection> projections = reportRepository.getSummaryReportMetrics(start, end);

        ReportSummaryDTO dto = new ReportSummaryDTO();
        dto.setTotalParcels(0L);
        dto.setDeliveredCount(0L);
        dto.setInTransitCount(0L);
        dto.setReturnedCount(0L);
        dto.setTotalRevenue(BigDecimal.ZERO);
        dto.setAverageShippingCost(BigDecimal.ZERO);

        Map<String, Long> monthlyMap = new HashMap<>();

        for (ReportSummaryProjection p : projections) {
            dto.setTotalParcels(dto.getTotalParcels() + p.getTotalParcels());
            dto.setDeliveredCount(dto.getDeliveredCount() + p.getDeliveredCount());
            dto.setInTransitCount(dto.getInTransitCount() + p.getInTransitCount());
            dto.setReturnedCount(dto.getReturnedCount() + p.getReturnedCount());
            dto.setTotalRevenue(dto.getTotalRevenue().add(p.getTotalRevenue()));
            dto.setAverageShippingCost(dto.getAverageShippingCost().add(p.getAverageShippingCost()));
            monthlyMap.put(p.getMonthYear(), p.getMonthlyCount());
        }

        dto.setMonthlyCounts(monthlyMap);
        
        // 💡 Fetch and set payment method distribution
        List<Object[]> methodCounts = reportRepository.findPaymentMethodCounts(start, end);
        Map<String, Long> methodMap = new HashMap<>();
        for (Object[] row : methodCounts) {
            String method = (String) row[0];
            Long count = (Long) row[1];
            methodMap.put(method, count);
        }

        dto.setPaymentMethodDistribution(methodMap);

        return dto;
    }


    @Override
    public List<StatusReportDTO> generateStatusReport() {
        List<Object[]> counts = reportRepository.findParcelStatusCounts();
        long total = reportRepository.findTotalParcelCount();

        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] row : counts) {
            String status = row[0] != null ? row[0].toString() : "UNKNOWN";
            Long count = row[1] != null ? (Long) row[1] : 0L;
            statusMap.put(status, count);
        }

        List<StatusReportDTO> result = new ArrayList<>();

        for (Parcel.ParcelStatus parcelStatus : Parcel.ParcelStatus.values()) {
            String statusName = parcelStatus.name();
            long count = statusMap.containsKey(statusName) ? statusMap.get(statusName) : 0L;
            double percentage = total > 0 ? (count * 100.0 / total) : 0.0;
            percentage = Math.round(percentage * 100.0) / 100.0;

            result.add(StatusReportDTO.builder()
                    .status(statusName)
                    .count(count)
                    .percentage(percentage)
                    .build());
        }

        return result;
    }


    @Override
    public DeliveryPerformanceReportDTO generateDeliveryPerformanceReport(Integer month, Integer year, String city, String parcelType) {
        List<Parcel> deliveredParcels = reportRepository.findDeliveredParcelsForReport(month, year, city, parcelType);

        long totalDelivered = deliveredParcels.size();
        long onTimeCount = deliveredParcels.stream()
            .filter(p -> p.getEstimatedDeliveryAt() != null && !p.getDeliveredAt().isAfter(p.getEstimatedDeliveryAt()))
            .count();

        double performance = totalDelivered == 0 ? 0.0 : (onTimeCount * 100.0 / totalDelivered);

        return DeliveryPerformanceReportDTO.builder()
                .month(month)
                .year(year)
                .totalDelivered(totalDelivered)
                .onTimeDeliveries(onTimeCount)
                .performancePercentage(performance)
                .build();
    }


	@Override
	public ResponseEntity<Resource> exportToExcel(Instant startDate, Instant endDate) throws IOException {
		// TODO Auto-generated method stub
		return null;
	}
}