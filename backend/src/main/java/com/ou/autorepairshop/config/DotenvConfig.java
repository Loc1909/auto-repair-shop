package com.ou.autorepairshop.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {

    static {
        Dotenv dotenv = Dotenv.configure().load();
        System.setProperty("DB_URL", dotenv.get("DB_URL"));
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        System.setProperty("YOUR_MAIL", dotenv.get("YOUR_MAIL"));
        System.setProperty("YOUR_MAIL_PASSWORD", dotenv.get("YOUR_MAIL_PASSWORD"));
    }
}