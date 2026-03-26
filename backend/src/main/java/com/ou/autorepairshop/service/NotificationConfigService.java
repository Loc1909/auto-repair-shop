package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.NotificationConfig;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.repository.NotificationConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationConfigService { //Vai trò quản lý cấu hình

    private final NotificationConfigRepository repository;

    public List<NotificationConfig> getAll() {
        return repository.findAll();
    }

    public NotificationConfig getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NotificationConfig", id));
    }

    public NotificationConfig create(NotificationConfig config) {
        return repository.save(config);
    }

    public NotificationConfig update(Long id, NotificationConfig newConfig) {
        NotificationConfig existing = getById(id);

        existing.setName(newConfig.getName());
        existing.setEventType(newConfig.getEventType());
        existing.setChannels(newConfig.getChannels());
        existing.setTemplate(newConfig.getTemplate());
        existing.setStatus(newConfig.getStatus());
        existing.setSendTimeOffset(newConfig.getSendTimeOffset());

        return repository.save(existing);
    }

    public void delete(Long id) {
        NotificationConfig existing = getById(id);
        repository.delete(existing);
    }
}