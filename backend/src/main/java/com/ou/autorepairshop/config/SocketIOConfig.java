package com.ou.autorepairshop.config;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.protocol.JacksonJsonSupport;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

@org.springframework.context.annotation.Configuration
public class SocketIOConfig {

    @Value("${socketio.host:0.0.0.0}")
    private String host;

    @Value("${socketio.port:9092}")
    private Integer port;

    @Bean
    public SocketIOServer socketIOServer() {
        Configuration config = new Configuration();
        config.setHostname(host);
        config.setPort(port);
        // Cho phép CORS
        config.setOrigin("*");

        // Cấu hình Jackson để hỗ trợ Java 8 Date/Time (LocalDateTime)
        JacksonJsonSupport jsonSupport = new JacksonJsonSupport(new JavaTimeModule());
        config.setJsonSupport(jsonSupport);
        
        return new SocketIOServer(config);
    }
}
