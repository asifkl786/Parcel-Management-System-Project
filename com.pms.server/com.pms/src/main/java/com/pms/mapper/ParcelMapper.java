package com.pms.mapper;

import org.springframework.stereotype.Component;

import com.pms.dto.ParcelDto;
import com.pms.entity.Parcel;

@Component
public class ParcelMapper {

    // Convert Parcel entity to ParcelDto
    public static ParcelDto toDTO(Parcel parcel) {
        if (parcel == null) {
            return null;
        }

        ParcelDto dto = new ParcelDto();
        // Basic fields
        dto.setId(parcel.getId());
        dto.setSenderName(parcel.getSenderName());
        dto.setRecipientName(parcel.getRecipientName());
        dto.setRecipientEmail(parcel.getRecipientEmail());
        dto.setTrackingNumber(parcel.getTrackingNumber());
        
        // Status handling (convert enum to string)
        dto.setStatus(parcel.getStatus() != null ? parcel.getStatus().name() : null);
        
        // Timestamps (keep as Instant)
        dto.setReceivedAt(parcel.getReceivedAt());
        dto.setDeliveredAt(parcel.getDeliveredAt());
        dto.setEstimatedDeliveryAt(parcel.getEstimatedDeliveryAt());
        
        // Location fields
        dto.setOriginCity(parcel.getOriginCity());
        dto.setDestinationCity(parcel.getDestinationCity());
        
        // Financial fields
        dto.setShippingCost(parcel.getShippingCost());
        dto.setAdditionalFees(parcel.getAdditionalFees());
        dto.setTotalValue(parcel.getTotalValue());
        
        // Media field
        dto.setImagePath(parcel.getImagePath());
        
        // Reporting fields
        dto.setPaymentMethod(parcel.getPaymentMethod());
        dto.setParcelType(parcel.getParcelType());
        dto.setWeightCategory(parcel.getWeightCategory());
        
        return dto;
    }

    // Convert ParcelDto to Parcel entity
    public static Parcel toEntity(ParcelDto dto) {
        if (dto == null) {
            return null;
        }

        Parcel parcel = new Parcel();
        // Basic fields
        parcel.setId(dto.getId());
        parcel.setSenderName(dto.getSenderName());
        parcel.setRecipientName(dto.getRecipientName());
        parcel.setRecipientEmail(dto.getRecipientEmail());
        parcel.setTrackingNumber(dto.getTrackingNumber());
        
        // Status handling (convert string to enum)
        if (dto.getStatus() != null) {
            parcel.setStatus(Parcel.ParcelStatus.valueOf(dto.getStatus()));
        }
        
        // Timestamps
        parcel.setReceivedAt(dto.getReceivedAt());
        parcel.setDeliveredAt(dto.getDeliveredAt());
        parcel.setEstimatedDeliveryAt(dto.getEstimatedDeliveryAt());
        
        // Location fields
        parcel.setOriginCity(dto.getOriginCity());
        parcel.setDestinationCity(dto.getDestinationCity());
        
        // Financial fields
        parcel.setShippingCost(dto.getShippingCost());
        parcel.setAdditionalFees(dto.getAdditionalFees());
        parcel.setTotalValue(dto.getTotalValue());
        
        // Media field
        parcel.setImagePath(dto.getImagePath());
        
        // Reporting fields
        parcel.setPaymentMethod(dto.getPaymentMethod());
        parcel.setParcelType(dto.getParcelType());
        parcel.setWeightCategory(dto.getWeightCategory());
        
        return parcel;
    }

}
/*
package com.pms.mapper;
import org.springframework.stereotype.Component;

import com.pms.dto.ParcelDto;
import com.pms.entity.Parcel;

@Component
public class ParcelMapper {

	
	 // Convert Parcel entity to ParcelDto
    public static ParcelDto toDTO(Parcel parcel) {
    	
    	 if (parcel == null) {
             return null;
         }
    	 
        ParcelDto dto = new ParcelDto();
        dto.setId(parcel.getId());
        dto.setSenderName(parcel.getSenderName());
        dto.setRecipientName(parcel.getRecipientName());
        dto.setRecipientEmail(parcel.getRecipientEmail());
        dto.setTrackingNumber(parcel.getTrackingNumber());
        dto.setStatus(parcel.getStatus());
        dto.setImagePath(parcel.getImagePath());
        dto.setReceivedAt(parcel.getReceivedAt());
        dto.setDeliveredAt(parcel.getDeliveredAt());
        return dto;
    }
 
    
    // Convert ParcelDto to Parcel entity
    public static Parcel toEntity(ParcelDto dto) {
	    	if (dto == null) {
	            return null;
	        }
        Parcel parcel = new Parcel();
     // Note: We don't set ID when creating new entity from DTO
        parcel.setSenderName(dto.getSenderName());
        parcel.setRecipientName(dto.getRecipientName());
        parcel.setRecipientEmail(dto.getRecipientEmail());
        parcel.setTrackingNumber(dto.getTrackingNumber());
        parcel.setStatus(dto.getStatus());
        parcel.setImagePath(dto.getImagePath());
        parcel.setReceivedAt(dto.getReceivedAt());
        parcel.setDeliveredAt(dto.getDeliveredAt());
        return parcel;
    }
      
}

*/
