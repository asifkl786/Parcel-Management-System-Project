package com.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPerformanceReportDTO {
    private Integer month;  // ✅ Must exist
    private Integer year;
    private long totalParcels;
    private long totalDelivered;
    private long onTimeDeliveries;
    private double onTimePercentage;
    private long lateDeliveries;
    private double latePercentage;
    private double performancePercentage;
}
