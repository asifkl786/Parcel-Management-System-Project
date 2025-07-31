package com.pms.exception;

public class InvalidStatusException extends RuntimeException {
	    /**
		 * Author: Asif Khan
		 * Designation: Senior Software Engineer
		 * Date: 07/12/2024
		 */
	private static final long serialVersionUID = 1L;

	public InvalidStatusException(String message) {
        super(message);
    }
}