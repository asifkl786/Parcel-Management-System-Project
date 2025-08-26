package com.pms.util;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.pms.entity.Parcel;
import jakarta.servlet.http.HttpServletResponse;

import java.awt.*;
import java.io.IOException;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Component;

@Component
public class PDFExporter {

    public void export(List<Parcel> parcels, HttpServletResponse response) throws IOException {
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, response.getOutputStream());
        
        document.open();
        
        // Create title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLUE);
        Paragraph title = new Paragraph("PARCELS REPORT", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        
        // Create table
        PdfPTable table = new PdfPTable(10);
        table.setWidthPercentage(100f);
        table.setWidths(new float[] {1.0f, 2.0f, 2.0f, 3.0f, 2.5f, 2.0f, 2.0f, 2.0f, 2.0f, 2.0f});
        table.setSpacingBefore(10);
        
        // Header cells
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.BLUE);
        cell.setPadding(5);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.WHITE);
        
        // Add headers
        String[] headers = {
            "ID", "Sender", "Recipient", "Tracking #", "Status", 
            "Origin", "Destination", "Received At", "Shipping Cost", "Total Value"
        };
        
        for (String header : headers) {
            cell.setPhrase(new Phrase(header, headerFont));
            table.addCell(cell);
        }
        
        // Date formatter for Instant
        DateTimeFormatter formatter = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.SHORT)
            .withLocale(Locale.getDefault())
            .withZone(ZoneId.systemDefault());
        
        // Data cells
        Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
        
        for (Parcel parcel : parcels) {
            table.addCell(new Phrase(String.valueOf(parcel.getId()), dataFont));
            table.addCell(new Phrase(parcel.getSenderName(), dataFont));
            table.addCell(new Phrase(parcel.getRecipientName(), dataFont));
            table.addCell(new Phrase(parcel.getTrackingNumber(), dataFont));
            table.addCell(new Phrase(parcel.getStatus().toString(), dataFont));
            table.addCell(new Phrase(parcel.getOriginCity(), dataFont));
            table.addCell(new Phrase(parcel.getDestinationCity(), dataFont));
            
            // Format Instant dates properly
            String receivedAt = parcel.getReceivedAt() != null 
                ? formatter.format(parcel.getReceivedAt())
                : "N/A";
            table.addCell(new Phrase(receivedAt, dataFont));
            
            table.addCell(new Phrase(parcel.getShippingCost().toString(), dataFont));
            table.addCell(new Phrase(parcel.getTotalValue().toString(), dataFont));
        }
        
        document.add(table);
        document.close();
    }
}