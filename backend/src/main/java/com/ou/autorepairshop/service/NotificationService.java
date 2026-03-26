package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.NotificationChannel;
import com.ou.autorepairshop.entity.NotificationConfig;
import com.ou.autorepairshop.entity.NotificationEvent;
import com.ou.autorepairshop.entity.NotificationStatus;
import com.ou.autorepairshop.repository.NotificationConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {    //Vai trò gửi thông báo

    private final NotificationConfigRepository configRepo;
    private final EmailService emailService;


    public void send(NotificationEvent event, String email, Map<String, String> data) {

        NotificationConfig config = configRepo.findByEventType(event)
                .orElse(null);

        if (config == null || config.getStatus() != NotificationStatus.ACTIVE)
            return;

        String content = buildContent(config.getTemplate(), data);

        if (config.getChannels().contains(NotificationChannel.EMAIL)) {
            emailService.sendEmail(email, "Notification", content);
        }


    }

    private String buildContent(String template, Map<String, String> data) {
        String result = template;
        for (Map.Entry<String, String> entry : data.entrySet()) {
            result = result.replace("{" + entry.getKey() + "}", entry.getValue());
        }
        return result;
    }
}