package com.ou.autorepairshop.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;

@Slf4j
@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() {
        try {
            InputStream serviceAccount =
                    getClass().getClassLoader()
                            .getResourceAsStream("firebase-service-account.json"); // nhớ đổi tên file example

            if (serviceAccount == null) {
                throw new RuntimeException("firebase-service-account.json not found in resources");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                log.info("Firebase initialized successfully");
            } else {
                log.info("Firebase already initialized");
            }

        } catch (Exception e) {
            log.error("Firebase init failed", e);
            throw new RuntimeException("Firebase init failed", e);
        }
    }
}