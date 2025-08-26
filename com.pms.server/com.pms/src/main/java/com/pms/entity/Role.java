package com.pms.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Role {
	/*
	 * USER, ADMIN
	 */
	USER,       // Explicit string values
    ADMIN,
    COURIER, // Added more roles as needed
    MANAGER;
}
