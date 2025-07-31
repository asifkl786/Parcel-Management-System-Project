package com.pms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatusReportDTO {
    private String status;
    private long count;
    private double percentage;
}
