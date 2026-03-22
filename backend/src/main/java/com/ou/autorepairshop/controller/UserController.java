package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.UserResponse;
import com.ou.autorepairshop.entity.User;
import com.ou.autorepairshop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ================= USERS (PAGINATION + SEARCH) =================
    @GetMapping("/users")
    public Page<UserResponse> getUsers(
            @RequestParam(required = false) String search,
            Pageable pageable
    ) {
        return userService.getUsers(search, pageable);
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}