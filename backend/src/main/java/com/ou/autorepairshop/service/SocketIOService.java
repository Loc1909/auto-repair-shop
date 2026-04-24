package com.ou.autorepairshop.service;

import com.corundumstudio.socketio.SocketIOServer;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SocketIOService {

    private final SocketIOServer server;

    @PostConstruct
    public void startServer() {
        try {
            server.start();
            log.info("Socket.io server started on port: {}", server.getConfiguration().getPort());
        } catch (Exception e) {
            log.error("Could not start Socket.io server", e);
        }
    }

    @PreDestroy
    public void stopServer() {
        server.stop();
        log.info("Socket.io server stopped");
    }

    public void emit(String event, Object data) {
        log.info("Emitting event: {} with data: {}", event, data);
        server.getBroadcastOperations().sendEvent(event, data);
    }
    
    public void emitToRoom(String room, String event, Object data) {
        log.info("Emitting to room: {} event: {} with data: {}", room, event, data);
        server.getRoomOperations(room).sendEvent(event, data);
    }
}
