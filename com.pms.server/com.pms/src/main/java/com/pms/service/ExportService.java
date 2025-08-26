
  package com.pms.service;
  
  
  import com.pms.dto.ExportFilterDTO; import
  jakarta.servlet.http.HttpServletResponse;
  
  import java.io.IOException;
  
  public interface ExportService { void
  exportParcelsToExcel(HttpServletResponse response, ExportFilterDTO filterDTO)
  throws IOException; void exportParcelsToPDF(HttpServletResponse response,
  ExportFilterDTO filterDTO) throws IOException; }
 