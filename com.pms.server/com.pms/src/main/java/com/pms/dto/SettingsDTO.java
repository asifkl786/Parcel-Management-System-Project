package com.pms.dto;


import lombok.Data;
import java.util.Map;

@Data
public class SettingsDTO {
    // map of keys -> values (frontend friendly)
    private Map<String, Object> values;
}

