package com.pms.entity;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "parcels")
public class Parcel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderName;
    private String recipientName;
    private String recipientEmail;
    
    @Column(name = "tracking_number", unique = true)
    private String trackingNumber;
    
   
    // private String status; // Received, In Storage, Delivered

     //    private LocalDateTime receivedAt;
     //    private LocalDateTime deliveredAt;
    private Instant receivedAt;
    private Instant deliveredAt;
    private Instant estimatedDeliveryAt;

    private String originCity;
    private String destinationCity;
    
    private BigDecimal shippingCost;
    private BigDecimal additionalFees;
    private BigDecimal totalValue;
    
    
    // New fields for reporting
    private String paymentMethod; // CASH, CREDIT, ONLINE
    private String parcelType;    // DOCUMENT, PACKAGE, FREIGHT
    private String weightCategory; // SMALL, MEDIUM, LARGE
    
    /* --------------------------------File field handling Start ----------------------------------------------*/
    private String imagePath;
    /* --------------------------------File field handling End ----------------------------------------------*/
    
    /* --------------------------------Enum field handling Start ----------------------------------------------*/
    @Enumerated(EnumType.STRING)
    private ParcelStatus status;
    public enum ParcelStatus {
        RECEIVED, IN_TRANSIT, DELIVERED, RETURNED, FAILED_DELIVERY,IN_STORAGE
    }
    /* --------------------------------Enum field handling End ----------------------------------------------*/
    
    
    // Getters, Setters, Constructors
}

