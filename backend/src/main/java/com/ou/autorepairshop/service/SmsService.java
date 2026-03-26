package com.ou.autorepairshop.service;

import org.springframework.stereotype.Service;

@Service
public class SmsService {

    public void sendSms(String phoneNumber, String message) {
        if (phoneNumber == null || phoneNumber.isEmpty()) return;

        // TODO: Tích hợp dịch vụ SMS thực tế (Twilio, Nexmo, ...)
        System.out.println("Sending SMS to " + phoneNumber + ": " + message);
    }
}