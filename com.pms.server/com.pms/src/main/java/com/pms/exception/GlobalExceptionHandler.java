package com.pms.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handle ResourceNotFoundException
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        log.error("Resource not found: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    /**
     * Handle ExportException
     */
    @ExceptionHandler(ExportException.class)
    public ResponseEntity<?> handleExportException(ExportException ex, WebRequest request) {
        HttpServletRequest httpRequest = ((ServletWebRequest) request).getRequest();
        String acceptHeader = httpRequest.getHeader("Accept");
        String contentType = httpRequest.getContentType();

        if (isExportRequest(acceptHeader, contentType)) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);
            return new ResponseEntity<>(
                    "Export failed: " + ex.getMessage(),
                    headers,
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        ErrorResponse error = new ErrorResponse(
                "EXPORT_ERROR",
                ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handle all unexpected exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAllExceptions(Exception ex, WebRequest request) {
        HttpServletRequest httpRequest = ((ServletWebRequest) request).getRequest();
        String acceptHeader = httpRequest.getHeader("Accept");
        String contentType = httpRequest.getContentType();

        if (isExportRequest(acceptHeader, contentType)) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);
            return new ResponseEntity<>(
                    "An error occurred during export: " + ex.getMessage(),
                    headers,
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        log.error("Unexpected error: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                "SERVER_ERROR",
                ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Utility: Check if request was for PDF or Excel export
     */
    private boolean isExportRequest(String acceptHeader, String contentType) {
        return (acceptHeader != null && (acceptHeader.contains("application/pdf") ||
                                         acceptHeader.contains("application/vnd.ms-excel"))) ||
               (contentType != null && (contentType.contains("application/pdf") ||
                                        contentType.contains("application/vnd.ms-excel")));
    }

    /**
     * Error response format
     */
    @Data
    @AllArgsConstructor
    private static class ErrorResponse {
        private String code;
        private String message;
        private int status;
    }

    /**
     * Custom exception for export failures
     */
    public static class ExportException extends RuntimeException {
        public ExportException(String message) {
            super(message);
        }

        public ExportException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
