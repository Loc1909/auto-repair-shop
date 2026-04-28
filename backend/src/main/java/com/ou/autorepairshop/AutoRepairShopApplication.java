package com.ou.autorepairshop;

import com.ou.autorepairshop.entity.Role;
import com.ou.autorepairshop.entity.User;

import com.ou.autorepairshop.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class AutoRepairShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(AutoRepairShopApplication.class, args);
	}
	@Bean
	CommandLineRunner initAdmin(UserRepository userRepo, PasswordEncoder encoder) {
		return args -> {
			if (userRepo.findByUsername("admin").isEmpty()) {
				User admin = User.builder()
						.username("admin")
						.password(encoder.encode("123456"))
						.email("admin@gmail.com")
						.role(Role.ROLE_ADMIN)
						.active(true)
						.build();

				userRepo.save(admin);
				System.out.println("Admin account created: admin / 123456");
			}
		};
	}


}
