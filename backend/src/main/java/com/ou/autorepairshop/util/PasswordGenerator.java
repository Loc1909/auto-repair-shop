package com.ou.autorepairshop.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Scanner;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        Scanner scanner = new Scanner(System.in);

        System.out.println("=== Cong cu Hash Mat khau (BCrypt) ===");
        
        while (true) {
            System.out.print("\nNhap mat khau can hash (hoac go 'exit' de thoat): ");
            String password = scanner.nextLine();

            if ("exit".equalsIgnoreCase(password)) {
                break;
            }

            if (password.isBlank()) {
                continue;
            }

            String encodedPassword = encoder.encode(password);
            System.out.println("Mat khau goc: " + password);
            System.out.println("Ma hash (luu vao DB): " + encodedPassword);
            
            // Thu nghiem kiem tra lai
            boolean isMatch = encoder.matches(password, encodedPassword);
            System.out.println("Kiem tra khop: " + (isMatch ? " Thanh cong" : " That bai"));
        }
        
        scanner.close();
    }
}
