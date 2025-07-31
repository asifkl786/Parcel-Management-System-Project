package com.pms.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportSummaryDTO {
    private long totalParcels;
    private long deliveredCount;
    private long inTransitCount;
    private long returnedCount;
    private BigDecimal totalRevenue;
    private BigDecimal averageShippingCost;
    private Map<String, Long> monthlyCounts;
    private Map<String, Long> paymentMethodDistribution;

    // Constructor for JPA query results
    public ReportSummaryDTO(
        Long totalParcels,
        Long deliveredCount,
        Long inTransitCount,
        Long returnedCount,
        BigDecimal totalRevenue,
        BigDecimal averageShippingCost,
        String monthYear,
        Long monthlyCount) {
        
        this.totalParcels = totalParcels != null ? totalParcels : 0L;
        this.deliveredCount = deliveredCount != null ? deliveredCount : 0L;
        this.inTransitCount = inTransitCount != null ? inTransitCount : 0L;
        this.returnedCount = returnedCount != null ? returnedCount : 0L;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.averageShippingCost = averageShippingCost != null ? 
            averageShippingCost.setScale(2, RoundingMode.HALF_UP) : 
            BigDecimal.ZERO;
        
        // Initialize maps (they'll be populated separately)
        this.monthlyCounts = new HashMap<>();
        this.paymentMethodDistribution = new HashMap<>();
    }
}