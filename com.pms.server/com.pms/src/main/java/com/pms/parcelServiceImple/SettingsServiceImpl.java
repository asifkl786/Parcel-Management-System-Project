package com.pms.parcelServiceImple;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pms.entity.Setting;
import com.pms.repository.SettingRepository;
import com.pms.service.SettingsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SettingsServiceImpl implements SettingsService {

    private final SettingRepository repo;

    /**
     * Fetches merged settings (global + user-specific) for a given user
     * @param userId - ID of the user (null for global-only)
     * @return Map of setting key-value pairs
     */
    @Override
    public Map<String, String> getSettingsForUser(Long userId) {
        log.debug("Fetching settings for user ID: {}", userId);
        
        Map<String, String> out = new HashMap<>();
        
        try {
            // Load global settings first (user_id = null)
            repo.findByUserIdIsNull().forEach(s -> {
                log.trace("Loading global setting: {} = {}", s.getSettingKey(), s.getSettingValue());
                out.put(s.getSettingKey(), s.getSettingValue());
            });

            // Override with user-specific settings if userId provided
            if (userId != null) {
                repo.findByUserId(userId).forEach(s -> {
                    log.trace("Loading user setting: {} = {} for user {}", 
                        s.getSettingKey(), s.getSettingValue(), userId);
                    out.put(s.getSettingKey(), s.getSettingValue());
                });
            }
            
            log.info("Successfully loaded {} settings for user {}", out.size(), userId);
        } catch (Exception e) {
            log.error("Error fetching settings for user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Failed to load settings", e);
        }
        
        return out;
    }

    /**
     * Fetches only global settings (user_id = null)
     * @return Map of global setting key-value pairs
     */
    @Override
    public Map<String, String> getGlobalSettings() {
        log.debug("Fetching global settings");
        return getSettingsForUser(null); // Reuse existing method
    }

    /**
     * Updates settings for a specific user
     * @param userId - Target user ID
     * @param updates - Map of key-value updates
     * @return Updated merged settings
     */
    @Override
    public Map<String, String> updateSettingsForUser(Long userId, Map<String, Object> updates) {
        log.info("Updating {} settings for user {}", updates.size(), userId);
        return upsertSettings(userId, updates);
    }

    /**
     * Updates global settings (user_id = null)
     * @param updates - Map of key-value updates
     * @return Updated global settings
     */
    @Override
    public Map<String, String> updateGlobalSettings(Map<String, Object> updates) {
        log.info("Updating {} global settings", updates.size());
        return upsertSettings(null, updates);
    }

    /**
     * Internal method to handle both insert and update operations
     * @param userId - Target user ID (null for global)
     * @param updates - Map of key-value updates
     * @return Updated merged settings
     */
    private Map<String, String> upsertSettings(Long userId, Map<String, Object> updates) {
        Map<String, String> result = new HashMap<>();
        
        try {
            updates.forEach((key, value) -> {
                String stringValue = convertToString(value);
                log.debug("Processing setting: {} = {} for user {}", key, stringValue, userId);

                // Find existing setting if present
                Optional<Setting> existing = (userId == null)
                        ? repo.findByUserIdIsNullAndSettingKey(key)
                        : repo.findByUserIdAndSettingKey(userId, key);

                Setting setting = existing.orElseGet(() -> {
                    log.debug("Creating new setting for key: {}", key);
                    Setting newSetting = new Setting();
                    newSetting.setUserId(userId);
                    newSetting.setSettingKey(key);
                    newSetting.setCategory(detectCategory(key)); // Auto-categorize
                    return newSetting;
                });

                // Update value
                setting.setSettingValue(stringValue);
                repo.save(setting);
                log.trace("Saved setting: {}", setting);
                
                result.put(key, stringValue);
            });
            
            log.info("Successfully updated {} settings for user {}", updates.size(), userId);
        } catch (Exception e) {
            log.error("Error updating settings for user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Settings update failed", e);
        }
        
        // Return fresh merged settings
        return getSettingsForUser(userId);
    }

    /**
     * Converts any object value to String representation
     */
    private String convertToString(Object value) {
        if (value == null) return null;
        return value instanceof String ? (String) value : value.toString();
    }

    /**
     * Auto-detects category based on setting key
     */
    private String detectCategory(String key) {
        if (key.startsWith("notification.")) return "notifications";
        if (key.startsWith("ui.")) return "user_interface";
        if (key.startsWith("system.")) return "system";
        return "general";
    }
}