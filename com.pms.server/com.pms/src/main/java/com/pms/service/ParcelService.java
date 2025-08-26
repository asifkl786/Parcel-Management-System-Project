package com.pms.service;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.pms.dto.ParcelDto;


public interface ParcelService {
	ParcelDto createParcelWithImage(ParcelDto parcelDto) throws IOException;
    ParcelDto updateParcel(Long id, ParcelDto parcelDto);
    List<ParcelDto> getAllParcels();
    ParcelDto getParcelById(Long id);
    void deleteParcel(Long id);
    ParcelDto getParcelByTrackingNumber(String trackingNumber);
 
  //  Page<ParcelDto> getAllParcels(int page, int size, String sort);
    Page<ParcelDto> getParcelsWithPagination(int page, int size, String sort);
    // Filtered pagination example
    Page<ParcelDto> getParcelsByStatus(String status, int page, int size);
    
}


