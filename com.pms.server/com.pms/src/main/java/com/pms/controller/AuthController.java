package com.pms.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pms.dto.AuthenticationRequest;
import com.pms.dto.AuthenticationResponse;
import com.pms.dto.RegisterRequest;
import com.pms.parcelServiceImple.AuthenticationService;




// Purpose of This class Handles /register, /login APIs
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationService authService;

   
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request){
    	logger.info("Received request to Registered User with Name:: {}", request.getUsername());
    	 authService.register(request);
    	return new ResponseEntity<>("User Successfully Registerd",HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
    	logger.info("Received request to Login User with email:: {}", request.getEmail());
        AuthenticationResponse response = authService.login(request);
        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }
}

