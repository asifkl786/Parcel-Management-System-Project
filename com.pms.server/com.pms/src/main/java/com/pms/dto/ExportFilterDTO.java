package com.pms.dto;

import com.pms.entity.Parcel;
import lombok.Data;

import java.time.Instant;

@Data
public class ExportFilterDTO {
    private Parcel.ParcelStatus status;
    private Instant startDate;
    private Instant endDate;
    private String originCity;
    private String destinationCity;
    private String parcelType;
    private String weightCategory;
}