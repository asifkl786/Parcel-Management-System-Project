package com.pms.dto;

import lombok.Data;


//Purpose of This class Payloads for APIs 
@Data
public class AuthenticationRequest {
 private String email;
 private String password;
}
