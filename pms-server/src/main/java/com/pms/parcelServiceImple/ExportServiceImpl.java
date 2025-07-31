package com.pms.parcelServiceImple;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.dto.ExportFilterDTO;
import com.pms.entity.Parcel;
import com.pms.repository.ParcelRepository;
import com.pms.service.ExportService;
import com.pms.util.ExcelExporter;
import com.pms.util.PDFExporter;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ExportServiceImpl implements ExportService {

    private final ParcelRepository parcelRepository;
    private final ExcelExporter excelExporter;
    private final PDFExporter pdfExporter;

    @Autowired
    public ExportServiceImpl(ParcelRepository parcelRepository, 
                           ExcelExporter excelExporter, 
                           PDFExporter pdfExporter) {
        this.parcelRepository = parcelRepository;
        this.excelExporter = excelExporter;
        this.pdfExporter = pdfExporter;
    }

    @Override
    public void exportParcelsToExcel(HttpServletResponse response, ExportFilterDTO filterDTO) throws IOException {
        List<Parcel> parcels = getParcelsForExport(filterDTO);
        log.info("Export parcel for recipient: {}", filterDTO.getDestinationCity());
        response.setContentType("application/octet-stream");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());
        
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=parcels_" + currentDateTime + ".xlsx";
        response.setHeader(headerKey, headerValue);
        
        excelExporter.export(parcels, response);
    }

    @Override
    public void exportParcelsToPDF(HttpServletResponse response, ExportFilterDTO filterDTO) throws IOException {
    	log.info("Export parcel as pdf formate for recipient: {}", filterDTO.getDestinationCity());
        List<Parcel> parcels = getParcelsForExport(filterDTO);
        
        response.setContentType("application/pdf");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());
        
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=parcels_" + currentDateTime + ".pdf";
        response.setHeader(headerKey, headerValue);
        
        pdfExporter.export(parcels, response);
    }

    private List<Parcel> getParcelsForExport(ExportFilterDTO filterDTO) {
    	
        if (filterDTO == null) {
            return parcelRepository.findAll();
        }
        log.info("Export parcel as list in formate of pdf for recipient: {}", filterDTO.getDestinationCity());
        Specification<Parcel> spec = Specification.where(null);
        
        if (filterDTO.getStatus() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), filterDTO.getStatus()));
        }
        
        if (filterDTO.getStartDate() != null && filterDTO.getEndDate() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.between(root.get("receivedAt"), filterDTO.getStartDate(), filterDTO.getEndDate()));
        }
        
        if (filterDTO.getOriginCity() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("originCity"), filterDTO.getOriginCity()));
        }
        
        if (filterDTO.getDestinationCity() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("destinationCity"), filterDTO.getDestinationCity()));
        }
        
        return parcelRepository.findAll(spec);
    }
}