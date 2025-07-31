package com.pms.parcelServiceImple;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pms.dto.ParcelDto;
import com.pms.entity.Parcel;
import com.pms.exception.ResourceNotFoundException;
import com.pms.mapper.ParcelMapper;
import com.pms.repository.ParcelRepository;
import com.pms.service.FileStorageService;
import com.pms.service.ParcelService;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ParcelServiceImpl implements ParcelService {

	@Autowired
	private ParcelRepository parcelRepository;

	@Autowired
	private FileStorageService fileStorageService;

	@Override
	@Transactional
	public ParcelDto createParcelWithImage(ParcelDto parcelDto) throws IOException {
		// 1.Validate input
		if (parcelDto == null) {
			throw new IllegalArgumentException("ParcelDto cannot be null");
		}

		MultipartFile file = parcelDto.getImageFile();
		// 1. Validate input
		if (file != null && file.isEmpty()) {
			throw new IllegalArgumentException("File cannot be empty");
		}

		// Handle file upload if present
		if (file != null && !file.isEmpty()) {
			String fileName = fileStorageService.storeFile(file);
			parcelDto.setImagePath("/api/parcels/image/" + fileName);
		}

		// 2.Generate tracking number if not provided
		if (parcelDto.getTrackingNumber() == null || parcelDto.getTrackingNumber().isEmpty()) {
			parcelDto.setTrackingNumber(generateTrackingNumber());
		}
		// 3. Set receivedAt if null (on DTO to ensure mapper includes it)
		if (parcelDto.getReceivedAt() == null) {
		    parcelDto.setReceivedAt(Instant.now()); // Use Instant instead of LocalDateTime
		}

		// 4. Convert DTO → Entity (after all DTO modifications)
		Parcel parcel = ParcelMapper.toEntity(parcelDto);
		// 5. Save to database
		Parcel savedParcel = parcelRepository.save(parcel);
		log.info("Parcel Successfulley Created: {}", parcelDto.getRecipientName());
		// 6. Return the saved entity as DTO
		return ParcelMapper.toDTO(savedParcel);
	}

	private String generateTrackingNumber() {
		return "PM" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
	}

	@Transactional
	public ParcelDto markAsDelivered(Long parcelId) {
	    // 1. Find the parcel
	    Parcel parcel = parcelRepository.findById(parcelId)
	            .orElseThrow(() -> new ResourceNotFoundException("Parcel not found with id: " + parcelId));

	    // 2. Validate current status
	    if (parcel.getStatus() == Parcel.ParcelStatus.DELIVERED) {
	        throw new IllegalStateException("Parcel is already marked as DELIVERED");
	    }

	    // 3. Validate status transition (optional business rule)
	    if (parcel.getStatus() != Parcel.ParcelStatus.IN_TRANSIT) {
	        throw new IllegalStateException(
	            "Parcel must be IN_TRANSIT to be marked as DELIVERED. Current status: " + parcel.getStatus()
	        );
	    }

	    // 4. Update status and timestamp
	    parcel.setStatus(Parcel.ParcelStatus.DELIVERED);
	    parcel.setDeliveredAt(Instant.now());

	    // 5. Save and return
	    Parcel updatedParcel = parcelRepository.save(parcel);
	    return ParcelMapper.toDTO(updatedParcel);
	}
	@Override
	public ParcelDto updateParcel(Long id, ParcelDto parcelDto) {
		
		// 1. Find existing entity
	    Parcel existingParcel  = parcelRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Parcel not found"));
	    
	    // 2. Update fields (never set the ID)
	    //parcelObj.setId(parcelDto.getId());
	    existingParcel.setReceivedAt(parcelDto.getReceivedAt());
	    existingParcel.setRecipientEmail(parcelDto.getRecipientEmail());
	    existingParcel.setRecipientName(parcelDto.getRecipientName());
	    existingParcel.setSenderName(parcelDto.getSenderName());
	    existingParcel.setStatus(parcelDto.getStatusAsEnum());
	   // existingParcel.setStatus(parcelDto.getStatus());
	    existingParcel.setDeliveredAt(parcelDto.getDeliveredAt());
	    
	    // 3. Save updated entity
        Parcel updatedParcel = parcelRepository.save(existingParcel);
        log.info("Parcel Successfully updated whose name is : {}", parcelDto.getRecipientName());
        return ParcelMapper.toDTO(updatedParcel);
	}

	@Override
	public List<ParcelDto> getAllParcels() {
		//return parcelRepository.findAll().stream().map(ParcelMapper::toDTO).collect(Collectors.toList());
		 List<ParcelDto> allParcels = parcelRepository.findAll().stream().map(ParcelMapper::toDTO).collect(Collectors.toList());
		 log.info("{} :: Parcels Successfully Fetch From Database", allParcels.size());
		 return allParcels;
		
	}

	@Override
	public ParcelDto getParcelById(Long id) {
		return ParcelMapper.toDTO(
				parcelRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Parcel not found")));
	}

	@Override
	public void deleteParcel(Long id) {
		log.info("Parcels Successfully deleted whose id :: {}",id);
		parcelRepository.deleteById(id);
	}

	
	// This method for tracking parcel
	@Override
	public ParcelDto getParcelByTrackingNumber(String trackingNumber) {
		 Parcel parcel = parcelRepository.findByTrackingNumber(trackingNumber)
	                .orElseThrow(() -> new ResourceNotFoundException(
	                    "Parcel not found with tracking number: " + trackingNumber));
	        return ParcelMapper.toDTO(parcel);
	}
/*-------------------------------------------------Pagination Code Start -------------------------------------------*/
	// This method for pagination
	@Override
	public Page<ParcelDto> getParcelsWithPagination(int page, int size, String sort) {
		 // Split sort parameter into property and direction
        String[] sortParams = sort.split(",");
        String sortBy = sortParams[0];
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc") 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Parcel> parcelPage = parcelRepository.findAll(pageable);
        
        return parcelPage.map(this::convertToDto);
    }
	
    
	// This method for pagination by status
	@Override
	public Page<ParcelDto> getParcelsByStatus(String status, int page, int size) {
		 Pageable pageable = PageRequest.of(page, size);
	        return parcelRepository.findByStatus(status, pageable).map(this::convertToDto);
	}
	
	private ParcelDto convertToDto(Parcel parcel) {
	    if (parcel == null) {
	        return null;
	    }
	    
	    ParcelDto dto = new ParcelDto();
	    dto.setId(parcel.getId());
	    dto.setSenderName(parcel.getSenderName());
	    dto.setRecipientName(parcel.getRecipientName());
	    dto.setRecipientEmail(parcel.getRecipientEmail());
	    dto.setTrackingNumber(parcel.getTrackingNumber());
	    dto.setStatusFromEnum(parcel.getStatus());
	   // dto.setStatus(parcel.getStatus());
	    dto.setImagePath(parcel.getImagePath());
	    dto.setReceivedAt(parcel.getReceivedAt());
	    dto.setDeliveredAt(parcel.getDeliveredAt());
	    
	    return dto;
	}
	/*-------------------------------------------------Pagination Code End -------------------------------------------*/


}
