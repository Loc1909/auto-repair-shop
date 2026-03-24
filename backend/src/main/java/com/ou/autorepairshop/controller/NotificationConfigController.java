package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.entity.NotificationConfig;
import com.ou.autorepairshop.service.NotificationConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/notification-config")
@RequiredArgsConstructor
public class NotificationConfigController {

    private final NotificationConfigService service;

    @GetMapping
    public List<NotificationConfig> getAll() {
        return service.getAll();
    }

    @PostMapping
    public NotificationConfig create(@RequestBody NotificationConfig config) {
        return service.create(config);
    }

    @PutMapping("/{id}")
    public NotificationConfig update(@PathVariable Long id,
                                     @RequestBody NotificationConfig config) {
        return service.update(id, config);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}