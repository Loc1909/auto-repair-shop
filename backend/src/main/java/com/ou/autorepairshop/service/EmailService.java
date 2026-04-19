package com.ou.autorepairshop.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String content) {
        if (to == null || to.isEmpty()) return;

        System.out.println("Attempting to send email to: " + to);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);

            helper.setText(content, true);

            mailSender.send(message);

            System.out.println("Email sent to: " + to);

        } catch (Exception e) {
            throw new RuntimeException("Send mail failed", e);
        }
    }
}