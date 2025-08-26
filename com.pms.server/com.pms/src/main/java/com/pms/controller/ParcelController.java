package com.pms.controller;

import java.io.FileNotFoundException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    /**
     * Create new parcel with optional image attachment
     * @param parcelDTO Parcel details
     * @param imageFile Optional image file
     * @return Created parcel with status 201
     */
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ParcelDto> createParcelWithImage(
            @ModelAttribute ParcelDto parcelDTO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        
        log.info("[Parcel] Creating new parcel for recipient: {}", parcelDTO.getRecipientName());
        log.debug("[Parcel] Creation payload: {}", parcelDTO);
        
        try {
            ParcelDto savedParcel = parcelService.createParcelWithImage(parcelDTO);
            log.info("[Parcel] Successfully created parcel ID: {} for {}", 
                   savedParcel.getId(), savedParcel.getRecipientName());
            return new ResponseEntity<>(savedParcel, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("[Parcel] Failed to create parcel: {}", e.getMessage());
            throw new RuntimeException("Parcel creation failed", e);
        }
    }

    /**
     * Get all parcels (unpaginated)
     * @return List of all parcels
     */
    @GetMapping("/all")
    public ResponseEntity<List<ParcelDto>> getAllParcels() {
        log.info("[Parcel] Fetching all parcels");
        
        try {
            List<ParcelDto> parcels = parcelService.getAllParcels();
            log.debug("[Parcel] Found {} parcels", parcels.size());
            return ResponseEntity.ok(parcels);
        } catch (Exception e) {
            log.error("[Parcel] Failed to fetch parcels: {}", e.getMessage());
            throw new RuntimeException("Failed to load parcels", e);
        }
    }

    /**
     * Update parcel details
     * @param id Parcel ID
     * @param parcelDto Updated parcel data
     * @return Updated parcel
     */
    @PutMapping("/{id}/update")
    public ResponseEntity<ParcelDto> updateParcel(
            @PathVariable Long id, 
            @RequestBody ParcelDto parcelDto) {
        
        log.info("[Parcel] Updating parcel ID: {}", id);
        log.debug("[Parcel] Update payload: {}", parcelDto);
        
        try {
            ParcelDto updatedParcel = parcelService.updateParcel(id, parcelDto);
            log.info("[Parcel] Successfully updated parcel ID: {}", id);
            return new ResponseEntity<>(updatedParcel, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[Parcel] Update failed for ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Parcel update failed", e);
        }
    }

    /**
     * Get parcel by ID
     * @param id Parcel ID
     * @return Parcel details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ParcelDto> getParcelById(@PathVariable Long id) {
        log.info("[Parcel] Fetching parcel ID: {}", id);
        
        try {
            ParcelDto parcel = parcelService.getParcelById(id);
            log.debug("[Parcel] Found parcel: {}", parcel);
            return ResponseEntity.ok(parcel);
        } catch (Exception e) {
            log.error("[Parcel] Not found parcel ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Parcel not found", e);
        }
    }

    /**
     * Delete parcel
     * @param id Parcel ID
     * @return Success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteParcel(@PathVariable Long id) {
        log.info("[Parcel] Deleting parcel ID: {}", id);
        
        try {
            parcelService.deleteParcel(id);
            log.info("[Parcel] Successfully deleted parcel ID: {}", id);
            return ResponseEntity.ok("Parcel deleted successfully");
        } catch (Exception e) {
            log.error("[Parcel] Delete failed for ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Parcel deletion failed", e);
        }
    }

    /**
     * Get parcel image
     * @param fileName Image filename
     * @return Image resource
     */
    @GetMapping("/image/{fileName:.+}")
    public ResponseEntity<Resource> getParcelImage(@PathVariable String fileName) {
        log.info("[Parcel] Fetching image: {}", fileName);
        
        try {
            Resource resource = fileStorageService.loadFileAsResource(fileName);
            log.debug("[Parcel] Found image file: {}", fileName);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (FileNotFoundException e) {
            log.error("[Parcel] Image not found: {}", fileName);
            throw new RuntimeException("Image not found", e);
        }
    }

    /**
     * Track parcel by tracking number
     * @param number Tracking number
     * @return Parcel details
     */
    @GetMapping("/tracking")
    public ResponseEntity<ParcelDto> trackParcel(@RequestParam String number) {
        log.info("[Parcel] Tracking parcel with number: {}", number);
        
        try {
            ParcelDto parcel = parcelService.getParcelByTrackingNumber(number);
            log.debug("[Parcel] Found tracked parcel: {}", parcel);
            return new ResponseEntity<>(parcel, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[Parcel] Tracking failed for {}: {}", number, e.getMessage());
            throw new RuntimeException("Tracking failed", e);
        }
    }
    /*----------------------------------Pagination code Start -------------------------------------------------------*/
    /**
     * Get paginated parcels with sorting
     * @param page Page number (0-based)
     * @param size Page size
     * @param sortBy Sort field
     * @param sortDir Sort direction (asc/desc)
     * @return Page of parcels
     */
    @GetMapping
    public ResponseEntity<Page<ParcelDto>> getParcelsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "receivedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        log.info("[Parcel] Fetching paginated parcels (page:{}, size:{})", page, size);
        log.debug("[Parcel] Sort by: {} {}", sortBy, sortDir);
        
        try {
            Page<ParcelDto> parcels = parcelService.getParcelsWithPagination(
                page, size, sortBy + "," + sortDir);
            log.debug("[Parcel] Found {} parcels on page {}", 
                     parcels.getNumberOfElements(), page);
            return ResponseEntity.ok(parcels);
        } catch (Exception e) {
            log.error("[Parcel] Pagination failed: {}", e.getMessage());
            throw new RuntimeException("Pagination failed", e);
        }
    }

    /**
     * Filter parcels by status with pagination
     * @param status Parcel status to filter by
     * @param page Page number
     * @param size Page size
     * @return Page of filtered parcels
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<ParcelDto>> filterParcelsByStatus(
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        
        log.info("[Parcel] Filtering parcels by status: {}", status);
        log.debug("[Parcel] Pagination (page:{}, size:{})", page, size);
        
        try {
            Page<ParcelDto> parcels = parcelService.getParcelsByStatus(status, page, size);
            log.debug("[Parcel] Found {} {} parcels", 
                     parcels.getNumberOfElements(), status);
            return ResponseEntity.ok(parcels);
        } catch (Exception e) {
            log.error("[Parcel] Status filter failed: {}", e.getMessage());
            throw new RuntimeException("Filtering failed", e);
        }
    }
    /*----------------------------------Pagination code End -------------------------------------------------------*/
}