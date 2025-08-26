package com.pms.parcelServiceImple;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pms.dto.AuthenticationRequest;
import com.pms.dto.AuthenticationResponse;
import com.pms.dto.RegisterRequest;
import com.pms.entity.Role;
import com.pms.entity.User;
import com.pms.exception.EmailAlreadyExistsException;
import com.pms.exception.InvalidCredentialsException;
import com.pms.repository.UserRepository;
import com.pms.security.jwt.JwtService;

@Service
public class AuthenticationService {
	
	private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    
    // This method register user without login 
    public AuthenticationResponse registerWithoutLogin(RegisterRequest request) {
    	// mene yaha ek check point lga diya
    	if (userRepo.existsByEmail(request.getEmail())) {
    	    throw new EmailAlreadyExistsException("User already exists with this email");
    	}

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        userRepo.save(user);
        logger.info(" User Successfully Registerd with Name:: {}", request.getUsername());
        /*
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);
        return new AuthenticationResponse(token,user.getUsername());   */
        
        // Yahan directly naya UserDetails create karo
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
        
        String token = jwtService.generateToken(userDetails);
        return new AuthenticationResponse(token, user.getUsername());
    }
    
    
    // This method for register user without token generation
    public String register(RegisterRequest request) {
    	// mene yaha ek check point lga diya
    	if (userRepo.existsByEmail(request.getEmail())) {
    	    throw new EmailAlreadyExistsException("User already exists with this email");
    	}
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        try {
            user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role provided. Must be USER or ADMIN");
        }

        userRepo.save(user);
        logger.info(" User Successfully Registerd with Name:: {}", request.getUsername());
    	return null;
    }
    
    // This method login user
    public AuthenticationResponse login(AuthenticationRequest request) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        if (!passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }
        logger.info(" User Successfully Logedin with email:: {}", request.getEmail());
        String token = jwtService.generateToken(userDetails);
        return new AuthenticationResponse(token,userDetails.getUsername());
    }
}
