package com.pms.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pms.entity.Setting;

public interface SettingRepository extends JpaRepository<Setting, Long> {
    List<Setting> findByUserId(Long userId);
    Optional<Setting> findByUserIdAndSettingKey(Long userId, String settingKey);
    List<Setting> findByUserIdIsNull(); // global
    Optional<Setting> findByUserIdIsNullAndSettingKey(String key);
}
