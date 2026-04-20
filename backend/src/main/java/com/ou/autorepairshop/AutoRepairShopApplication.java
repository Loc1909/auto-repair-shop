package com.ou.autorepairshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AutoRepairShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(AutoRepairShopApplication.class, args);
	}

}
