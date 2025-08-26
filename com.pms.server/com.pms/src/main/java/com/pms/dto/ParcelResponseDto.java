package com.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParcelResponseDto {
    private Long id;
    private String senderName;
    private String recipientName;
    private String trackingNumber;
    private String status;
    private String imageUrl;
    private String receivedAt;
    private String deliveredAt;
}