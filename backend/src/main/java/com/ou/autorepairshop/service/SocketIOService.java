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
        // Listener: client yêu cầu vào phòng theo repairOrderId
        server.addEventListener("join_order", String.class, (client, orderId, ackRequest) -> {
            String room = "order_" + orderId;
            client.joinRoom(room);
            log.info("Client {} joined room: {}", client.getSessionId(), room);
        });

        // Listener: client rời phòng
        server.addEventListener("leave_order", String.class, (client, orderId, ackRequest) -> {
            String room = "order_" + orderId;
            client.leaveRoom(room);
            log.info("Client {} left room: {}", client.getSessionId(), room);
        });

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

    /**
     * Gửi sự kiện chỉ đến những client trong room tương ứng với repairOrderId.
     * Tên room theo quy ước: "order_{repairOrderId}"
     */
    public void emitToRoom(String room, String event, Object data) {
        log.info("Emitting to room: {} event: {} with data: {}", room, event, data);
        server.getRoomOperations(room).sendEvent(event, data);
    }
}
