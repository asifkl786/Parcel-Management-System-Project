package com.pms.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pms.dto.ParcelDto;
import com.pms.service.FileStorageService;
import com.pms.service.ParcelService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/parcels")
@Slf4j
public class ParcelController {

    @Autowired
    private ParcelService parcelService;
    
    @Autowired
    private FileStorageService fileStorageService;
    

    // Build REST API for create parcel with image
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ParcelDto> createParcelWithImage(@ModelAttribute ParcelDto parcelDTO) throws IOException { 
        log.info("Received request to create parcel for recipient: {}", parcelDTO.getRecipientName());
        ParcelDto savedParcel = parcelService.createParcelWithImage(parcelDTO);
        return new ResponseEntity<>(savedParcel, HttpStatus.CREATED);
    }

    // Build REST API for get All parcels
    @GetMapping("/parcels")
    public List<ParcelDto> getAllParcels() {
    	 log.info("Received request to Get All Parcels");
        return parcelService.getAllParcels();
    }

    // Build REST API for update
    @PutMapping("/{id}/update")
    public ResponseEntity<ParcelDto> updateStatus(@PathVariable Long id, @RequestBody ParcelDto parcelDto) {
    	 log.info("Received request to create parcel for recipient: {}", parcelDto.getRecipientName());
           ParcelDto parcelDtos = parcelService.updateParcel(id, parcelDto);
        return new ResponseEntity<>(parcelDtos, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ParcelDto> getParcel(@PathVariable Long id) {
    	 log.info("Received request to getParcel by id : {}", id);
        return ResponseEntity.ok(parcelService.getParcelById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteParcel(@PathVariable Long id) {
    	 log.info("Received request to Delete Parcel by id: {}", id);
        parcelService.deleteParcel(id);
        return ResponseEntity.ok("Parcel deleted successfully");
    }
    
    @GetMapping("/image/{fileName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) throws FileNotFoundException {
    	 log.info("Received request getImage Whose fileNmae is : {}", fileName);
        Resource resource = fileStorageService.loadFileAsResource(fileName);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // or detect content type
                .body(resource);
    }
    
    // Build REST API for Tracking parcel 
    @GetMapping("/tracking")
    public ResponseEntity<ParcelDto> getParcelByTrackingNumber(@RequestParam String number) {
    	log.info("Received request to Tracking parcel Whose Tracking id is : {}", number);
        ParcelDto parcelDto = parcelService.getParcelByTrackingNumber(number);
        return new ResponseEntity<>(parcelDto, HttpStatus.OK);
        
    }
    /*----------------------------------Pagination code Start -------------------------------------------------------*/
    @GetMapping
    public ResponseEntity<Page<ParcelDto>> getAllParcels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "receivedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
    	 log.info("Received request getAll Parcels: {}"); 
        Page<ParcelDto> parcels = parcelService.getParcelsWithPagination(
            page, 
            size, 
            sortBy + "," + sortDir
        );
        return ResponseEntity.ok(parcels);
    }
    @GetMapping("/filter")
    public ResponseEntity<Page<ParcelDto>> getParcelsByStatus(
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
    	 log.info("Received request to getParcelsByStatus: {}", status);
        Page<ParcelDto> parcels = parcelService.getParcelsByStatus(status, page, size);
        return ResponseEntity.ok(parcels);
    }
    
    /*----------------------------------Pagination code End -------------------------------------------------------*/
}
