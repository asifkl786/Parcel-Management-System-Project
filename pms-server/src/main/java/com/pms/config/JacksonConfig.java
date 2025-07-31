
package com.pms.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;

import java.time.Instant;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        JavaTimeModule timeModule = new JavaTimeModule();

        // Register custom Instant deserializer
        SimpleModule customModule = new SimpleModule();
        customModule.addDeserializer(Instant.class, new InstantDeserializer());

        mapper.registerModule(timeModule);
        mapper.registerModule(customModule);

        // Ensure ISO-8601 format
        mapper.findAndRegisterModules();
        mapper.configure(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

        return mapper;
    }
}




/*
package com.pms.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }
}

*/
//package com.pms.config;
//
//import org.springframework.context.annotation.Configuration;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//
//import jakarta.annotation.PostConstruct;
//
//@Configuration
//public class JacksonConfig {
//
//    private final ObjectMapper objectMapper;
//
//    public JacksonConfig(ObjectMapper objectMapper) {
//        this.objectMapper = objectMapper;
//    }
//
//    @PostConstruct
//    public void setUp() {
//        objectMapper.registerModule(new JavaTimeModule());
//    }
//    
////    @Bean
////    public ObjectMapper objectMapper() {
////        ObjectMapper mapper = new ObjectMapper();
////        // Register Java Time module
////        mapper.registerModule(new JavaTimeModule());
////        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // to use ISO-8601
////        return mapper;
////    }
//}
