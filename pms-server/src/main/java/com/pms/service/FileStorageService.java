package com.pms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {
    
    private final Path fileStorageLocation;
    
    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) throws IOException {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.fileStorageLocation);
    }
    
    public String storeFile(MultipartFile file) throws IOException {
        // StringUtils from Spring's utility package
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        
        // Generate unique filename
        String uniqueFileName = UUID.randomUUID() + "_" + fileName;
        
        Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        return uniqueFileName;
    }
    
    public Resource loadFileAsResource(String fileName) throws FileNotFoundException {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new FileNotFoundException("File not found " + fileName);
            }
        } catch (Exception ex) {
            throw new FileNotFoundException("File not found " + fileName);
        }
    }
}