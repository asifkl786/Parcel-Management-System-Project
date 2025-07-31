package com.pms.dto;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.pms.entity.Parcel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParcelDto {
    private Long id;
    private String senderName;
    private String recipientName;
    private String recipientEmail;
    private String trackingNumber;
    
    private String imagePath;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Kolkata")
    private Instant receivedAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Kolkata")
    private Instant deliveredAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Kolkata")
    private Instant estimatedDeliveryAt;
  //  private LocalDateTime receivedAt;
    
  //  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
  //  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  //  private LocalDateTime deliveredAt;
   

    
  //  private Instant estimatedDeliveryAt;
    private String originCity;
    private String destinationCity;
    private BigDecimal shippingCost;
    private BigDecimal additionalFees;
    private BigDecimal totalValue;
    private String paymentMethod;
    private String parcelType;
    private String weightCategory;
    
    /* --------------------------------File field handling Start ----------------------------------------------*/
    // For file upload (not persisted, just for receiving the file)
    private MultipartFile imageFile;
    /* --------------------------------File field handling End ----------------------------------------------*/
    
    
    /* --------------------------------Enum field handling Start ----------------------------------------------*/
    
    // Enum as String in DTO for better JSON compatibility
    private String status; // Will store enum name as string
    
    // Enum conversion helpers
    public Parcel.ParcelStatus getStatusAsEnum() {
        return status != null ? Parcel.ParcelStatus.valueOf(status) : null;
    }

    public void setStatusFromEnum(Parcel.ParcelStatus status) {
        this.status = status != null ? status.name() : null;
    }
    
    /* --------------------------------Enum field handling End ----------------------------------------------*/
    
    // Getters and Setters for all fields
}