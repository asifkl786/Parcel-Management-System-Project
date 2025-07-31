package com.pms.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class InstantDeserializer extends JsonDeserializer<Instant> {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;

    @Override
    public Instant deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        try {
            return Instant.parse(value);
        } catch (DateTimeParseException e) {
            throw new IOException("Failed to parse Instant from: " + value, e);
        }
    }
}
