package com.voyagesync.voyagesyncproject.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class MongoConfig {

    private final ApplicationContext applicationContext;

    /**
     * To remove _class field from payload being saved in DB.
     */
    @PostConstruct
    public void init() {
        MappingMongoConverter mappingMongoConverter =
                applicationContext.getBean(MappingMongoConverter.class);
        mappingMongoConverter.setTypeMapper(new DefaultMongoTypeMapper(null));
        System.out.println("MongoConfig initialized with custom converter.");
    }

}
