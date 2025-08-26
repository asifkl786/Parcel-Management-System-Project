package com.pms.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pms.service.SettingsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@Slf4j
public class SettingsController {
    private final SettingsService settingsService;

    /**
     * Get current user's settings (merged with global)
     * @param principal Authenticated user
     * @return User settings with global defaults
     */
    @GetMapping
    public ResponseEntity<Map<String,String>> getMySettings(Principal principal) {
        Long userId = currentUserIdFromPrincipal(principal);
        log.info("[Settings] Fetching settings for user ID: {}", userId);
        
        try {
            Map<String, String> settings = settingsService.getSettingsForUser(userId);
            log.debug("[Settings] Successfully fetched {} settings for user {}", settings.size(), userId);
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            log.error("[Settings] Failed to get settings for user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Failed to load user settings", e);
        }
    }

    /**
     * Update current user's settings
     * @param principal Authenticated user
     * @param updates Map of setting updates
     * @return Updated settings
     */
    @PutMapping
    public ResponseEntity<Map<String,String>> updateMySettings(Principal principal, @RequestBody Map<String, Object> updates) {
        Long userId = currentUserIdFromPrincipal(principal);
        log.info("[Settings] User {} updating {} settings", userId, updates.size());
        log.debug("[Settings] Update payload: {}", updates);
        
        try {
            Map<String, String> updatedSettings = settingsService.updateSettingsForUser(userId, updates);
            log.info("[Settings] User {} successfully updated settings", userId);
            return ResponseEntity.ok(updatedSettings);
        } catch (Exception e) {
            log.error("[Settings] Update failed for user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Settings update failed", e);
        }
    }

    /**
     * Admin: Get global settings
     * @return All global settings
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/global")
    public ResponseEntity<Map<String,String>> getGlobal() {
        log.info("[Settings] Admin fetching global settings");
        
        try {
            Map<String, String> globalSettings = settingsService.getGlobalSettings();
            log.debug("[Settings] Found {} global settings", globalSettings.size());
            return ResponseEntity.ok(globalSettings);
        } catch (Exception e) {
            log.error("[Settings] Failed to fetch global settings: {}", e.getMessage());
            throw new RuntimeException("Failed to load global settings", e);
        }
    }

    /**
     * Admin: Update global settings
     * @param updates Map of setting updates
     * @return Updated global settings
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/global")
    public ResponseEntity<Map<String,String>> updateGlobal(@RequestBody Map<String, Object> updates) {
        log.info("[Settings] Admin updating {} global settings", updates.size());
        log.debug("[Settings] Global update payload: {}", updates);
        
        try {
            Map<String, String> updatedSettings = settingsService.updateGlobalSettings(updates);
            log.info("[Settings] Successfully updated global settings");
            return ResponseEntity.ok(updatedSettings);
        } catch (Exception e) {
            log.error("[Settings] Global settings update failed: {}", e.getMessage());
            throw new RuntimeException("Global settings update failed", e);
        }
    }

    /**
     * Helper method to extract user ID from Principal
     */
    private Long currentUserIdFromPrincipal(Principal principal) {
        if (principal == null) {
            log.warn("[Settings] No authenticated user found");
            return null;
        }
        
        try {
            Long userId = Long.valueOf(principal.getName());
            log.trace("[Settings] Extracted user ID: {} from principal", userId);
            return userId;
        } catch (NumberFormatException ex) {
            log.error("[Settings] Invalid user ID format in principal: {}", principal.getName());
            throw new IllegalArgumentException("Invalid user ID format");
        }
    }
}