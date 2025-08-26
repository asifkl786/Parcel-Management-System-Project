package com.pms.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class LocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {
    
    private static final DateTimeFormatter[] FORMATTERS = {
        DateTimeFormatter.ISO_LOCAL_DATE_TIME,          // yyyy-MM-dd'T'HH:mm:ss
        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"),  // without seconds
        DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"), // alternate format
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")  // space instead of T
    };

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) 
            throws IOException {
        String dateStr = p.getText().trim();
        
        if (dateStr.isEmpty()) {
            return null;
        }

        // Try all supported formats
        for (DateTimeFormatter formatter : FORMATTERS) {
            try {
                return LocalDateTime.parse(dateStr, formatter);
            } catch (DateTimeParseException e) {
                // Try next format
            }
        }
        
        throw new RuntimeException("Could not parse date: " + dateStr + 
               ". Supported formats: yyyy-MM-dd'T'HH:mm:ss, yyyy-MM-dd'T'HH:mm, etc.");
    }
}