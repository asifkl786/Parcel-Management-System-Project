package com.pms.controller;

import com.pms.dto.ExportFilterDTO;
import com.pms.service.ExportService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@Slf4j
@RequestMapping("/api/parcels/export")
public class ExportController {

    private final ExportService exportService;

    @Autowired
    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping("/excel")
    public void exportToExcel(HttpServletResponse response) throws IOException {
    	 log.info("Received request to export parcel for recipient: {}", response.getHeaders(null));
        exportService.exportParcelsToExcel(response, null);
    }

    @GetMapping("/pdf")
    public void exportToPDF(HttpServletResponse response) throws IOException {
    	 log.info("Received request to create parcel for recipient: {}", response.getContentType());
        exportService.exportParcelsToPDF(response, null);
    }

    @PostMapping("/excel/filtered")
    public void exportFilteredToExcel(HttpServletResponse response, 
                                     @RequestBody ExportFilterDTO filterDTO) throws IOException {
        exportService.exportParcelsToExcel(response, filterDTO);
    }

    @PostMapping("/pdf/filtered")
    public void exportFilteredToPDF(HttpServletResponse response, 
                                   @RequestBody ExportFilterDTO filterDTO) throws IOException {
    	 log.info("Received request export  parcel for recipient: {}", filterDTO.getDestinationCity());
        exportService.exportParcelsToPDF(response, filterDTO);
    }
}