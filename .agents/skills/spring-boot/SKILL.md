---
name: Spring Boot Development
description: Comprehensive guidelines for developing Spring Boot applications with clean architecture, proper layering, and best practices.
---

# Spring Boot Development Guidelines

Use this skill when developing or refactoring Spring Boot applications. Follow these standards to ensure maintainability, testability, and consistency.

## 1. Architecture & Layering

Follow a standard layered architecture:

-   **Controller Layer**: Handles HTTP requests, validation, and serialization. ONLY interacts with the Service layer.
-   **Service Layer**: Contains business logic and transaction management. Interacts with Repositories.
-   **Repository Layer**: Handles data access.
-   **Domain/Entity Layer**: Represents database tables/objects.
-   **DTO (Data Transfer Object)**: Use DTOs for API requests and responses. NEVER expose Entities directly in Controllers.

## 2. Dependency Injection

-   **ALWAYS** use **Constructor Injection** for required dependencies.
-   Avoid `@Autowired` on fields (Field Injection).
-   Use Lombok's `@RequiredArgsConstructor` to simplify constructor generation.

**Good:**
```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
}
```

**Bad:**
```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
```

## 3. Controllers

-   Annotate with `@RestController`.
-   Use specific mapping annotations: `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`.
-   Return `ResponseEntity<T>` for flexibility (headers, status codes).
-   Use `@Valid` for request body validation.

**Example:**
```java
@PostMapping
public ResponseEntity<UserResponseDTO> createUser(@RequestBody @Valid UserCreateDTO createDto) {
    return ResponseEntity.status(HttpStatus.CREATED)
                         .body(userService.createUser(createDto));
}
```

## 4. Services

-   Annotate with `@Service`.
-   Use `@Transactional` on methods (or class level) that modify data.
-   Throw custom exceptions for business rule violations (e.g., `UserNotFoundException`), which should be handled globally.

## 5. Repositories

-   Extend `JpaRepository<Entity, ID>`.
-   Use Derived Query Methods where simple (e.g., `findByEmail`).
-   Use `@Query` for complex JPQL or native queries.

## 6. DTOs & Validation

-   Use **Records** (Java 14+) or Lombok `@Data`/`@Value` for immutability where appropriate.
-   Use `jakarta.validation.constraints` (e.g., `@NotNull`, `@Email`, `@Size`) inside DTOs.

**Example Request DTO:**
```java
public record UserCreateDTO(
    @NotBlank String username,
    @Email String email
) {}
```

## 7. Configuration

-   Use `@Configuration` classes for defining beans.
-   Externalize configuration properties using `@ConfigurationProperties` or `@Value`.
-   Never hardcode sensitive data (passwords, keys).

## 8. Exception Handling

-   Use `@ControllerAdvice` or `@RestControllerAdvice` to handle exceptions globally.
-   Return consistent error structures (e.g., `ErrorResponse`).

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }
}
```
