package com.thecodereveal.shopease.controllers;

import com.thecodereveal.shopease.services.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/file")
@CrossOrigin
public class FileUpload {

    @Autowired
    FileUploadService fileUploadService;

    @PostMapping
    public ResponseEntity<?> fileUpload(@RequestParam(value = "file", required = true) MultipartFile file,
                                        @RequestParam(value = "fileName", required = true) String fileName) {

        String fileUrl = String.valueOf(fileUploadService.uploadFile(file, fileName));

        Map<String, Object> response = new HashMap<>();
        response.put("message", "File uploaded successfully");
        response.put("url", fileUrl);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }
}