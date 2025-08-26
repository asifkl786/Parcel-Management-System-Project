package com.pms.util;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import com.pms.entity.Parcel;

import jakarta.servlet.http.HttpServletResponse;

@Component  // Add this annotation
public class ExcelExporter {

    public void export(List<Parcel> parcels, HttpServletResponse response) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Parcels");
        
        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {
            "ID", "Sender", "Recipient", "Recipient Email", "Tracking Number",
            "Received At", "Delivered At", "Estimated Delivery",
            "Origin", "Destination", "Status", "Shipping Cost",
            "Additional Fees", "Total Value", "Payment Method",
            "Parcel Type", "Weight Category"
        };
        
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // Create data rows
        int rowNum = 1;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        for (Parcel parcel : parcels) {
            Row row = sheet.createRow(rowNum++);
            
            row.createCell(0).setCellValue(parcel.getId());
            row.createCell(1).setCellValue(parcel.getSenderName());
            row.createCell(2).setCellValue(parcel.getRecipientName());
            row.createCell(3).setCellValue(parcel.getRecipientEmail());
            row.createCell(4).setCellValue(parcel.getTrackingNumber());
            
            if (parcel.getReceivedAt() != null) {
                row.createCell(5).setCellValue(formatter.format(parcel.getReceivedAt()));
            }
            
            if (parcel.getDeliveredAt() != null) {
                row.createCell(6).setCellValue(formatter.format(parcel.getDeliveredAt()));
            }
            
            if (parcel.getEstimatedDeliveryAt() != null) {
                row.createCell(7).setCellValue(formatter.format(parcel.getEstimatedDeliveryAt()));
            }
            
            row.createCell(8).setCellValue(parcel.getOriginCity());
            row.createCell(9).setCellValue(parcel.getDestinationCity());
            row.createCell(10).setCellValue(parcel.getStatus().toString());
            row.createCell(11).setCellValue(parcel.getShippingCost().doubleValue());
            row.createCell(12).setCellValue(parcel.getAdditionalFees().doubleValue());
            row.createCell(13).setCellValue(parcel.getTotalValue().doubleValue());
            row.createCell(14).setCellValue(parcel.getPaymentMethod());
            row.createCell(15).setCellValue(parcel.getParcelType());
            row.createCell(16).setCellValue(parcel.getWeightCategory());
        }
        
        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
        
        workbook.write(response.getOutputStream());
        workbook.close();
    }
}