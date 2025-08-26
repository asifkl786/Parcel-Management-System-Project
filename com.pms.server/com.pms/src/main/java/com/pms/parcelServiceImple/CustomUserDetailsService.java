package com.pms.parcelServiceImple;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pms.entity.User;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.UserRepository;


// Purpose of This class  Load user by username/email
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(email)
               // .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        		.orElseThrow(() -> new ResourceNotFoundException("User is not exists with given email" + email));
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                //user.getUsername(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}


