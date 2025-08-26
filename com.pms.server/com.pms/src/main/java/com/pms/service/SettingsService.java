package com.pms.service;

import java.util.Map;

public interface SettingsService {
    Map<String, String> getSettingsForUser(Long userId);
    Map<String, String> getGlobalSettings();
    Map<String, String> updateSettingsForUser(Long userId, Map<String, Object> updates);
    Map<String, String> updateGlobalSettings(Map<String, Object> updates);
}
