package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test-email")
@RequiredArgsConstructor
public class TestEmailController {

    private final EmailService emailService;

    @GetMapping
    public String sendTest() {
        emailService.sendEmail("tgkiet03@gmail.com", "Test Email Garage", "Đây là email test từ Garage System!");
        return "Email đã gửi!";
    }
}