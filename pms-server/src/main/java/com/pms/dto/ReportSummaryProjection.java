package com.pms.dto;

import java.math.BigDecimal;

public interface ReportSummaryProjection {
    Long getTotalParcels();
    Long getDeliveredCount();
    Long getInTransitCount();
    Long getReturnedCount();
    BigDecimal getTotalRevenue();
    BigDecimal getAverageShippingCost();
    String getMonthYear();
    Long getMonthlyCount();
}
